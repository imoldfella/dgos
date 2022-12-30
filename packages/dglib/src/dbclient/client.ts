import { Schema, Tx } from "../db"
import { Dbms, Query, Statement } from "../db/data"

// mostly we want to use insert, merge/upsert, delete, splice that are generated from tables with the compiler
// these must be compiled and run through a query optimizer. For every transaction statement there is a query against the 

// the compiler will generate slightly different code for react compared to solid.
// both will include code from here.

// each query will grab the provider
// login is managed by dgos

// <Datagrove server='www.datagrove.com'>{app}</Datagrove>
//   <App> </App>
// </Datagrove>

// generate with compiler:
// const d = createSomeQuery() // uses provider

//
// <s>
//  



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
export class Db {

    // there is a global time for the database and a local time for this device.

    async ask(method: string, params?: any): Promise<any> {
    }
    constructor(public port: MessagePort) {
        port.onmessage = () => {
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
export async function useDb(u: URL, schema: Schema) {
    // note this your application's shared worker, but it should expose Datagrove methods for Db to work. 
    const w = new SharedWorker(u)
    return new Db(w.port)
}

