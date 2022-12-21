// when log watchers watch, they must be copy out the data, and then check that it wasn't overwritten. If it was they can read from the log.
//https://github.com/mozilla-spidermonkey/js-lock-and-condition/search?q=notifyOne

import { Mem } from "../../thread/mem"

export class LogHeader {
    static quit = 0
    static condvar = 1
    static tail = 1
    static avail = 2
    sm64: BigUint64Array

    buffer  // just our data.
    mask = 0
    sm: Int32Array
    constructor(m: Mem) {
        this.sm = m.allocLines(1)
        this.sm64 = new BigUint64Array(this.sm)
        this.buffer = this.sm.slice(8)
        this.mask = this.buffer.length - 1
    }

    quit() {
        this.sm[0] = 1
    }
    notify() {
        Atomics.notify(this.sm, LogHeader.condvar);
    }
    wait() {

    }
    // how do we get the data back to zero? do it in the writer?
    // worth the expense? we don't know where the packets will align.
    // we could gather all the headers, increment by 1? not really.
    // they would still need to bump a tail, then that would race.
    // we could add some kind of lock on the tail to keep simultaneous writers from moving forward until the previous zero'd out the header. different kind of expense though.
    addTail(n: bigint) {
        return Atomics.add(this.sm64, 1, n)
    }
    // return true if acceptable to write up to log position n

    pos2offset(x: bigint) {
        return Number(x & BigInt(this.mask))
    }
    slice(begin: bigint, end: bigint): [Int32Array, Int32Array | undefined] {
        const b = this.pos2offset(begin)
        const e = this.pos2offset(end)
        if (e > b) {
            return [this.sm.slice(b, e), undefined]
        } else {
            const endBuffer = this.buffer.length
            return [this.sm.slice(b, endBuffer), this.sm.slice(8, e)]
        }
    }

}

// a conditional variable needs to 