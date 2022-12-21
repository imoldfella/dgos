
export class Mem {
    mem = new WebAssembly.Memory({
        initial: 1024,
        maximum: 64 * 1024,
        shared: true
    })
    next = 0

    
    allocPages(pages: number): ArrayBuffer {
        const len = pages * 16 * 1024
        const r = new Int32Array(this.mem.buffer, this.next, len)
        this.next += len
        return r
    }
    allocLines(lines: number): ArrayBuffer {
        const len = lines * 16
        const r = new Int32Array(this.mem.buffer, this.next, len)
        this.next += len
        return r
    }
}