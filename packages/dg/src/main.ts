import * as yargs from 'yargs'
import dotenv from 'dotenv'
import { createDbms } from '../../dglib/src/dbserver/nodejs'
/*
import { createDbms } from '../../dglib/src/db/webnot'
import { commit, clientrepl } from "./client";
import { version } from "./data";

import { createKey, createDeviceKey, identityFromBip39, storeCbor, loadCbor } from '../../dglib/src/crypto'
import { compile } from "./compile";
*/

// set up as websockets, easier to debug than a sharedworker, let's see.
// a client will send transactions to the shared worker using structured cloning, so we can use cbor here as a proxy? (supports binary)

async function main() {
  dotenv.config()

  yargs
    .scriptName('dg')
    .usage("$0 command")
    .version('0.1')
    .command({
      command: 'hello',
      describe: 'nothing',
      handler: async parsed => {
        console.log("hello")
      },
    })
    .command({
      command: 'server',
      aliases: ['s'],
      describe: 'datagrove server',
      builder: (yargs) => {
        return yargs.option("port", { default: 8080 })
      },
      handler: async parsed => {
        console.log("hello from server")
        createDbms()
      },
    })
    .help()
    .demandCommand()
    .argv
}
main()
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

// the cli version of the server will use websockets and 


/*
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
      command: 'repl',
      aliases: ['s'],
      describe: 'datagrove repl',
      handler: async parsed => {
        await clientrepl()
      },
    })
    .command({
      command: 'commit',
      aliases: ['s'],
      describe: 'datagrove commit # eval the standard input and commit each transaction',
      builder: (yargs) => {
        return yargs
          .positional('commit', {
            default: "", type: 'string', demandOption: true
          })
      },
      handler: async parsed => {
        await commit()
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
    .command({
      command: 'identity',
      describe: 'create a new identity and a device key',
      handler: async parsed => {
        createIdentity()
      },
    })
    .command({
      command: 'device',
      describe: 'create a device key',
      builder: (yargs) => {
        return yargs
          .option('phrase', { type: 'string', demandOption: true })
      },
      handler: async parsed => {
        createDevice(parsed.phrase)
      },
    }) */