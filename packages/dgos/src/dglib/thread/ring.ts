import { Mem } from "./mem"

// for best performance these should be on separate cache lines
// the tail and data could share a cache line.
// the bell could

const ptrSlot = 0
const firstDataSlot = 1 // write memory only

export interface RingBuffer {
    read: Uint32Array   // next, scratch, bell, data
    write: Uint32Array   // next, scratch, bell
    capacity: number
    entrySize: number
}

// entry size is in 4 byte words.
export function createRingBuffer(m: Mem, opt?: {
    capacity?: number,
    entrySize?: number
}): RingBuffer {
    const o = opt ?? {}
    const capacity = o.capacity ?? 16
    const entrySize = o.capacity ?? 16

    const r = {
        read: new Uint32Array(m.allocTls(1)),
        write: new Uint32Array(m.allocTls(capacity + 1)),
        capacity,
        entrySize
    }
    return r
}
export function ringEntry(r: RingBuffer) {
    return new Uint32Array(r.entrySize)
}

// for this to work we need subtract underflow to work, will it?
// e must be some fixed size.
export function ringWrite(r: RingBuffer, e: Uint32Array) {
    while (true) {
        // https://hacks.mozilla.org/2017/06/avoiding-race-conditions-in-sharedarraybuffers-with-atomics/
        const read = r.read[ptrSlot]
        const write = r.write[ptrSlot]
        const next = write + 1 == r.capacity ? 0 : write + 1
        if (next != read) {
            // copy e to the next slot.
            const b = firstDataSlot + write * r.entrySize
            r.write.set(e, b)
            r.write[ptrSlot] = next
            return
        } else {
            Atomics.wait(new Int32Array(r.read.buffer), ptrSlot, read)
        }
    }

}

export function ringRead(r: RingBuffer, e: Uint32Array) {
    const read = r.read[ptrSlot]
    const write = r.write[ptrSlot]
    if (read != write) {
        e.set(r.write.slice(firstDataSlot + read, firstDataSlot + read + r.entrySize))
        r.read[ptrSlot]++
    } else {
        Atomics.wait(new Int32Array(r.write.buffer), ptrSlot, write)
    }
}

export async function ringReadAsync(r: RingBuffer, e: Uint32Array): Promise<void> {
    const read = r.read[ptrSlot]
    const write = r.write[ptrSlot]
    if (read != write) {
        e.set(r.write.slice(firstDataSlot + read, firstDataSlot + read + r.entrySize))
        r.read[ptrSlot]++
    } else {
        await Atomics.waitAsync(new Int32Array(r.write.buffer), ptrSlot, write)
    }
}

// can I make thise work for multiple SPSC queues? Not sharing a cacheline should be faster than atomic add.
