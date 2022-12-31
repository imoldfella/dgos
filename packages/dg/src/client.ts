
import WebSocket from 'ws'
import repl from 'repl'
import { decode, encode } from 'cbor-x';
import { version } from "./data";
import { Identity, loadCbor } from '../../dglib/src/crypto';
import fs from 'fs'
import { combine } from '../../dglib/src/db/webnot';

export async function clientrepl() {
  console.log(`dg client ${version},${process.version}`)
  repl.start("dg>")
}

//  var newCollabState = new CollabState(version, unconfirmed);


//  when we update a cell we need to write to it like a log.
// the step will be ignored if its not current, but it can be repaired if client chooses
// update pm(id, content) set contentSteps = pmupdate(content, version, repairs steps[])

// subscribe(42, select content from pm where id=?)

// sync will coalesce the 
// sync ( hash[], content[])

// subscribe to a value different from subscribing to a query/ range?
// we want both; viewing a table may require this
// 'subscribe', 

// paseto are signed tokens, we can give people blue checks etc
// these can be stored in the server though, rather than 

// move to dblib


export class Client {
    public: Identity
    private: Identity

  // secret is a device key from .env, or localStorage, or from user creating a new one
  constructor(secret: string) {
    this.private = loadCbor(secret)
    this.public = {...this.private}
    this.public.private = undefined
  }

  get identity() {
    return encode({
      publicKey: new Uint8Array(0)
    })
  }

}

// keep safe in environment or browser (not so safe)
// dgos will keep a list of websites in your profile database, but then you still need
// to connect to that.

// to do one connect we need to store a cookie, but this is less secure and  does it matter? this is only for testing. maybe we should just trust it? 


// this only for node, browser connects to sharedWorker, but that can't access localstorage

let nextTag = 42
export  function ask(ws: WebSocket, o: any) : Promise<any>{
    return new Promise((resolve)=>{
        o.id = nextTag++
        ws.send(encode(o))
        ws.on('message', (e, isBinary) => {
            const ox = decode(combine(e))
            console.log(ox)
            // if the response indicates that its a subscription then we should get the first query anyway. ignore notifications (not our tag.

            if (ox.id==o.id){
                resolve(ox)
            }
        })  
    })
}
// eval https://2ality.com/2019/10/eval-via-import.html
export async function commit() {
    const tx = fs.readFileSync(process.stdin.fd, 'utf-8')
    const cl = new Client(process.env.IDENTITY ?? "")
    const host = process.env.HOST ?? ""
    const url = process.env.URL ?? "ws://localhost:8080"
    if (!cl) {
        console.log("IDENTITY is required in .env, or environment variable")
        process.exit()
    }
    console.log(`dg client ${version},${process.version}`)
    const ws = new WebSocket(url)
    ws.send(cl.identity)

    // note that this is strange to send the private key to the "server", but the server is SharedWorker or in this case a test server.
    ws.onopen = async () => {
        ws.send(encode({
            method: 'connect',
            id: 42,
            params: {
                public: cl.public
            }
        }))
        // eval to allow Uint8Array
        // evals to a list of commands.
        const commands = eval(tx)
        if (Array.isArray(commands)) {
            for (let o of commands) {
                await ask(ws, o)
            }
        } else {
            await ask(ws, commands)
        }
        process.exit()
    }
}