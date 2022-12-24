import { MemDb } from "../db/worker/data"
import { RpcClient, worker } from "../thread/worker_rpc"
import { Fs, Op } from "./data"


// this is just a proxy that sends requests to the worker using a SPSC or postmessage

export class Opfs extends Fs {
    remove(fh: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    create(fh: number): Promise<number> {
        throw new Error("Method not implemented.")
    }
    open(fh: number): Promise<number> {
        throw new Error("Method not implemented.")
    }
    truncate(fh: number, len: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    flush(fh: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    close(fh: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    getSize(fh: number): Promise<number> {
        throw new Error("Method not implemented.")
    }
    read(fh: number, index: number[], page: Uint32Array[]): Promise<void> {
        throw new Error("Method not implemented.")
    }
    write(fh: number, index: number[], page: Uint32Array[]): Promise<void> {
        throw new Error("Method not implemented.")
    }
    constructor(public rpc: RpcClient){
        super()
    }
    

}


export async function useOpfs(m: MemDb) {
    const w =  worker(new URL('./walworker', import.meta.url))
   return w.ask('init', m)
}
