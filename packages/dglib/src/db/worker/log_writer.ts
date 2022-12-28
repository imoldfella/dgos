import { useFs, StoreFile } from '../../opfs'
import { LogHeader } from './log_buffer'
import { useLogReader } from './log_client'

export interface LogState {
    buffer: WebAssembly.Memory
    offset: number
    length: number
    active: number // 0 or 1
    logPos: number // monotonic from 0
    activeStart: number // monotonic from 0
}


export async function run(e: LogState) {
    const lr = await useLogReader()

    // d typically has multiple records in it. probably pad to 4k?
    async function write(d: Uint32Array) {
        return lr.fh[1].write(d, { at: e.logPos })
        e.logPos += d.length * 4
    }

    function rotate() {
        // if trim is bigger than oldest + length
        // we need to flush a master record here? Or maybe just a log record.
        const a = lr.fh[0]
        lr.fh[0] = a
        lr.fh[1] = lr.fh[0]
    }

    const c = 0
    const data = new Int32Array(e.buffer.buffer, e.offset, e.length)
    while (data[LogHeader.quit] == 0) {
        // Atomics.wait(data, LogHeader.signal, c)

        // clear every consecutive log entry. update the 
    }
}




// shared worker. uses a memory buffer and atomics to signal
// this is just a log writer, for recovery read the log files directly



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

// each log entry is 4 byte length + 4 byte op and flags.
// there are two logs: fh[0] is history, f[1] is active


// clients will allocate a chunk in the log, fill it, then signal the log writer.
// the log writer will advance the pointer as far as it can, writing the log records to disk
// if there is not enough space left, first write pad, then wrap around and start from beginning



// this doesn't need to be a shared worker, it can be started by sp, then use atomics to trigger.
// 
