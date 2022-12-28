import { Mem } from "./mem"

const headSlot = 0
const tailSlot = 0

export interface RingBuffer {
    header: Uint32Array
    data: Uint32Array
}

export function ringBuffer(mem: Mem): RingBuffer {
    return {
        header: new Uint32Array(mem.allocLines(1)),
        data: new Uint32Array(mem.allocPages(10))
    }
}

export class RingWriter {
    constructor(public buffer: RingBuffer) { }

    write(b: Uint8Array) {
        const wl = (b.length + 3) >> 2
        const old = Number(Atomics.add(this.buffer.header, tailSlot, wl))
        let n = old + b.byteLength
        if (n >= this.buffer.data.length) {
            n -= this.buffer.data.length
        }

        // might be sp lit, if so, make it a padding record and try again.

    }
}

// transferrable?
export class RingBufferReader {

    constructor(public buffer: RingBuffer) {

    }
    writeCount = BigInt(0)

    // read all the records available in one buffer then sleep on the write 
    // if a tail record is split then
    a = new Uint32Array(0)
    head = 0

    read(): Uint32Array {
        this.a.fill(0)
        this.writeCount = Atomics.load(this.buffer.header, writeSlot)
        // scan for all the records, combine into one buffer
        let start = this.buffer.header[
        while (true) {
            let len = Atomics.load(this.buffer.data, this.head)
            if (!len) break
            this.head += ((len + 3) >> 2)
            if (this.head > this.buffer.data.length) {
                this.head
            }
        }

        // if not at least one record then wait.
        Atomics.wait(this.buffer.header, writeSlot, this.writeCount)

        return this.a
    }
}