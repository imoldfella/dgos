import { startup } from '../server'
import { DbmsSvr, Platform } from '../server/dbms';
import { Fs } from "../weblike/data"
import fs from 'fs/promises'
import { Worker } from 'worker_threads'


export class NodePlatform implements Platform {
    fs: Fs = new Nodefs()
    w: Worker[] = []
    online: boolean = false
    ws?: WebSocket  // null is disconnected

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
    async tryConnect(rcv: (data: Uint8Array) => void) {
        this.ws?.close()
        // browser and ShardWorker is not compatible, we need some wrapper
        this.ws = new WebSocket(this.url)
        this.ws.onopen = () => {
            this.setStatus(true)
        }
        this.ws.onmessage = (e: MessageEvent) => {
            rcv(e.data)
        }
        this.ws.onerror = () => {
            this.setStatus(false)
            this.ws = undefined
        }
        this.ws.onclose = () => {
            this.setStatus(false)
            this.ws = undefined
        }
    }
    constructor(public url: string, public mem: WebAssembly.Memory) {

    }
}
// I'd like to generate my own webassembly for the workers 
// attaching this code to the pre-existing shared webassembly might take some care?
export async function createDbms(host: string, opt?: any) {

    const pages = opt?.pages ?? 16 * 1024
    const nthread = opt?.nthread ?? 4

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
    const os = new NodePlatform(host, mem)
    return startup(new DbmsSvr(os))
}

export class Nodefs extends Fs {
    fh = new Map<number, fs.FileHandle>()
    flush(h: number): Promise<void> {
        throw new Error('Method not implemented.')
    }
    async handle(n: number) {
        let h = this.fh.get(n)
        if (!h) {
            h = await fs.open(`${n}`, "rw")
            this.fh.set(n, h)
        }
        return h
    }

    async atomicWrite(h: number, d: string): Promise<void> {
        fs.writeFile(`${h}`, d)
    }
    async readFile(h: number): Promise<string> {
        return fs.readFile(`${h}`, {
            encoding: 'utf8'
        })
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
