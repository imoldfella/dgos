import { Dbms, Query, Statement, Tx } from "../data"


// should we use comlink to wrap the shared worker? that way the user can easily create their own shared worker that includes datagrove.
export class TxClient implements Tx {
    constructor(public db: Db) {
    }
    async commit(): Promise<boolean> {
        return true
    }
}
export class QueryClient<T> implements Query<T> {
    constructor(props: any) {
    }
    forEach(fn: (e: T) => void): void {
        throw new Error("Method not implemented.")
    }
    // sometimes we want the delta, or always provide the delta?
    // it probably computed anyway?
    addListener(fn: () => void) {
    }
    removeListener(fn: any) {
    }
    close() { }
}

export class StatementClient<P, T> implements Statement<P, T> {
    constructor(x: any) {
    }
    exec(tx: Tx, props: P): Query<T> {
        throw new Error("Method not implemented.")
    }
}
// first get a config from options
// this can be instantiated in multiple workers and in the main thread
// send options to get a config, use config to create a Db to use
export interface Options {
}

// procs is an object used to create wrappers for "server side" procedures in your shared worker
export class Db implements Dbms {
    // there is a global time for the database and a local time for this device.

    async ask(method: string, params?: any): Promise<any> {
    }
    constructor(public sw: SharedWorker) {
        sw.port.onmessage = () => {
            // a stream of query updates, 
        }
    }
    async prepare<P, T>(sql: string): Promise<Statement<P, T>> {
        return new StatementClient(await this.ask('prepare', sql))
    }
    async begin(): Promise<Tx> {
        return new TxClient(this) //this.ask('begin'))
    }
    async query<P, T>(stmt: Statement<P, T>, props: T): Promise<Query<T>> {
        return new QueryClient(this.ask('query', props))
    }
}

// call with the URL for your Datagrove enhanced shared worker
export async function useDb(u: URL) {
    // note this your application's shared worker, but it should expose Datagrove methods for Db to work. 
    return new Db(new SharedWorker(u))
}

