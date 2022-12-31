
import WebSocket from 'ws'
import repl from 'repl'
import { decode, encode } from 'cbor-x';
import { version } from "./data";
import { combine } from "./nodebuffer";

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

  // secret is a device key
  constructor(secret: string) {
  }

  get identity() {
    return encode({
      publicKey: new Uint8Array(0)
    })
  }
}

export async function client(url: string, query: string, mutation: string) {
  const cl = new Client(process.env.identity ?? "")
  console.log(`dg client ${version},${process.version}`)
  const ws = new WebSocket(url)
  ws.send(cl.identity)
  ws.onopen = () => {
    const send = {
      method: 'commitForm',
      id: 42,
      params: {
        firstName: 'john',
        lastName: 'doe',
        email: 'doe@example.com',
        phone: '9999999999'
      }
    }
    ws.send(encode(send))
  }
  ws.on('message', (e, isBinary) => {
    console.log(decode(combine(e)))
    if (!query) {
      process.exit(0)
    }
  })
}