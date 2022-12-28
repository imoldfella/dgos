
import { RpcClient, worker } from "../../../thread/worker_rpc"
import { Fs, Op } from "../../weblike/data"


export class Opfs extends Fs {
    atomicWrite(h: number, d: any): void {
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
        w.onmessage = ((e) => {
            super.notify(e.data)
        })
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
