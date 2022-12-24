import { Dbms, Query, Statement, Tx } from "../data";

export class TxSvr implements Tx {
    async commit(): Promise<boolean> {
        return true
    }
}
export class QuerySvr implements Query {
    // sometimes we want the delta, or always provide the delta?
    // it probably computed anyway?
    addListener(fn: () => void) {
    }
    removeListener(fn: any) {
    }
    close() { }
}

export class StatementSvr implements Statement {

}
export class DbmsSvr implements Dbms {

    // we need an interface that we can return through the proxy

    async prepare(sql: string): Promise<Statement> {
        // we can't
        return new StatementSvr()
    }
    async begin(): Promise<Tx> {
        return new TxSvr()
    }

    async query<T>(stmt: Statement, props: T): Promise<Query> {
        return new QuerySvr()
    }
    api<T>(a: T) {

    }
    table(a: any) {
    }
    formula(a: any) {
    }
    onconnect(p: MessagePort) {
    }
}

export interface Options {

}
export async function createDbms(opt?: Options) {
    return new DbmsSvr()
}

// // this allows you use dbms directly without a sharedWorker
// export async function testDb<T>(opt?: Options) {
//     // note this your application's shared worker, but it should expose Datagrove methods for Db to work. 
//     return  new Dbms()
// } 
