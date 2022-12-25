import { Dbms, Query, Statement, Tx } from "../data";
import { Fs, useFs } from "../fs";


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

export class DbmsSvr implements Dbms {
    constructor(public fs: Fs){
    }

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
    onconnect(p: MessagePort) {
    }
}
