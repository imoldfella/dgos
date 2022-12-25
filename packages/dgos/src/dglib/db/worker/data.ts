

enum Slot {
    nextTsn = 0,
    notifyBufferFull
}



// 
export class MemDb {
    mem = new Mem()
    u64
    constructor() {
        this.u64 = new BigInt64Array(this.mem.mem.buffer)
    }

    get buffer() { return b }

    // we need faddx counters using atomics
    nextTxn(): number {
        const old = Atomics.add(this.u64, Slot.nextTsn, BigInt(1))
        return Number(old)
    }
    notifyBufferFull() {
        Atomics.notify(this.u64, Slot.notifyBufferFull);
    }
    waitBufferFull() {

    }

    addLogRecord(lr: Uint32Array) {
        // 
    }
}

interface StorageState {

}

export interface PageInfo {
    pageLsn: number // newest update to page
    recLsn: number // oldest update to page since last flush
}

// there is a data file for each page size. If we could we would trim pages out each logical page, but opfs can't. idb can
export type FileSet = FileSystemSyncAccessHandle[]
export async function fileSet(d: FileSystemDirectoryHandle, root: string, n: number): Promise<FileSet> {
    const r: FileSet = []
    for (let i = 0; i < n; i++) {
        const f = await d.getFileHandle(root + i)
        r.push(getAccess(f))
    }
    return r
}



export type Checkpoint = {
    activeTx: Txn[]
    newestLsn: Lsn[]
    dirty: PageId[]
    recLsn: Lsn[] // for each tx, we want the earliest record we need to scan.
}
