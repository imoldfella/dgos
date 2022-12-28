import { FileSet, MemDb } from "./data";


export class BufferPool {
    constructor(public mem: MemDb, public df: FileSet) {
    }

    // getPage is async because idb is async, performance leak
    // we should not need to evict pages here, but we can.
    async getPage(page: number): Promise<Uint32Array> {
        // the memory is 
        return new Uint32Array(0)
    }
}