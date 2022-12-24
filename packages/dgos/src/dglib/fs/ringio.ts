import { Mem } from "../thread/mem"
import { RingBuffer, createRingBuffer, ringEntry } from "../thread/ring"
import { worker } from "../thread/worker_rpc"



export interface IoRing {
    request: RingBuffer
    completion: RingBuffer
}

class Request {
    data = new DataView(new ArrayBuffer(64))

}

export function unpackRequest(u: Uint32Array) {

}
export function ringRequest(r: IoRing, request: Request) {

}

export function createRingPair(mem: Mem): IoRing {
    return {
        request: createRingBuffer(mem),
        completion: createRingBuffer(mem, { entrySize: 4 })
    }
}

// we can have more than one cooperative Io worker
// the should all map into the same memory though
// maybe each has their own tls allocator?




export class OpfsIo extends Io {
    remove(path: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    create(path: string): Promise<number> {
        throw new Error("Method not implemented.")
    }
    open(path: string): Promise<number> {
        throw new Error("Method not implemented.")
    }
    truncate(fh: number, len: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    flush(): Promise<void> {
        throw new Error("Method not implemented.")
    }
    close(): Promise<void> {
        throw new Error("Method not implemented.")
    }
    getSize(): Promise<number> {
        throw new Error("Method not implemented.")
    }
    read(fh: number, index: number[], page: Uint32Array[]): Promise<void> {
        throw new Error("Method not implemented.")
    }
    write(fh: number, index: number[], page: Uint32Array[]): Promise<void> {
        throw new Error("Method not implemented.")
    }
    log(index: number, page: Uint32Array): Promise<void> {
        throw new Error("Method not implemented.")
    }
    constructor(public mem: Mem) {
        super()
    }
    async init() {
    }
}

export class IdbIo extends Io {
    remove(path: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    create(path: string): Promise<number> {
        throw new Error("Method not implemented.")
    }
    open(path: string): Promise<number> {
        throw new Error("Method not implemented.")
    }
    truncate(fh: number, len: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    flush(): Promise<void> {
        throw new Error("Method not implemented.")
    }
    close(): Promise<void> {
        throw new Error("Method not implemented.")
    }
    getSize(): Promise<number> {
        throw new Error("Method not implemented.")
    }
    read(fh: number, index: number[], page: Uint32Array[]): Promise<void> {
        throw new Error("Method not implemented.")
    }
    write(fh: number, index: number[], page: Uint32Array[]): Promise<void> {
        throw new Error("Method not implemented.")
    }
    log(index: number, page: Uint32Array): Promise<void> {
        throw new Error("Method not implemented.")
    }
    async init() {
        const w = worker(new URL('./walworker', import.meta.url))
    }
}

// call from the compute worker to make a dedicated io worker
// we only need a worker for opfs though, idb is all async, and doesn't need a ring buffer
export async function useIo(m: Mem, type: "opfs" | "idb") {
    let r: Io = type == "idb" ? new IdbIo() : new OpfsIo(m)
    await r.init()
    return r
}