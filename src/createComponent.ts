import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import arrowComponent from "./templates/arrowComponent";
import styledArrowComponent from "./templates/styledArrowComponent";
import styledFile from "./templates/styledFile";

export default async (
  componentName: string,
  { dir, styled }: { dir?: string; styled?: boolean }
) => {
  const COMPONENT_FILE_NAME = `${componentName}.tsx`;
  const projectRoot = (vscode.workspace.workspaceFolders as any)[0].uri.fsPath;

  if (!dir) {
    dir =
      (await vscode.window.showInputBox({
        value: "/",
        prompt: `Path from root`,
        ignoreFocusOut: true,
        valueSelection: [-1, -1],
      })) || "";
  }
  if (!dir.includes(projectRoot)) {
    dir = projectRoot + dir;
  }
  if (dir[dir.length - 1] !== "/") {
    dir = dir + "/";
  }
  const dirWithFileName = dir + componentName;
  const filePath = (fileName: string) => dirWithFileName + "/" + fileName;

  createDir(dirWithFileName);

  // if (styled) {
  //   await createFile(
  //     filePath(COMPONENT_FILE_NAME),
  //     styledArrowComponent(componentName)
  //   );
  //   await createFile(filePath(STYLED_FILE_NAME), styledFile());
  // } else {
  await createFile(
    filePath(COMPONENT_FILE_NAME),
    arrowComponent(componentName)
  );
  // }

  setTimeout(() => {
    vscode.workspace
      .openTextDocument(filePath(COMPONENT_FILE_NAME))
      .then((editor) => {
        if (!editor) {
          return;
        }
        vscode.window.showTextDocument(editor);
      });
  }, 50);
};

const createDir = (targetDir: string) => {
  const pathSeperator = path.sep;
  const initDir = path.isAbsolute(targetDir) ? pathSeperator : "";
  const baseDir = __dirname;

  return targetDir.split(pathSeperator).reduce((parentDir, childDir) => {
    const cwd = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(cwd);
    } catch (err: any) {
      if (err.code === "EEXIST") {
        return cwd;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === "ENOENT") {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const error = ["EACCES", "EPERM", "EISDIR"].indexOf(err.code) > -1;
      if (!error || (error && cwd === path.resolve(targetDir))) {
        throw err;
      }
    }

    return cwd;
  }, initDir);
};

const createFile = async (filePath: string, content: string) => {
  if (!fs.existsSync(filePath)) {
    fs.createWriteStream(filePath).close();

    fs.writeFile(filePath, content, (err) => {
      if (err) {
        vscode.window.showErrorMessage("React Developer Tools can't write to file.");
      }
    });
  } else {
    vscode.window.showWarningMessage("File already exists.");
  }
};
