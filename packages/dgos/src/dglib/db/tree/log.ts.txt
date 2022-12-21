import { useFs, StoreFile } from '../opfs'

// the log runs as a shared worker because we only want one, and it can block due to opfs.
// this likely caps its performance. we can at least write into a shared memory, then send a message to request commit.
// 


// we want to collect transactions into log records and flush them
// large pages could be expensive to checkpoint?
// normally
// 1. take timestamp, latch all dirty pages
// 2. append all dirty pages, plus the new manifest, to the data file 
// 3. write a checkpoint record to the log.

// alternately in 2, we can write the dirty page to the log. when we restore we read these from the log and write them to the store. 
// but then we need to be careful about size classes. 
// we could also 
// we can write the location of the checkpoint in each group
// master records only affect checkpoints.

const logSize = 8 * 1024 * 1024
const headSize = 4096

// each log entry is 4 byte length + 4 byte op and flags.


// there are two logs: fh[0] is history, f[1] is active
export class Log {

    constructor(
        public fh: StoreFile[],
        public begin = 0,
        public beginActive = 0,
        public logPos = 0) { }

    // d typically has multiple records in it. probably pad to 4k?
    async write(d: Uint32Array) {
        return this.fh[1].write(d, { at: this.logPos })
        this.logPos += d.length * 4
    }

    rotate() {
        // if trim is bigger than oldest + length
        // we need to flush a master record here? Or maybe just a log record.
        const a = this.fh[0]
        this.fh[0] = a
        this.fh[1] = this.fh[0]
        this.beginActive = this.logPos
    }


    read(at: number, fn: (a: Uint32Array) => boolean) {
        // start with the history file. read until we get to the begin active
    }
}




