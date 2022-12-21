import { Db, TxMgr } from "../client/client"
import { BranchHandle } from "./util"


// device.table, user.table, shared.table(branchset, branch )
// 

// maybe instead of db we need to take a branch handle?
// or maybe branch is an argument as well? or maybe branch needs to be

// the user has a "read" count per branch, this is shared across all devices

// update online  ... where branch='temp'
export interface UpdateOnlineTx {
    url: string
    status: string
}
export function updateOnlineTx(tx: TxMgr, props: UpdateOnlineTx) {

}

export async function updateOnline(db: Db, props: UpdateOnlineTx) {
    const tx = db.begin()
    updateOnlineTx(tx, props)
    await tx.commit()
}


export interface UpdateTracking {

}

export function updateTracking(db: Db, props: UpdateTracking) {

}

interface ServerRow {
    url: string
}
// create table user.server(url, name, viewLsn)
// create table device.serverStatus(url,status, read, written)
export interface QueryServer {
    row: ServerRow[]
    inserted: ServerRow[]
    deleted: ServerRow[]
}
export function queryServer(db: Db, props: {}, fn: (x: QueryServer) => void): void {

}

export async function deleteServerStatus(db: Db, props: any) {

}

