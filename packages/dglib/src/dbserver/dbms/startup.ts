import { Lsn } from "../data";
import { Fs, WorkerLike } from "../weblike";
import { Checkpoint, LogRecord, Txn, TxStatusType, Txx } from "../data";
import { DbmsSvr, Platform } from "./dbms";

export type StartState = {
    mem: ArrayBuffer
    df: number[]
    lf: number
    active: number
}

const checkpointFile = 42 // aka "master record"
const logFile = 43
const dataFile = 44

// do I need meta data for the idb files so I can get a directory without 

type ActiveTx = Map<Txn, { status: TxStatusType, newestLsn: Lsn }>

// logs can be a range of file ids?
// can we cap them? do we want to?

export class LogReader {
    constructor(fs: Fs, public fh: number) { }

    forEach(from: Lsn, fn: (x: LogRecord) => boolean) {

    }

    // we are tracing a set of rollback transactions by prevLsn.
    // each time we want the maximum lsn in set of failed transactions, 
    // replace that in the set with the 
    failed(failed: ActiveTx, fn: (x: LogRecord) => boolean) {

    }
}

// fix the data files using the log, trim the log and return clean starting point
// if no files exist, then return an empty database.
// when we are done there will be no active transactions and no dirty pages.
// both logs will be truncated

export interface Options {
    pages: number // 1gb
}

// pull this out so we can test from a crash state. (fake-idb always starts empty)

async function recover(fs: Fs, checkpoint: number) {

    // start with newest (completed) checkpoint, then read to the end of the log
    // otherwise it is in the newest log file
    const lr = new LogReader(fs, logFile)
    // analyze: start from the beginning of the most recent checkpoint that was completed
    // (a later checkpoint that was started, but not completed, is ignored)

    const activeTx = new Map()
    const dirtyPage = new Map<number, number>()
    // this is the earliest recLsn in the DPT 
    let oldestActive = Infinity

    const analyze = (r: LogRecord) => {
        if (r.type == Txx.checkpointEnd) {
            const cp = r.value as Checkpoint
            for (let i in cp.activeTx) {
                activeTx.set(cp.activeTx[i], {
                    status: TxStatusType.undo,
                    newestLsn: cp.newestLsn[i]
                })
            }
            for (let o in cp.dirty) {
                dirtyPage.set(cp.dirty[o], cp.recLsn[o])
                oldestActive = Math.min(oldestActive, cp.recLsn[0])
            }
        } else if (r.type == Txx.txnEnd) {
            activeTx.delete(r.txn)
        } else if (r.txn) {
            let tx = activeTx.get(r.txn)
            if (!tx) {
                activeTx.set(r.txn, {
                    status: TxStatusType.undo,
                    newestLsn: r.lsn
                })
            } else {
                tx.newestLsn = r.lsn
            }
            if (r.type == Txx.commit)
                tx!.status = TxStatusType.commit
            else if (r.type == Txx.update && !dirtyPage.has(r.page)) {
                dirtyPage.set(r.page, r.lsn)
            }
        }
        return true
    }

    lr.forEach(checkpoint, analyze)
    for (let [k, v] of activeTx) {
        if (v.status == TxStatusType.commit) {
            // write a txn_end record 
            activeTx.delete(k)
        } else {
            v.status = TxStatusType.abort
            // write an abort record
        }
    }

    // REDO
    lr.forEach(oldestActive, (r) => {
        const recLsn = dirtyPage.get(r.page)
        if (recLsn)
            switch (r.type) {
                case Txx.update:
                case Txx.clr:
                    {
                        if (r.lsn >= recLsn) {
                            // read the page
                            // if the pageLsn > r.lsn, ignore update
                            // else apply change, set pagelsn  = r.lsn
                        }
                    }
                    break
            }


        return true
    })

    // UNDO
    // write a clr for every changee - why? we might crash during recovery.
    lr.failed(activeTx, (r) => {
        switch (r.type) {

            case Txx.update:
            // update active pages.
        }
        return true
    })
}


// // this allows you use dbms directly without a sharedWorker
// export async function testDb<T>(opt?: Options) {
//     // note this your application's shared worker, but it should expose Datagrove methods for Db to work. 
//     return  new Dbms()
// } 
export async function startup(d: DbmsSvr) {
    try {
        const fd = await d.os.fs.readFile(checkpointFile)
        if (fd) {
            const checkpoint = JSON.parse(fd)
            recover(d.os.fs, checkpoint)
        } else {
            // create an initial empty checkpoint, empty log, empty data
            d.os.fs.atomicWrite(checkpointFile, JSON.stringify({
                checkpoint: 0
            }))
        }
    } catch {
        // we should create an empty state here.
    }
    // here we should start trying to sync with thehost
    d.start()
    return d
}