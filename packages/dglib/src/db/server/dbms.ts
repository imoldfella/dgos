import { decode, encode } from "cbor-x";
import { Identity } from "../../crypto";
import { Fs, PortLike } from "../weblike"
import { ObserveRange } from "./data";

// to take advantage of zero round trip, we need to 
export class Session {
    // we should immediately send a
    observeRange(r: ObserveRange) {
        this.closeRange(r.id)
        this.resource.set(r.id, r)
        // we need to create a start query and a trigger.
    }
    resource = new Map<number, ObserveRange>()
    constructor(
        public port: PortLike,
        public dbms: DbmsSvr) { }

    closeRange(id: number) {
        const o = this.resource.get(id)
        if (o) {
            this.resource.delete(id)
        }
    }
    close() {
        for (let v of this.resource.keys()) {
            this.closeRange(v)
        }
    }
}

// per worker?
export interface wasmImports {

}
export interface Platform {
    sendHost(arg0: any): void;
    url: string
    fs: Fs
    identity: Identity
}
// the sql compiler needs to be an optional module, its like to be large.
// https://github.com/diamondio/better-queue
export class DbmsSvr {
    // we need to keep a list in the database of chunks that we want to obtain.
    // this is subject to change.
    constructor(public os: Platform) {
        this.proc.set('close', async (dbms: Session, method: string, id: number, x: number) => {
            dbms.closeRange(id)
        })
        console.log("server running")
    }

    client = new Map<object, Session>()
    proc = new Map<string, (dbms: Session, method: string, id: number, params: any) => Promise<any>>()

    chunksWanted: string[] = []
    pullCount = 0
    private async pullChunk() {
        // we probably want a database backed priority queue, and indexed by server so we can adjust based on which servers are online.
        const u = this.chunksWanted.pop()
        if (!u) return
        this.pullCount++
        const o = await fetch(u)
        // store the chunk, recompute outstanding queries based on the new information if possible

        // pulling this chunk might inspire us to go pull more.

        this.pullCount--
    }
    nextHostTag = 42
    pend = new Map<number, (x: any) => void>()
    async ask(method: string, params: any): Promise<any> {
        const tag = this.nextHostTag++
        return new Promise(resolve => {
            const r = this.os.sendHost(encode({
                method,
                id: tag,
                params
            }))
            this.pend.set(tag, resolve)
        })
    }

    rcvHost(m: Uint8Array) {
        const o = decode(m)
        const r = this.pend.get(o.id)
        if (r) {
            r(o)
            this.pend.delete(o.id)
        }
    }
    // background sync service, called after connecting to the host
    async start() {
        // I need to send 
        await this.ask('subscribe', [])
    }

    // call when a client connects, identity must be the first message
    // if the identity is invalid we should disconnect.
    // this identity must include the private key and a valid chain
    // the shared worker must receive its identity from 
    connect(p: PortLike) {
        this.client.set(p, new Session(p, this))
        console.log("client connected")
    }
    // call when a client disconnects
    disconnect(p: PortLike) {
        console.log("client disconnected")
        // clean up subscriptions
        this.client.get(p)?.close()
        this.client.delete(p)
    }

    // use any here to support structured cloning in shared worker
    // we need to determine if this is faster or slower than cbor
    // we might need to cbor in any event to push the transaction to webassembly?
    async commit(p: PortLike, msg: any) {
        const { method, id, params } = msg
        try {
            const sess = this.client.get(p)
            if (!sess) throw 'disconnected'

            const fnd = this.proc.get(method)
            if (fnd) {
                // maybe here we should batch them instead?
                // if we let it proceed we need a lock of some kind.
                // at some point we want to get these to zig based workers.
                // these workers must then somehow activate the triggers.
                // we could use atomics to wait here and only allow a single committer.
                //Atomics.wait(this.mem
                return { id: id, result: await fnd(sess, method, id, params) }

            } else {
                throw `bad ${msg.method}`
            }
        } catch (e: any) {
            return { id: id, error: e.toString() }
        }
    }
}

// note that host is not needed here; the server only allows one host and its already initialized from the shared worker or .env. We still need the identity, because we may have multiple identities that connect to this? Or maybe we should start a new server for each identity. That won't work though because we would need a separate sharedworker, which is identified by the url? we could use the name in a dictionary


/*

    async begin(): Promise<Tx> {
        return new TxSvr()
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
*/
