import { Log } from "../client/service"
import { Checkpoint, FileSet, LogRecord, Lsn, PageId,  StartState, Txn, TxStatus, Txx } from "./data"
import { LogState } from "./log_writer"



export class LogWriter {
    data: RingBuffer
    txStatus = new Map<number, TxStatus>()
    dirtyPageTable = new Map<PageId, Lsn>()
    flushedLsn: number
    stop = false
    active = 0
    logpos = 0

    constructor(public start: StartState) {
        this.flushedLsn = 0
        this.flushLoop()
        this.data = new RingBuffer(start.mem.mem)
    }

    get mem() { return this.start.mem }

    // we need to switch files, store where in the log
    async checkpoint() {
        this.active = this.active ? 0 : 1
        this.logpos = 0

        const wasActive = [...this.txStatus.keys()]
        this.addRecord(Txx.checkpointBegin)

        // write wasActive in the log record
        const cp: Checkpoint = {
            activeTx: [],
            dirty: [],
            newestLsn: [],
            recLsn: []
        }
        this.addRecord(Txx.checkpointEnd, {
            value: cp
        })
        // write a new 
    }

    addRecord(type: Txx, lr?: Partial<LogRecord>): Lsn {
        //const lsn = nextLsn++

        return 0
    }
    async flushLoop() {
        while (!this.stop) {
            //const b = this.mem.pull()
            // wait for either a full page or a commit, then write the page
            // either way, we will write complete 4K pages, and advance the LSN by 4k increments.

            this.flushedLsn = 0
        }
    }


    // we don't begin a checkpoint until we know that we have completed the previous one, so this is a good time to rotate the logs. Our good checkpoint stays in its log, and since that log has a begin and end checkpoint in it, that is enough to recover from so we can trim the unused log and start again. 

    // how do we atomically switch?

    // when you complete the checkpoint, you write the "master" record.
    // this can 

    // before flushing page x, we must have x.pageLsn < flushLsn








}