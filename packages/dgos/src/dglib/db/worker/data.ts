

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

export enum Txx {
    begin = 0,
    commit = 1,
    update = 2,

    txnEnd = 4, // write after all records flushed, not flushed
    abort = 5,
    clr = 6,
    checkpointBegin = 7,
    checkpointEnd = 8
}
// status needs to be in shared ram?
export enum TxStatusType {
    undo = 0,
    run = 1,
    commit = 2,
    abort = 3
}
export interface TxStatus {
    //xid: number
    status: TxStatusType
    // if commit, must redo. if run, must undo
    lastLsn: number
}

export type LogRecord = {
    type: Txx,
    lsn: Lsn,
    txn: Txn
    prevLsn: number // backward link 
    undoNext: number // for clr, next to undo
    page: PageId
    key: string
    value: any
    before: any
}
export interface RootRecord {
    startCheckpoint: number
    //endCheckpoint: number  // aka Master record
}

export class LogPage {


}

// writers will create log pages and
export type Lsn = number // maybe lsn should be offset in log?
export type Txn = number
export type PageId = number


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

export type StartState = {
    mem: MemDb
    df: FileSet
    lf: FileSet
    active: number
}



export type Checkpoint = {
    activeTx: Txn[]
    newestLsn: Lsn[]
    dirty: PageId[]
    recLsn: Lsn[] // for each tx, we want the earliest record we need to scan.
}
