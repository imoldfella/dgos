

export function useQuery(a: (x: any)=>void) {
    // when executing the query we can record the parameters it uses.
    return a(1)
}

// animation-play-state: running | paused
export interface ColumnSchema {
    name: string
    type: string
    default: string
}
export type TableObject = string | number | ColumnSchema
export interface TableSchema {
    [key: string] : TableObject
}

type DbObject = TableSchema | View<any> //IndexSchema |  | View | Index 

export interface Schema {
    [key: string]: ()=>DbObject, 
}
export interface DbSchema {
    [key: string]: (old: Schema)=>Schema
}

export type View<T>  = (a: T)=>()=>View<any>
// do we always load the shared worker from the domain?
// here we have the origin string or the worker string? are they required to be the same?
// the shared worker lives in an iframe,
// can we make schemas incrementally downloadable?
// we will call this from shared worker, which is application specific
// it will request all the schemas listed in the dbs, and attempt to reconcile them.
export function defineTable<T>(a: T) { return ()=>a}

export function defineDb<T extends DbSchema>(a: ()=>T):DbSchema{
    return a()
}
export function createDb(d: DbSchema) {
}

export function useDb(worker: URL, dbs: DbSchema) {

}

// one advantage of keeping this a function is that it can be reactive; if the database changes its schema, the local database can know to recompile
// how would we write an app that can read a general database though? this might not be possible on the web, but seems useful. could just use empty schema which is compatible with everything. 

export function defineSchema<T extends Schema> (a: (existing: Schema)=>T) { 
    return ()=>{
       return a({})
    }
}







export function count() { return {} as ColumnSchema }
export function all() { return {} as ColumnSchema }
export function limit(x: number) { }

export function where(x: boolean) { }
export function sort(x: any) { }
export function group(x: any) { }
export function $in(x: any,y:any) {return true }
export function query(x: any) {}