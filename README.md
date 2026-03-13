# **State Machine Editor**

An intuitive state machine (state transition diagram) editor. 
It generates skeleton code from the created diagrams in real-time, making it ideal for embedded system projects and more.

## **🚀 Getting Started**

Once the extension is installed, any file with the `.smjson` extension will automatically open in the **Design View**. You can start building your state machine visually right away.

## **✨ Key Features**

### **1. Diagram Editing**

* **Node Manipulation**: Add and place normal States, Initial states, and Choice nodes.
* **Transitions**: Connect nodes via drag-and-drop. Supports line bending by adding Waypoints.
* **Multi-select**: Range selection by dragging the canvas, or individual selection using Shift + Click.
* **Zoom Functionality**: Zoom in and out **centered on the cursor position** using the mouse wheel. Seamlessly switch between a bird's-eye view of large diagrams and detailed editing.

### **2. Smart View Switching**

For those who prefer editing raw JSON or need to perform quick text-based refactoring, you can toggle the editor view at any time:

* **Toggle View**: Press `Ctrl + Shift + T` (or `Cmd + Shift + T` on macOS) to switch between the **Visual Design View** and the standard **VS Code Text Editor**.

### **3. Extensible Code Generation**

The editor features a powerful, decoupled code generation engine driven by JavaScript. By processing the underlying `.smjson` model through custom JS generator scripts, the editor can produce high-quality source code for **virtually any programming language**.

* **Universal Logic**: A central logic engine cleanses and resolves complex behaviors like Choice nodes and hierarchical state nesting into a flat design context.
* **Language Agnostic**: Since generators are written in JS, you can easily map the state machine logic to C (switch-case), Python (class/if-elif), JavaScript (event loops), or even documentation formats.

### **4. Shortcut Keys**

Supports the following shortcuts for efficient editing:

| Shortcut | Action |
| :---- | :---- |
| **Ctrl + S** | Save changes |
| **Ctrl + Z** | Undo |
| **Ctrl + Y / Shift + Z** | Redo |
| **Ctrl + C** | Copy |
| **Ctrl + X** | Cut |
| **Ctrl + V** | Paste |
| **Ctrl + A** | Select all elements |
| **Ctrl + Shift + T** | **Toggle between Design and Text view** |
| **Ctrl + Wheel** | Zoom in/out centered on the mouse cursor |
| **Delete / Backspace** | Delete selected elements |
| **Escape** | Deselect / Close menu / Cancel transition creation |

### **5. Advanced Features**

* **Internal Actions**: Write Entry, Do, and Exit action codes for each state.
* **Instant Preview**: Preview and copy generated code immediately as you modify the diagram.
* **History Management**: Automatically tracks state machine changes for Undo/Redo support.