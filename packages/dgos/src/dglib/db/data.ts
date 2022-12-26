
// it's not clear that 53 bits is enough for a version id.
// maybe rid should encapsulate the id of version though?
// ever rid would then point to immutable thing.
// Uint8Array's can't be keys, so would need to hex them.

// tradeoff of whether to map a log to a partition: more concurrency = potentially bigger lock problem
export interface Dbms {
    begin(): Promise<Tx>
    query<P, T>(stmt: Statement<P, T>, props: T): Promise<Query<T>>
}
// we need interfaces that can be shipped to another worker.

export interface Query<T = any> {
    // sometimes we want the delta, or always provide the delta?
    // it probably computed anyway?
    addListener(fn: () => void): void
    removeListener(fn: any): void
    close(): void

    forEach(fn: (e: T) => void): void
}
export interface Tx {
    commit(): Promise<boolean>
}

export interface Statement<P = any, T = any> {
    exec(tx: Tx, props?: P): Query<T>
}



export type Rid = string
export type bstr = Uint8Array
export type BranchId = string
export type Key = Uint32Array

// a Db has one root Dgc, it can find other dgc's from there.
// the root dgc can be found from the identity.
export interface DbConfig {

}

// if list length is 0, then key is deleted.
// prosemirror is kept using the count map.
export interface TableUpdate {
    table: string
    key: Uint8Array
    delta: ListDelta<any>
}
export interface BranchUpdate {
    lsn: Lsn
    update: TableUpdate[]
}
export interface Identity {
    secret: Uint8Array
}
// transactions need support for Pm, which means we need to fail/rebase
// pm transactions can be singular? It would be better to not special case.
export type Txd = {
    [branch: string]: BranchUpdate
}

export interface Scan {
    tag: number
    table: string
    low: Key
    high: Key
}
export type ScanTx = Scan[]


// branches have dns address org-branch.froov.net for example
export interface Branch {
    name: string
    schema: string
}

// is-a branch.
export class BranchConcierge {
}
export class Table {

}

export interface Sandbox {
    identity: Identity
}



export interface Tab {
    rid: string

    name: string
    avatar: string
    count: number
    level: number
}
export type Tabx = Tab & {
    selected: boolean
}

export type Lsn = number

// how should we rebase this? what do we need to keep?
// prosemirror keeps centrally what we need to put in a log.
export interface ListDelta<T> {
    op: Uint8Array,
    count: number[],
    item: T[],
    // session should be committed atomically with the log state.
    session: number
}

const keep = 0
const insert = 1
const skip = 2
// create a delta that creates a list from an empty list
export function listDeltaFromArray<T>(item: T[]): ListDelta<T> {
    return {
        op: new Uint8Array([insert]), count: [item.length], item, session: 0
    }
}


// handle race conditions and rebasing.
// this needs to handle multiple steps in a tree arrangement

export interface ArraySnapshot<T> {
    lsn: Lsn
    item: T[]
}

// a snapshot could be a key prefix + lsn
// then query the prefixed btree normally.
// a layered, deterministic snapshot might be best for distribution. map tile model
export interface Snapshot {
    lsn: Lsn,
    table: {
        [name: string]: TableSnapshot
    }
}
export interface TableSnapshot {
    schema: TableSchema
    item: Btree
}

export interface Btree {

}

export interface DeltaLog<T> {
    golden: ArraySnapshot<T>
    pending: ListDelta<T>[]
    predicted: ArraySnapshot<T>
}


export function listDeltaApply<T>(item: T[], delta: ListDelta<T>)
    : [T[] | undefined, T[]] {
    const r: T[] = []
    const removed: T[] = []
    let j = 0
    let d = 0
    for (let i = 0; i < delta.op.length; i++) {
        switch (delta.op[i]) {
            case keep:
                r.push(...item.slice(j, j + delta.count[i]))
                j = j + delta.count[i]
                break
            case insert:
                r.push(...delta.item.slice(d, d + delta.count[i]))
                d += delta.count[i]
                break
            case skip:
                removed.push(...item.slice(j, j + delta.count[i]))
                j = j + delta.count[i]
                break
        }
    }
    return [r, removed]
}

function onerror() {
    console.log("error!!")
}

// opfs is sync, but idb is not
export interface StoreFile {
    truncate(len: number): Promise<void>
    flush(): Promise<void>
    close(): Promise<void>
    write(a: ArrayBuffer, opt?: { at: number }): number
    read(a: ArrayBuffer, opt?: { at: number }): number
    getSize(): Promise<number>
}


// store 64K blobs, 
export interface Store {

    remove(path: string): Promise<void>
    create(path: string): Promise<StoreFile>
    open(path: string): Promise<StoreFile>

    // readPage(d: DiskPointer, target: Uint32Array, then: (d: DiskPointer, status: number) => void): void
    // writePage(d: DiskPointer, target: Uint32Array, then: (d: DiskPointer, status: number) => void): void
    // writeLog(target: Uint32Array, then: (d: DiskPointer, status: number) => void): void
    //readTail(): Promise<Uint32Array>


}
