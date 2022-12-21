
// we need to use one big chunk of memory so that we can use from webassemby
// we split off a chunk for the log

import { FileSystemSyncAccessHandle, getAccess, readJson, useOpfs } from "../../opfs/opfs"

import { Checkpoint, fileSet, FileSet, LogRecord, Lsn, MemDb, RootRecord, StartState, Txn, TxStatus, TxStatusType, Txx } from "./data"
import { LogState } from "./log_writer"

class ActiveTx extends Map<Txn, { status: TxStatusType, newestLsn: Lsn }>{ }

export class LogReader {
    constructor(public fh: FileSet) {

    }
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
export async function open(): Promise<StartState> {
    const mem = new MemDb()
    const fs = await useOpfs()
    const df = await fileSet(fs, 'data', 64)
    const lf = await fileSet(fs, 'log', 2)

    if (await lf[0].getSize() == 0 && await lf[1].getSize() == 0) {
        return {
            mem,
            df,
            lf,
            active: 0
        }
    }


    const root: (Lsn)[] = [
        await readJson<number>(fs, 'root0') ?? 0,
        await readJson<number>(fs, 'root1') ?? 0]
    const newestCheckpoint = root[0] > root[1] ? 0 : 1

    // run recovery. we might have to read both logs
    // start with newest checkpoint, then read to the end of the log
    // if a new checkpoint has started, but not completed, then the newest checkpoint is in the oldest log file
    // otherwise it is in the newest log file
    const lr = new LogReader(lf)
    // analyze: start from the beginning of the most recent checkpoint that was completed
    // (a later checkpoint that was started, but not completed, is ignored)

    const activeTx = new ActiveTx()
    const dirtyPage = new Map<number, number>()

    // we should store not just the tx, but the 

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

    lr.forEach(newestCheckpoint, analyze)
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


    return {
        mem,
        df,
        lf,
        active: 0
    }
}