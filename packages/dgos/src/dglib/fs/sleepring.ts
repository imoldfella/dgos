

// a set of SPSC's using atomics that acts as a MPSC with no shared-write cache lines  

import { Mem } from "../thread/mem"

// a limitation of Atomics.wait approach is that while we are sync-sleeping we can't respond to postmessage. a simpler approach that would still allow postmessage is to use async sleep against all the worker tail pointers, not in safari or firefox though

// this is a problem for sharedworker, which must process postmessage, must be able to sleep. There are some possible tradeoffs here:
// 1. we could limit our sync.sleep when any outstanding requests. This creates a lower bound on response time though, as postMessage is turned off.
// 2. we could have the service to always reply through postmessage.
// 3. we could have the service issue bells through postmessage. (best)

// workers are three deep: sharedworker -> compute worker*n -> group commit worker
// so we can take advantage of both kinds of bells.



// spsc, but with potentially shared bell.
// the bell wakes up a worker (shared, but not SharedWorker)
// the worker then checks all its queues.
// this is a little goofy, but limits the shared write to a single atomic operation on the bell. There's no good way around that, but we can adaptively use polling. We can atomically write a flag that says we are about to sleep, then client workers view the flag and skip the bell
// server to sleep:
//  read bell
// -- client write here is caught after flag changes to sleep.
//  set flag "intent to sleep"
//  read all tail pointers
//  set flag "sleeping"; sleep against bell
//  on wakeup set "awake"

// client:
// write entry (updates tail)
// read sleepflag
//  -- if client reads awake the server will make at least one more check, and the entry has already been written.
// if not awake ring bell
// 


// for best performance these should be on separate cache lines
// the tail and data could share a cache line.
// the bell could


const ptrSlot = 0
const firstDataSlot = 1 // write memory only


export interface PortRing  {
    // the read array begins with a read pointer and a bell slot for each client.
    read: Uint32Array   // ptr, data
    write: Uint32Array   // ptr, data
    capacity: number
    entrySize: number
    port: MessagePort
}


// entry size is in 4 byte words.
// we create in 
export function createSleepRing(m: Mem, port: MessagePort, opt?: {
    capacity?: number,
    entrySize?: number

}): PortRing {
    const o = opt ?? {}
    const capacity = o.capacity ?? 16
    const entrySize = o.capacity ?? 16

    const r = {
        read: new Uint32Array(m.allocTls(1)),
        write: new Uint32Array(m.allocTls(capacity + 1)),
        capacity,
        entrySize,
        port
    }
    return r
}
export function ringEntry(r: SleepRing) {
    return new Uint32Array(r.entrySize)
}

// for this to work we need subtract underflow to work, will it?
// e must be some fixed size.
export function ringWrite(r: SleepRing, e: Uint32Array) {
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

export function ringRead(r: SleepRing, e: Uint32Array) {
    const read = r.read[ptrSlot]
    const write = r.write[ptrSlot]
    if (read != write) {
        e.set(r.write.slice(firstDataSlot + read, firstDataSlot + read + r.entrySize))
        r.read[ptrSlot]++
    } else {
        Atomics.wait(new Int32Array(r.write.buffer), ptrSlot, write)
    }
}
