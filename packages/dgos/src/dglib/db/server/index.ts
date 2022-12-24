import { ClientApi } from "../data";

// we need interfaces that can be shipped to another worker.
export class Statement {

}
export class Query {
    // sometimes we want the delta, or always provide the delta?
    // it probably computed anyway?
    addListener(fn: ()=>void){
    }
    removeListener(fn: any) {
    }
    close(){}
}
export class Tx {

}
export class Dbms implements ClientApi {

    // we need an interface that we can return through the proxy

    async prepare(sql: string) : Promise<Statement>{
        // we can't
        return new Statement()
    }
    async begin() {
    }

    async query<T>(stmt: Statement, props: T) : Promise<Query>{
        return new Query()
    }
    api<T>(a: T){

    }
    table(a: any){
    }
    formula(a: any){
    }
    onconnect(p: MessagePort){
    }
}

export interface Options {
    
}
export async function createDbms( opt?: Options){
    return new Dbms()
}

// // this allows you use dbms directly without a sharedWorker
// export async function testDb<T>(opt?: Options) {
//     // note this your application's shared worker, but it should expose Datagrove methods for Db to work. 
//     return  new Dbms()
// } 
