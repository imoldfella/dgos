import { compile } from './compile'
import * as ts from "typescript";
import tsvfs from '@typescript/vfs'
import fs from 'fs'
import { TextDecoder } from 'util';

function ex() {
  const fsMap = tsvfs.createDefaultMapFromNodeModules({ target: ts.ScriptTarget.ES2015 })
  fsMap.set('index.ts', 'console.log("Hello World")')
}

function main() {

  const filename = "test.ts";
  const codeb = fs.readFileSync('./simple.tsx')
  const code = new TextDecoder().decode(codeb)
  //`const test: number = 1 + 2;`;

  const sourceFile = ts.createSourceFile(
    filename, code, ts.ScriptTarget.Latest
  );

  function printRecursiveFrom(
    node: ts.Node, indentLevel: number, sourceFile: ts.SourceFile
  ) {
    const indentation = "-".repeat(indentLevel);
    const syntaxKind = ts.SyntaxKind[node.kind];
    const nodeText = node.getText(sourceFile);
    console.log(`${indentation}${syntaxKind}: ${nodeText}`);

    node.forEachChild(child =>
      printRecursiveFrom(child, indentLevel + 1, sourceFile)
    );
  }

  printRecursiveFrom(sourceFile, 0, sourceFile);
}



//main()

function xx() {
  const filename = "/Users/jimhurd/dev/datagrove/dgos/packages/dg/src/album.tsx"
  const program = ts.createProgram([filename], {
    "jsx": ts.JsxEmit.ReactJSX,
    "jsxImportSource": "solid-js"
  });
  console.log(program.getRootFileNames())
  const sourceFile = program.getSourceFile(filename);
  program.emit()
  const diagnostics = ts.getPreEmitDiagnostics(program);

  for (const diagnostic of diagnostics) {
    const message = diagnostic.messageText;
    const file = diagnostic.file;
    const filename = file?.fileName;

    const lineAndChar = file?.getLineAndCharacterOfPosition(
      diagnostic.start ?? 0
    )
    if (!lineAndChar) continue
    const line = lineAndChar.line + 1;
    const character = lineAndChar.character + 1;

    console.log(message);
    console.log(`(${filename}:${line}:${character})`);
  }

  const typeChecker = program.getTypeChecker();

  function recursivelyPrintVariableDeclarations(
    node: ts.Node, sourceFile: ts.SourceFile
  ) {
    if (ts.isVariableDeclaration(node)) {
      const nodeText = node.getText(sourceFile);
      const type = typeChecker.getTypeAtLocation(node);
      const typeName = typeChecker.typeToString(type, node);

      console.log(nodeText);
      console.log(`(${typeName})`);
    }

    node.forEachChild(child =>
      recursivelyPrintVariableDeclarations(child, sourceFile)
    );
  }

  recursivelyPrintVariableDeclarations(sourceFile!, sourceFile!);


  function printRecursiveFrom(
    node: ts.Node, indentLevel: number, sourceFile: ts.SourceFile
  ) {
    const indentation = "-".repeat(indentLevel);
    const syntaxKind = ts.SyntaxKind[node.kind];
    const nodeText = node.getText(sourceFile);
    console.log(`${indentation}${syntaxKind}: ${nodeText}`);

    node.forEachChild(child =>
      printRecursiveFrom(child, indentLevel + 1, sourceFile)
    );
  }

  printRecursiveFrom(sourceFile!, 0, sourceFile!);
}
xx()
