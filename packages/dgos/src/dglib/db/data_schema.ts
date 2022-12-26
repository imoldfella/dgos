

export function useQuery(a: (x: any) => void) {
    // when executing the query we can record the parameters it uses.
    return a(1)
}
export class Table2 {

}
export function defineTable2<Key, Rest>(opt: (o: Key & Rest) => void) {
    return [{} as Key & Rest, {} as Key, {} as Rest]
}

// animation-play-state: running | paused
export interface ColumnSchema {
    name: string
    type: string
    default: string
}
export type TableObject = string | number | ColumnSchema

type AttributeSet = {
    [key: string]: TableObject
}
type Table = AttributeSet
export type TableSchema<Attributes extends AttributeSet> = Attributes
export type View<Props, Attributes extends AttributeSet> = (props: Props) => Attributes
export type TableLike<Attributes extends AttributeSet, Props = any> = TableSchema<Attributes> | View<Props, Attributes> //IndexSchema |  | View | Index 


export function defineTable<T extends Table>(fn: (a: T) => void) {
    return {} as T
}
export function primary(a: any) {

}


// one advantage of keeping this a function is that it can be reactive; if the database changes its schema, the local database can know to recompile
// how would we write an app that can read a general database though? this might not be possible on the web, but seems useful. could just use empty schema which is compatible with everything. 

export function insert<Tuple>(fn: (t: Tuple) => void) {

}
export function update<Tuple>(fn: (x: Tuple) => void) {

}
export function remove<Target>(fn: (t: Target) => boolean) {
}
export function merge<Target, Source>(fn: (t: Target, y: Source, matched: boolean) => void) {

}
export function drop() { }



export interface SchemaOption {
    upgrade: (existing: Schema) => any
}

export function defineSchema<T extends Schema>(a: T, opt?: SchemaOption) {
    return () => a
}

export function createView<T, A extends AttributeSet>(fn: (x: T) => TableSchema<A>) {
    return fn
}


export function count() { return {} as ColumnSchema }
export function all() { return {} as ColumnSchema }
export function limit(x: number) { }

export function where(x: boolean) { }
export function sort(x: any) { }
export function group(x: any) { }
export function $in(x: any, y: any) { return true }

export type Tx = {}
export type TxFn = (...x: any[]) => Object

export type SchemaObject = ((...x: any[]) => TableLike<any, any>) | Table | TxFn
export interface Schema {
    [key: string]: SchemaObject
}
export interface SchemaSet {
    [key: string]: Schema
}
export function createDb(d: SchemaSet) {
}
export function useDb(worker: URL, dbs: SchemaSet) {

}
// const artists = defineTable<{
//     name: string,
//     age: number
// }>((t) => {
//     primary(t.name)
// })

export function outer<T>(x: T): T | null {
    return x
}

export function lateral(fn: () => any): void {
}