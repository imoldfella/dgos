


// per Aria, the snapshot is taken at the beginning a frame
// all transactions are executed or deferred against this snapshot
export class Snapshot {

}

export class Executor {

}

interface Tx {

}

type ptr = number
type TxBatch = ptr


// fast workers use shared memory to receive tasks.
class FastWorker {

}


class ThreadPool {
    worker: TxWorker[] = []
    async rpc(op: Float64Array) : Promise<Float64Array> {
        return op
    }
}



function executeBatch1( b: TxBatch) {
    for (let
}

function parExecuteBatch(tm: ThreadPool, b: TxBatch){
    for (let i in tm.worker) {
        tm.worker[i].
    }

}