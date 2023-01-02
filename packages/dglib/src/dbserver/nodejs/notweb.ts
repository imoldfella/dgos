import { startup } from '../dbms'
import { DbmsSvr, Platform } from '../dbms';
import { Fs, PortLike } from "../weblike/data"
import fs from 'fs/promises'
import { Worker } from 'worker_threads'
import { Identity, loadCbor } from '../../crypto';
import { WebSocketServer, WebSocket } from 'ws';
import { decode, encode } from 'cbor-x';


export class NodePlatform implements Platform {
    fs: Fs = new Nodefs()
    w: Worker[] = []
    online: boolean = false
    ws?: WebSocket  // null is disconnected

    constructor(public identity: Identity, public url: string, public mem: WebAssembly.Memory) {
    }

    // we need some kind of active query to know what groups we should be downloading the length of.
    async setStatus(s: boolean) {
        if (this.online == s) return
        // update a table in the database to note our status has changed.
        this.online = s
        if (s) {
            // when we first connect we need to remind the server of the groups we are listening to

        } else {
            this.ws?.close()
            this.ws = undefined
        }
    }

    sendHost(x: Uint8Array) {
        this.ws?.send(x)
    }

    // we should try to send our requests in the connect instead of waiting?
    // how do we validate this isn't a replay? what if it is, does that matter?
    // we could use a connection counter as the challenge. you can connect to anything greater than the previous connection.
    async tryConnect(rcv: (data: Uint8Array) => void) {
        this.ws?.close()
        // browser and ShardWorker is not compatible, we need some wrapper
        // we need to 
        this.ws = new WebSocket(this.url)
        this.ws.onopen = () => {
            this.setStatus(true)
        }
        this.ws.on('message', (e) => {
            rcv(combine(e))
        })
        this.ws.onerror = () => {
            this.setStatus(false)
            this.ws = undefined
        }
        this.ws.onclose = () => {
            this.setStatus(false)
            this.ws = undefined
        }
    }



}

// I'd like to generate my own webassembly for the workers 
// attaching this code to the pre-existing shared webassembly might take some care?
// this works from node and gets its configuration from environment, maybe eventually a config file?
export async function createDbms() {
    const pages = 16 * 1024
    const nthread = 0

    const mem = new WebAssembly.Memory({
        initial: pages, // 64K *64K = 4GB
        maximum: pages,
        shared: true
    })

    // workers are slightly different in node, start them here and give them to dbms.
    // we might need slight different workers as well

    let wasmfunc = {}
    let w: Worker[] = []
    if (false) {
        for (let i = 0; i < nthread; i++) {
            w.push(new Worker('./worker.mjs'))
        }

        const wasmBytes = await fs.readFile("somepath.wasm")
        wasmfunc = await WebAssembly.instantiate(wasmBytes, {
            // import the memory
            js: { mem }
        })
    }
    // wasmfunc.square(50)
    // for debug maybe we want datagrove.config.ts instead of .env?
    const identity = process.env.IDENTITY
    if (!identity) {
        console.log("Identity required")
        process.exit()
    }
    const id = await loadCbor(identity)
    // should do some zod check here.
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8080
    const host = process.env.HOST ?? "example.com"

    const os = new NodePlatform(id, host, mem)
    const dbms = await startup(new DbmsSvr(os))

    // we should set up a heart beat for the host
    os.tryConnect(e => {
        dbms.rcvHost(e)
    })

    console.log(`dg server ${process.version},${port}`)
    const wss = new WebSocketServer({ port: port });

    wss.on('connection', (ws) => {
        const pl = new WsPortLike(ws)
        dbms.connect(pl)
        pl.ws.on('message', async (message) => {
            const o = decode(combine(message))
            console.log('rcv', o)
            const r = await dbms.commit(pl, o)
            console.log('snd', r)
            pl.ws.send(encode(r))
        });
        // the server will send unprompted updates to queries. 
        ws.on('close', () => dbms.disconnect(pl))
        // quirky nodejs approach, why not onmessage?
    });
}
// each websocket port is like a tab on our shared worker
class WsPortLike implements PortLike {
    constructor(public ws: WebSocket) { }
    postMessage(message: any): void {
        this.ws.send(message)
    }
}


export function concatenate(arrays: Buffer[]): Buffer {
    let totalLength = 0;
    for (const arr of arrays) {
        totalLength += arr.length;
    }
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return Buffer.from(result)
}


// RawData is https://github.com/websockets/ws.git
type RawData = Buffer | ArrayBuffer | Buffer[];
export function combine(a: RawData): Buffer {
    if (a instanceof Array) {
        return concatenate(a)
    } else if (a instanceof Buffer) {
        return a
    }
    else {
        return Buffer.from(a)
    }
}
export class Nodefs extends Fs {
    fh = new Map<number, fs.FileHandle>()
    flush(h: number): Promise<void> {
        throw new Error('Method not implemented.')
    }
    async handle(n: number) {
        let h = this.fh.get(n)
        if (!h) {
            h = await fs.open(`${n}`, "w+")
            this.fh.set(n, h)
        }
        return h
    }

    async atomicWrite(h: number, d: string): Promise<void> {
        fs.writeFile(`${h}`, d)
    }
    async readFile(h: number): Promise<string> {
        try {
            return fs.readFile(`${h}`, {
                encoding: 'utf8'
            })
        } catch (e) {
            return ""
        }
    }
    async write(h: number, d: Uint8Array, at: number): Promise<void> {
        const fh = await this.handle(h)
        fh.write(d, 0, d.length * 4, at)
    }
    async read(h: number, d: Uint8Array, at: number): Promise<void> {
        const fh = await this.handle(h)
        fh.read(d, 0, d.length * 4, at)
    }
    async getSize(h: number): Promise<number> {
        const w = await fs.stat(`${h}`)
        return w.size
    }

    async trim(h: number, at: number): Promise<void> {

    }


}
