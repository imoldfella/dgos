
// should be generated
// each table has functions to delete, insert, update

import { SolidDb } from "./db"
import { TxMgr, Db } from "../db/client/client"

export function deleteTabTx(tx: TxMgr, i: number) {
    // tx.branch(tx.db.profile)
    // tx.drop(i)
}
export function deleteTab(db: Db, i: number) {
    const tx = db.begin()
    deleteTabTx(tx, i)
    tx.commit()
}
// return a function that can take either tx or db
export function insertTabTx(tx: TxMgr) {

}
export function insertTab(db: Db) {
    const tx = db.begin()
    insertTabTx(tx)
    tx.commit()
}
export class Updater {
    // assume that 
    forward = (a: Uint8Array) => a
    back = () => { }
}