// let the client define general triggers?
export interface RangeDelta<T> {
    added: T[]
    deleted: T[]
    // indicates which attributes were changed
    updated: number[][]
}

// a type of combined triggered procedure
// select, project, filter
export interface ObserveRange {
    begin: Uint8Array
    end: Uint8Array
    startPosition: number,
    endPosition: number,
    startVersion: number
    id: number
    change: (delta: RangeDelta<any>) => void
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

export type LogPos = number

type Listener = (d: Uint32Array[]) => void
export interface Log {
    write(data: Uint32Array): Promise<void>
    addListener(fn: Listener): Promise<void>
    getPos(): Promise<void>
}


export type Checkpoint = {
    activeTx: Txn[]
    newestLsn: Lsn[]
    dirty: PageId[]
    recLsn: Lsn[] // for each tx, we want the earliest record we need to scan.
}


export z.