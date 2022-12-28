import { JSXElement } from "solid-js"


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
export type TableObject = string | number | bigint | ArrayLike<any> | any[] | ColumnSchema

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
export function primary(...a: any[]) {

}
export function dictionary(...a: any[]) {

}

export function index(...a: any[]) {

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
// global structs used in relevant functions (e.g) primary are tables
// functions are views/queries and transactions. transactions can be identified because they call insert,remove, etc
export type Rowid = bigint
export type RichText = JSXElement
export const emptyRichText = [] as RichText[]
export type CellValue = {}
export const emptyCell = [] as CellValue[]
export function schema(a: any, b: any) { }
export const Markdown = ""
export const emptyArray64 = new BigInt64Array(0)
export const z64 = BigInt(0)
// these are references to 
export const emptyText = BigInt(0)
export const emptyPresent = BigInt(0)
export const emptySheet = BigInt(0)
export const duid = z64


// we support an extensible concept of documents in the database including an overall file system per group that holds all the files that group can read. Each user can view this as a single file system where the top level folders are the groups the user belongs to.

export const sys = {
    gid: z64,
    rowid: z64

}
// redundant with tuple history, but arguably pulling the history of a value is more useful than pulling the history of entire group.
export const tupleHistory = {
    modifiesRowid: z64,
    txid: z64,
    proc: "",
    props: Uint8Array
}
dictionary(tupleHistory.proc)
primary(tupleHistory.modifiesRowid, tupleHistory.txid)

primary(z64)

export const snapshot = {
    txid: z64 // time associated with snapshot.
}

export const txhistory = {
    txid: z64,
    recorded: z64,
    device: z64,
    modifiedRowid: emptyArray64
}
// uses the rowid for a primary key.
export const doc = {
    createdTx: 0,  // the transaction the document was created. It becomes an alternate key preferred to docuuid when its available
    name: "untitled",
    main: z64,
    type: ""
}

// 
export const dir = {
    ...sys,
    npath: 0,
    path: "",
    doc: z64,
    modified: z64,    // redundant with rowid, but saves an expensive join.   
}
primary(dir.gid, dir.rowid)
index(dir.gid, dir.npath, dir.path)


export const sspart = {
    ...sys,
    row: emptyArray64,
    col: emptyArray64,
    sheet: emptyArray64
}
export type Sspart = typeof sspart

// maybe we should use a single hilbert numbering system here?
export const sscell = {
    sheet: 0, col: 0, row: 0, cellType: 0, cellValue: emptyCell
}

export const textPart = {
    ...sys,
    data: [] as RichText[]
}
export type TextPart = typeof textPart

export const presentPart = {
    ...sys,
    slide: emptyArray64
}
export const slidePart = {
    partOf: z64,
    present: [] as DrawPart[]
}
export type PresentPart = typeof presentPart
export type DrawPart = ImagePart | SvgPart
export type ImagePart = {
    type: "image"
}
export type SvgPart = {
    type: "svg"
}

// tql supports row level security, and a easy to use template called concierge 
// each table by default has a groupid attribute for row level security.
// createGroup assigns the next available id.
// id 0 can access all the rows, each
export function createGroup(name: string) {
}
// grant to a user
// inserts the user into role table, encrypts an access key for their use.
type Privilege = "admin" | "write" | "read"
type PublicKey = string
export function grant(group: string, priv: Privilege, to: PublicKey) {

}
export function revoke(group: string, priv: Privilege, to: PublicKey) {

}

// tql supports branching, tagging, and adoption
// a branch is a logical copy of the database, unlike a group it can have its own modified schema and security
export function createBranch(name: string) { }
export function createTag(name: string) { }
// merge local changes on top of changes from the source
export function rebase(from: string) { }
// like a cherry pick; makes this branch identical to the source
export function adopt(from: string) { }
