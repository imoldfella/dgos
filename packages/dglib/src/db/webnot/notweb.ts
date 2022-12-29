import { createDbms2 } from '../server'
import { Fs } from "../weblike/data"
import fs from 'fs/promises'
import { Worker } from 'worker_threads'

// I'd like to generate my own webassembly for the workers 
// attaching this code to the pre-existing shared webassembly might take some care?
export async function createDbms(opt?: any) {
    const pages = opt?.pages ?? 16 * 1024
    const nthread = opt?.nthread ?? 4

    const mem = new WebAssembly.Memory({
        initial: pages, // 64K *64K = 4GB
        maximum: pages,
        shared: true
    })

    // workers are slightly different in node, start them here and give them to dbms.
    // we might need slight different workers as well
    const w: Worker[] = []
    for (let i = 0; i < nthread; i++) {
        w.push(new Worker('./worker.mjs'))
    }

    const wasmBytes = await fs.readFile("somepath.wasm")
    const wasmfunc = await WebAssembly.instantiate(wasmBytes, {
        // import the memory
        js: { mem }
    })
    // wasmfunc.square(50)
    return createDbms2(mem, w, wasmfunc, new Nodefs(), opt)
}

export class Nodefs extends Fs {
    flush(h: number): Promise<void> {
        throw new Error('Method not implemented.')
    }
    fh = new Map<number, fs.FileHandle>()
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
