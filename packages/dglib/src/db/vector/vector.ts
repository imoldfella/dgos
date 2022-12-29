
export interface Vector {

}

export interface Rebaseable {

}
// a rebaseable proxy will have the same interface Rebaseable


// each update is a mini-transaction; it will fail though if it doesn't know the correct version. The app that created the transaction will need to rebase it.
export interface UpdateVector {
    id: bigint
    expectedVersion: bigint

}

type ptr = number
export interface CountedPage {
    i: ptr

    // leanstore pages begin with fixed width slots; in the case of varlen keys, these hold a prefix and a start. length is prefixed onto the 
}
// trees can have a 64 bit key as an optimized case
// we might want a way to generate code - how? from ast?
// some nodes might be faster if we made them static, at the cost of expensive updates.
// the
function cp_find(i: ptr) {
    
}
function cp_insert(e: ){

}

export function searchCountedPage( ){

}

// called from 
export function updateVector(db: any, u: UpdateVector) {

}