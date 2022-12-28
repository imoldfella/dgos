import * as ts from "typescript";
import tsvfs from '@typescript/vfs'
import fs from 'fs'
import { TextDecoder } from 'util';
import * as yargs from 'yargs'
import WebSocket from 'ws'
import repl from 'repl'
import { createDbms } from '../../dglib/src/db/webnot'

const version = "0.0.1"

// set up as websockets, easier to debug than a sharedworker, let's see.
async function server() {
  const svr = createDbms()
  console.log(`dg server ${version},${process.version}`)
  const wss = new WebSocket.Server({ port: 8080 });
 
  wss.on('connection',  (ws) => {
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
  
    ws.send('something');
  });
}

async function client() {
  console.log(`dg client ${version},${process.version}`)
  repl.start("dg>")
}

async function compile() {
  console.log(`dg compiler ${version},${process.version}`)
}
async function watch() {
  console.log(`dg watch ${version},${process.version}`)
}

async function main() {
yargs
  .scriptName('dg')
  .usage("$0 command")
  .version(version)
  .command({
    command: 'compile schema.ts ...',
    aliases: ['c'],
    describe: 'compile database schemas',
    handler: async parsed => {
      await compile()
    },
  })
  .command({
      command: 'server',
      aliases: ['s'],
      describe: 'datagrove server',
      handler: async  parsed => {
        await server()
      },
    })
    .command({
      command: 'client',
      aliases: ['s'],
      describe: 'datagrove client',
      handler: async parsed => {
        await client()
      },
    })
  .command({
      command: 'watch',
      aliases: ['w'],
      describe: 'watch mode',
      handler: async parsed => {
        watch()
      },
    })
  .demandCommand()
  .parse(process.argv.slice(2))
}
/*
async function main() {
  let args = yargs
    .command([
      c1,
      c2,
    ])

    .option('input', {
        alias: 'i',
        demand: true
    })
    .option('year', {
        alias: 'y',
        description: "Year number",
        demand: true
    }).argv;
  console.log(JSON.stringify(args));
}
*/
main()
// the cli version of the server will use websockets and 

function ex() {
  const fsMap = tsvfs.createDefaultMapFromNodeModules({ target: ts.ScriptTarget.ES2015 })
  fsMap.set('index.ts', 'console.log("Hello World")')
}

function main2() {

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

