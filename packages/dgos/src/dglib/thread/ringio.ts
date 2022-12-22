import { Mem } from "./mem"
import { RingBuffer, createRingBuffer, ringEntry, ringReadAsync } from "./ring"

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
export async function ringCompletion(r: RingBuffer, fn: (c: Float64Array) => void) {
    const e = ringEntry(r)
    while (true) {
        await ringReadAsync(r, e)
        fn(new Float64Array(e.buffer))
    }
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
export interface IoData {


}

export class Io {
    constructor(public mem: Mem, public io: IoData) { }


}
