/* @jsxImportSource solid-js */
import { TextPart, emptyText, emptySheet, emptyPresent, where, index, limit, sort as order, primary, insert, update, remove, merge, drop, Schema, outer, SchemaObject, lateral, dictionary, sys as base } from '../../../dglib/src/dbcompiler'


// define tables
const artists = {
    ...base,
    name: "",
    age: 0,
    bio: emptyText,
    budget: emptySheet,
    hype: emptyPresent,
}
type Artists = typeof artists
primary(artists.name)

const album = {
    ...base,
    name: "",
    artist: "",
}
export type Album = typeof artists
primary(album.name)

const sold = {
    ...base,
    name: "",
    count: 0,
}
export type Sold = typeof sold
primary(album.name)

// top 3 albums for each artist
export function lateralJoin() {
    artists.name == album.artist
    const s = lateral(() => {
        sold.name == album.name
        limit(3)
        order(sold.count)
        return sold
    })
    return {
        name: artists.name,
        album: album.name,
        count: sold.count
    }
}

// all artists and albums
export function outerJoin() {
    artists.name == outer(album)?.artist
    return {
        name: artists.name,
        album: album?.name ?? "not recorded"
    }
}
// outer
// we can incrementally modify arrays and use tsx. Updates automatically rebase, or disable with commit({rebase: false})
export function updateBio() {
    const el = <em>STAR!!</em>

    update((x: TextPart) => {
        if (x.rowid == BigInt(0)) {
            x.data.splice(100, 1, el)
        }
    })
}

// a spreadsheet is 
// create table sscell (doc,col,row,value)
// create table ssdoc (doc,row[],col[],sheet[],meta1,...)
export function updateBudget() {
    // inserting a sheet, row, or column will allocate a new id locally that will be converted to a global id on the server
    // normal insertion for the value, and ordered insertion for the position.


}

export function viewOver(age: number) {
    let a = artists // creates dependenciey on 
    limit(100)
    where(a.age > age)
    order(a.name)
    return {
        name: a.name,
        age: a.age,
    }
}

//let b = outer(artists)

export function viewOver42b(n: number, y: string) {
    let a = viewOver(42) // creates dependenciey on 
    limit(n)
    where(a.age < 62)
    order(a.name)
    return {
        name: a.name,
        age: a.age
    }
}

// returns object so that can be updated on successful commit
export const updateActor = (props: Partial<Artists>) => {
    insert((x: Artists) => {
        x = {
            ...x,
            ...props
        }
    })
    update((x: Artists) => {
        if (x.age > 42) {
            x.name = "tim"
        }
    })
    remove((x: Artists) => x.age < 32)

    const updated = merge((x: Artists, y: Artists, matched: boolean) => {
        if (x.name == y.name) { // on condition
            // if matched is false, x will be defaults
            if (matched) {
                x.name = y.name  // y and x
            } else {
                x.name = y.name // y but no x
            }
        } else {
            // here we have x, but not y
            drop()
        }
    }
    )

    return {
        updated
    }
}

// by default resolve schema differences automatically. allow override
// default export? optional argument for manual resolution of upgrades.
export const albumSchema: Schema = {
    artists,
    viewOver,
    viewOver42b,
    updateActor,
    outerJoin,
}



