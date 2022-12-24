import { MemDb } from "../db/worker/data"
import { RpcClient, worker } from "../thread/worker_rpc"
import { Fs, Op } from "./data"


// this is just a proxy that sends requests to the worker using a SPSC or postmessage



export class Opfs implements Fs {
    submit(x: Float64Array, y: Float64Array): Promise<void> {
        throw new Error("Method not implemented.")
    }
    submitv(start: number, end: number, result: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    tag = 42
    m = new Map<number, [resolve: (a: any) => void, reject: (e: any) => void]>()

    constructor(public w: Worker) {
        w.onmessage = ((e) => {
            const [userdata, result] = e.data
            const o = this.m.get(userdata)!
            this.m.delete(userdata)
            o[0](result)
        })
    }
}


export async function useOpfs(m: MemDb) {
    const w = new Worker(new URL('./opfsworker', import.meta.url))
    w.postMessage(m.mem.mem.mem.buffer)

    return new Opfs(w)
}
