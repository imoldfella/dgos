import { MemDb } from "../db/worker/data"
import { RpcClient, worker } from "../thread/worker_rpc"
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

export async function useOpfs(m: MemDb) {
    const w = new Worker(new URL('./opfsworker', import.meta.url))
    w.postMessage(m.mem.mem.mem.buffer)

    return new Opfs(w)
}
