import { Dbms, Query, Statement, Tx } from "../data";
import { Fs, PortLike } from "../weblike";


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


// the sql compiler needs to be an optional module, its like to be large.
// https://github.com/diamondio/better-queue
export class DbmsSvr implements Dbms {
    server = new Set<Server>()

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

    // we need to keep a list in the database of chunks that we want to obtain.
    // this is subject to change.
    constructor(public fs: Fs){
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
    }
    disconnect(p: PortLike) {

    }
    recv(p: PortLike, msg: any) {

    }
    recvServer(s: Server, d: any) {

    }
}


// in future allow webrtc endpoints.
// there is one for each dns/origin.
// these may proxy a mobile native server.
interface  Server {
    tryConnect() : void
}

// each server may be responsible for multiple hosts, each host may be responsible for multiple databases. the only we care about is the database though, and within that the length of the group log is the important thing. length is in batches, 
export class WsServer implements Server {
    online: boolean = false
    ws?: WebSocket  // null is disconnected

    // we need some kind of active query to know what groups we should be downloading the length of.

    constructor(public dbms: DbmsSvr, public url: string){
        this.tryConnect()
    }

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

    async tryConnect()  {
        this.ws?.close()
        this.ws = new WebSocket(this.url)
        this.ws.onopen = () => {
           this.setStatus(true)
        }
        this.ws.onmessage=(e: MessageEvent) =>{
            this.dbms.recvServer(this,e.data)
        }
        this.ws.onerror=()=>{
            this.setStatus(false)
            this.ws = undefined
        }
        this.ws.onclose=()=>{
            this.setStatus(false)
            this.ws = undefined
        }
    }
}
