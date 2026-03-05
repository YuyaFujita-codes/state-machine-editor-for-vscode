/*
 * Copyright (C) 2026 Yuya Fujita
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 */

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// カスタムエディタ（.smjson用）の登録
	context.subscriptions.push(
		vscode.window.registerCustomEditorProvider(
			'stateMachineEditor.smjsonEditor',
			new SmjsonEditorProvider(context)
		)
	);

	// コマンドパレットからの手動起動コマンド（必要であれば残す）
	context.subscriptions.push(
		vscode.commands.registerCommand('stateMachineEditor.start', () => {
			vscode.window.showInformationMessage('.smjsonファイルを開いてエディタを開始してください。');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('stateMachineEditor.toggleEditor', async () => {
			const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
			if (!activeTab) { return; }

			const input = activeTab.input;
			let uri: vscode.Uri | undefined;

			// 1. URIを安全に抽出するための型ガード
			if (input instanceof vscode.TabInputText || input instanceof vscode.TabInputCustom) {
				uri = input.uri;
			}

			if (!uri) { return; }

			// 2. カスタムエディタが開いているかどうかの判定
			const isCustom = input instanceof vscode.TabInputCustom &&
				input.viewType === 'stateMachineEditor.smjsonEditor';

			// 3. 適切なエディタ ID で開き直す
			if (isCustom) {
				// テキストエディタに戻す
				await vscode.commands.executeCommand('vscode.openWith', uri, 'default');
			} else if (uri.path.endsWith('.smjson')) {
				// カスタムエディタに切り替える
				await vscode.commands.executeCommand('vscode.openWith', uri, 'stateMachineEditor.smjsonEditor');
			}
		})
	);
}

class SmjsonEditorProvider implements vscode.CustomTextEditorProvider {
	constructor(private readonly context: vscode.ExtensionContext) { }

	/**
	 * .smjson ファイルが開かれた時に呼ばれるメインルーチン
	 */
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		// Webviewの基本設定
		webviewPanel.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.joinPath(this.context.extensionUri, 'media')
			]
		};

		// HTMLの中身をセット（非同期で読み込み）
		webviewPanel.webview.html = await this.getHtml(webviewPanel.webview);

		/**
		 * VS Code のファイル内容を Webview (Vue) へ送信する
		 */

		const updateWebview = () => {
			const text = document.getText();
			console.log(text);
			webviewPanel.webview.postMessage({
				type: 'load',
				text: text,
			});
		};



		// 2. VS Code側でファイルが保存・変更されたらWebviewに通知
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				// 外部変更や自動保存時にWebviewを同期
				if (e.contentChanges.length > 0) {
					updateWebview();
				}
			}
		});

		// パネルが閉じられたらイベントを解除
		webviewPanel.onDidDispose(() => changeDocumentSubscription.dispose());

		/**
		 * Webview (Vue) からのメッセージ受信
		 */
		webviewPanel.webview.onDidReceiveMessage(async e => {
			switch (e.type) {
				case 'update':
					// Webviewから送られてきたJSONでファイルを上書き保存
					this.updateTextDocument(document, e.content);
					return;
				case 'save':
					this.updateTextDocument(document, e.content);
					await document.save();
					return;
				case 'alert':
					vscode.window.showErrorMessage(e.text);
					return;
				case 'ready': // Webview側の準備ができたら送る
					updateWebview();
					return;
			}
		});
	}

	/**
	 * ドキュメントを新しいテキストで更新する
	 */
	private async updateTextDocument(document: vscode.TextDocument, content: string) {
		// 1. 現在のドキュメント内容を取得
		const currentText = document.getText();
		if (currentText.length === content.length) {
			// 2. 変更前と全く同じであれば、何もしない
			if (currentText === content) {
				return;
			}
		}

		const edit = new vscode.WorkspaceEdit();

		// ドキュメント全体を置換する範囲を正確に計算
		const lastLine = document.lineAt(document.lineCount - 1);
		const range = new vscode.Range(
			new vscode.Position(0, 0),
			lastLine.range.end
		);

		edit.replace(document.uri, range, content);

		// WorkspaceEditを適用。成功時のみ処理を継続
		return vscode.workspace.applyEdit(edit);
	}

	/**
	 * media/index.html を読み込み、パスを Webview 用に変換して返す
	 */
	private async getHtml(webview: vscode.Webview): Promise<string> {
		const extensionUri = this.context.extensionUri;

		// 1. index.html の物理パスを取得して読み込む
		const htmlPath = vscode.Uri.joinPath(extensionUri, 'media', 'index.html');
		const htmlBuffer = await vscode.workspace.fs.readFile(htmlPath);
		let htmlContent = new TextDecoder().decode(htmlBuffer);

		// 2. assets フォルダへの Webview 用 URI を作成
		const assetsUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'assets'));

		// 3. HTML内のパスを置換 (Viteなどのビルド成果物に対応)
		// ./assets/ -> vscode-webview://... /assets/
		htmlContent = htmlContent.replace(/src="\.\/assets\//g, `src="${assetsUri}/`);
		htmlContent = htmlContent.replace(/href="\.\/assets\//g, `href="${assetsUri}/`);
		htmlContent = htmlContent.replace(/src="\/assets\//g, `src="${assetsUri}/`);
		htmlContent = htmlContent.replace(/href="\/assets\//g, `href="${assetsUri}/`);

		// 4. セキュリティ設定 (CSP) の生成
		const csp = `
            <meta http-equiv="Content-Security-Policy" content="
                default-src 'none';
                img-src ${webview.cspSource} https: data:;
                script-src ${webview.cspSource} 'unsafe-eval' 'unsafe-inline'; 
                style-src ${webview.cspSource} 'unsafe-inline';
                font-src ${webview.cspSource};
                connect-src ${webview.cspSource} https:;
            ">`;

		// headタグの直後にCSPを挿入
		return htmlContent.replace('<head>', `<head>${csp}`);
	}
}