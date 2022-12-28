
// there will be a cache line per process pair at the start of the memory
// each process will have an io ring. Each process will have a command queue that it shares with primary process
// the primary process is generally a shared worker but can be the main thread for slightly easier testing
// we need to be able to evict pages to defrag them, no vm tricks in a browser.
// 

// 4*4Mb per 64 size classes? 1GB buffer pool shared, 1GB split for local stores?
// we need frames? we should overweight the 64K class since inodes can't be swapped

const endWasm = 0  // reserve for c?
const workerPage = 16 * 1024 // words for each worker
export class Mem {
    constructor(public mem: MemData) {
        this.tls = new Uint32Array(mem.mem.buffer, endWasm + workerPage * mem.pid, workerPage)
    }
    tls: Uint32Array
    next = 0

    // align by 64 bits? seems like that will help us eventually
    allocTls(uint64: number): ArrayBuffer {
        const r = new Int32Array(this.tls.buffer, this.next, uint64 * 2)
        this.next += uint64 * 2
        return r
    }

    // this api needs to change
    allocPages(pages: number): ArrayBuffer {
        const len = pages * 16 * 1024
        const r = new Int32Array(this.tls.buffer, this.next, len)
        this.next += len
        return r
    }


    // vmcache uses this to keep its overall footprint down
    // our memory is linear, no options here.
    evict(offset: number, size: number) {

    }
}

// each thread pair (io, compute) will receive their own dedicate chunk of ram, plus there is a global list of blocks. If the local free list grows too large, it is given back to global, if free fails locally a bigger chunk is requested from global

// distribute these to workers for cooperative io.

interface MemData {
    mem: WebAssembly.Memory,
    pid: number
}

// rough plan is nworkers represent a pair of workers; one io and and one compute.
// this would normall be called from a shared worker
export function createMem(nworkers: number): MemData[] {
    const pages = 16 * 1024 // 1gb
    const mem = new WebAssembly.Memory({
        initial: pages, // 64K *64K = 4GB
        maximum: pages,
        shared: true
    })
    const local = Math.floor(pages / 2 * nworkers)
    const global = pages - local * nworkers
    const r: MemData[] = []
    for (let i = 0; i < nworkers; i++) {
        r.push({
            mem: mem,
            pid: i
        })
    }
    return r
}