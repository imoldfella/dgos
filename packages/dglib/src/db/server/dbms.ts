import { Dbms, Query, Statement, Tx } from "../data"
import { Fs, PortLike } from "../weblike"
import { z } from "zod"

// 
const FormData = z.object({
    firstName: z.string().min(1).max(18),
    lastName: z.string().min(1).max(18),
    phone: z.string().min(10).max(14).optional(),
    email: z.string().email(),
    url: z.string().url().optional(),
});
type FormData2 = z.infer<typeof FormData>

async function commitForm(x: FormData2) {
    return {
        welcome: x.firstName
    }
}

export class TxSvr implements Tx {
    async commit(): Promise<boolean> {
        return true
    }
}
export class QuerySvr<T> implements Query<T> {
    forEach(fn: (e: T) => void): void {
        throw new Error("Method not implemented.");
    }
    // sometimes we want the delta, or always provide the delta?
    // it probably computed anyway?
    addListener(fn: () => void) {
    }
    removeListener(fn: any) {
    }
    close() { }
}

export class StatementSvr<P, T> implements Statement<P, T>  {
    exec(tx: Tx, props: P): Query<T> {
        throw new Error("Method not implemented.");
    }
}

// for cases like world maps, we split the tiles into groups
export class ServerSyncState {
    // 
}

// 


// the sql compiler needs to be an optional module, its like to be large.
// https://github.com/diamondio/better-queue
export class DbmsSvr implements Dbms {
        // we need to keep a list in the database of chunks that we want to obtain.
    // this is subject to change.
    constructor(public url: string, public fs: Fs) {
        this.proc.set('commitForm', [ FormData, commitForm])
        console.log("server running")
    }


    proc = new Map<string, [z.ZodObject<any>,  (params: any) => Promise<any>]>()

    online: boolean = false
    ws?: WebSocket  // null is disconnected

    // we need some kind of active query to know what groups we should be downloading the length of.
    async setStatus(s: boolean) {
        if (this.online == s) return
        // update a table in the database to note our status has changed.
        this.online = s
        if (s) {
            // when we first connect we need to remind the server of the groups we are listening to

        } else {
            this.ws?.close()
            this.ws = undefined
        }
    }

    async tryConnect() {
        this.ws?.close()
        // browser and ShardWorker is not compatible, we need some wrapper
        this.ws = new WebSocket(this.url)
        this.ws.onopen = () => {
            this.setStatus(true)
        }
        this.ws.onmessage = (e: MessageEvent) => {
            this.recvServer(e.data)
        }
        this.ws.onerror = () => {
            this.setStatus(false)
            this.ws = undefined
        }
        this.ws.onclose = () => {
            this.setStatus(false)
            this.ws = undefined
        }
    }

    // priority queue?
    chunksWanted: string[] = []
    pullCount = 0

    async pullChunk() {
        // we probably want a database backed priority queue, and indexed by server so we can adjust based on which servers are online.
        const u = this.chunksWanted.pop()
        if (!u) return
        this.pullCount++
        const o = await fetch(u)
        // store the chunk, recompute outstanding queries based on the new information if possible

        // pulling this chunk might inspire us to go pull more.

        this.pullCount--
    }


    async query<P, T>(stmt: Statement<P, T>, props: T): Promise<Query<T>> {
        return new QuerySvr()
    }
    api<T>(a: T) {

    }
    table(a: any) {
    }
    formula(a: any) {
    }

    async begin(): Promise<Tx> {
        return new TxSvr()
    }

    // the shared worker will connect users with something like MessagePort
    connect(p: PortLike) {
        console.log("client connected")
    }
    disconnect(p: PortLike) {
        console.log("client disconnected")
        // clean up subscriptions
    }
    async commit(p: PortLike, msg: any) {
        const { id, params } = msg
        try {
            const fnd = this.proc.get(msg.method)
            if (fnd && fnd[0].safeParse(params).success) {
                return { id: id, result:  await fnd[1](params) }
            
            } else {
                throw `bad ${msg.method}`
            }
        } catch (e: any) {
            return { id: id, error: e.toString() }
        }
    }
    recvServer( d: any) {

    }
}

// pass encoded as cbor
// 
interface TxData {
    method: string,
    id: number,
    params: any
}




