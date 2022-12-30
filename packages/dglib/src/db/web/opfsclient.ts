
import { Fs } from "../weblike"
import { Req } from "./opfs"


export function newReq(f: Float64Array): Req[] {
    const r = new Array<Req>(f.length >> 3)

    r.forEach((e, i) => {
        r[i] = new Req(f.slice(i * 8, i * 8 + 8))
    })
    return r
}


export class Opfs extends Fs {
    write(h: number, d: Uint8Array, at: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    read(h: number, d: Uint8Array, at: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    flush(h: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    async atomicWrite(h: number, d: any): Promise<void> {
        throw new Error("Method not implemented.")
    }
    atomicRead(h: number): Promise<any> {
        throw new Error("Method not implemented.")
    }
    getSize(h: number): Promise<number> {
        throw new Error("Method not implemented.")
    }
    getFiles(): Promise<number[]> {
        throw new Error("Method not implemented.")
    }
    trim(h: number, at: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    submit(x: Float64Array) {
        this.w.postMessage(x)
    }
    constructor(public w: Worker) {
        super()
        // w.onmessage = ((e) => {
        //     super.notify(e.data)
        // })
    }
}

export async function useOpfs(m: ArrayBuffer): Promise<Opfs | null> {
    const w = new Worker(new URL('./opfsworker', import.meta.url))
    w.postMessage(m)
    return new Promise((resolve) => {
        w.onmessage = ((e) => {
            resolve(e.data ? new Opfs(w) : null)
        })
    })

}
/*export function pack(o: OpfsRq[], to: Float64Array) {
    for (let i = 0; i < o.length; i++) {
        to.slice(i * 8, i * 8 + 8).set([
            o[i].userdata,
            o[i].op,
            o[i].fh,
            o[i].at,
            o[i].begin,
            o[i].end, 0, 0, 0
        ])
    }
}


type Completer = (baton: number, result: number) => Promise<void>

abstract submit(x: Float64Array): void
    oncomplete ?: Completer
// takes list of pairs: (userdata, result)
notify(x: Float64Array) {
    if (this.oncomplete) {
        for (let i = 0; i < x.length; i += 2)
            this.oncomplete(x[i * 2], x[i * 2 + 1])
    }
}*/
