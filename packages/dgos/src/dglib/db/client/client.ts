
import { Key } from "../data"
import { Rpc, sharedWorker, worker } from "../../thread/worker_rpc"
import { Client } from "./dbw"
import { LogRecord, Txx } from "../worker/data"
import { MemDb } from "../worker/data"

// cache/proxy for using on the main thread.
// 
export class Db {
    mem = new MemDb
    //dbms = worker(new URL('./worker', import.meta.url))
    dbms = sharedWorker(new URL('./shared', import.meta.url))
    async ask(method: string, params?: any): Promise<any> {
        return this.dbms.ask(method, params)
    }
    begin(): TxMgr {
        return new TxMgr(this.mem)
    }
}

export async function createDb() {
    console.log("startdb")
    const r = new Db()
    // await r.ask('start')
    console.log("init", await r.ask('ping'))
    const sab = new SharedArrayBuffer(4)
    const sab2 = new Int32Array(sab)
    sab2[0] = 42
    const x = await r.ask('add', sab2)
    console.log("add", x)
    console.log("add2", Atomics.load(sab2, 0))
    return r
}

// TxMgr needs to take a mem and use protocols to write log records into buffers coordinating with other thread.

// a tab can die at any time, leaving unfinished transactions
// what will these do? can we roll them back at the next checkpoint? two checkpoints?
export class TxMgr {
    constructor(public mem: MemDb) {

    }

    delete(key: Key) {
    }

    update(key: Key, value: Uint8Array) {

    }


    // status: TxStatus = TxStatusType.run
    prevLsn = 0


    addRecord(type: Txx, lr: Partial<LogRecord>) {
        lr.prevLsn = this.prevLsn
        //this.prevLsn = addRecord(type, lr)
    }
    insert() {
        this.addRecord(Txx.update, {})
    }
    // maybe not async? spin lock perhaps?
    async commit() {
        this.addRecord(Txx.commit, {})
    }
    async rollback() {
        // for each record we have written, write a CLR.
        // start from prevLsn and read backward until we get to begin.
        while (true) {

        }
    }
}
