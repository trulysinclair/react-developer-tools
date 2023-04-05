// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import createComponent from "./createComponent";

const handleCreateComponent = async (args: any, styled?: boolean) => {
  const componentName = await vscode.window.showInputBox({
    prompt: `What is the name of your component?`,
    ignoreFocusOut: true,
    valueSelection: [-1, -1],
  });

  if (!componentName) {
    return;
  }

  if (args) {
    const path = args.fsPath;
    console.log(path);
    
    createComponent(componentName, { dir: path, styled });
  } else {
    createComponent(componentName, { styled });
  }
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = [
    vscode.commands.registerCommand(
      "react-developer-tools.createComponent",
      (args) => {
        vscode.window.showInformationMessage(
          "Create Component from React Developer Tools!!"
        );
        handleCreateComponent(args);
      }
    ),
    vscode.commands.registerCommand(
      "react-developer-tools.helloWorld",
      (args) => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage(
          "Hello World from React Developer Tools!!"
        );
      }
    ),
  ];

  context.subscriptions.push(...disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
