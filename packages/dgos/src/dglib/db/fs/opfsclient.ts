import { MemDb } from "../worker/data"
import { RpcClient, worker } from "../../thread/worker_rpc"
import { Fs, Op } from "./data"


export class Opfs extends Fs {
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
