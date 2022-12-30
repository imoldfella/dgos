import * as ts from "typescript";
import tsvfs from '@typescript/vfs'
import fs from 'fs'
import { TextDecoder } from 'util';
import * as yargs from 'yargs'
import WebSocket,{WebSocketServer} from 'ws'
import repl from 'repl'
import { createDbms } from '../../dglib/src/db/webnot'
import { PortLike } from "../../dglib/src/db/weblike";
import { decode, encode } from 'cbor-x';
import { combine } from "./nodebuffer";
import { client, clientrepl } from "./client";
import { version } from "./data";



// each websocket port is like a tab on our shared worker
class WsPortLike implements PortLike {
  constructor(public ws: WebSocket){}
  postMessage(message: any): void {
    this.ws.send(message, {binary: true})
  }
}


// set up as websockets, easier to debug than a sharedworker, let's see.
// a client will send transactions to the shared worker using structured cloning, so we can use cbor here as a proxy? (supports binary)
async function server(port: number,host: string) {
  const svr = await createDbms(host)
  console.log(`dg server ${version},${process.version},${port}`)
  const wss = new WebSocketServer({ port: port });

  wss.on('connection', (ws) => {
    const pl = new WsPortLike(ws)
    svr.connect(pl)  // the server will send unprompted updates to queries. 
    ws.on('close', ()=>svr.disconnect(pl))
    // quirky nodejs approach, why not onmessage?
    ws.on('message', async (message,isBinary) =>{
      const o = decode(combine(message))
      console.log('rcv', o)
      const r = await svr.commit(pl,o)
      console.log('snd', r)
      ws.send(encode(r))
    });
  });
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
      builder: (yargs)=>{
        return yargs.option("port",{ default: 8080})
      },
      handler: async parsed => {
        await server(parsed.port, "www.datagrove.com")
      },
    })
    .command({
      command: 'repl',
      aliases: ['s'],
      describe: 'datagrove repl',
      handler: async parsed => {
        await clientrepl()
      },
    })
    .command({
      command: 'client',
      aliases: ['s'],
      describe: 'datagrove client',
      builder: (yargs) => {
        return yargs
        .option('commit', {
          default: ""
        }).option('url',{default: "ws:localhost:8080"})
        .option('query',{default: ""})
      },
      handler: async parsed => {
        await client(parsed.url as string,parsed.query as string,parsed.commit as string)
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

