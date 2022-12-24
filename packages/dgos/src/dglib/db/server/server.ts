import { Dbms, Query, Statement, Tx } from "../data";

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

export class StatementSvr<P,T> implements Statement<P,T>  {
    exec(tx: Tx, props: P): Query<T> {
        throw new Error("Method not implemented.");
    }

}
export class DbmsSvr implements Dbms {

    // we need an interface that we can return through the proxy

    async prepare<P,T>(sql: string): Promise<Statement<P,T> > {
        // we can't
        return new StatementSvr<P,T>()
    }
    async begin(): Promise<Tx> {
        return new TxSvr()
    }

    async query<P,T>(stmt: Statement<P,T> , props: T): Promise<Query<T>> {
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
