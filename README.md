# **State Machine Editor**

An intuitive state machine (state transition diagram) editor. 
It generates C skeleton code from the created diagrams in real-time, making it ideal for embedded system projects and more.

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

### **3. Shortcut Keys**

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

### **4. Advanced Features**

* **Internal Actions**: Write Entry, Do, and Exit action codes for each state.
* **Code Generation**: Instantly preview and copy C switch-case and structure-based code based on state transitions in the Code View.
* **History Management**: Automatically tracks state machine changes for Undo/Redo support.