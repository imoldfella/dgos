
import { where, limit, sort as order, primary, insert, update, remove, merge, drop, Schema, outer, SchemaObject, lateral } from '../../dgos/src/dglib/db'


// global structs used in relevant functions (e.g) primary are tables
// functions are views/queries and transactions. transactions can be identified because they call insert,remove, etc
type RichText = {}
function schema(a: any, b: any) { }
const Markdown = ""

// tql can manage rich text and other arrays
// rich text can be typed with prosemirror schemas, including an extended Markdown one
const bio = {
    name: "",
    bio: [] as RichText[]
}
schema(bio.name, Markdown)
type Bio = typeof bio
primary(bio.name)

// we can incrementally modify arrays and use tsx. Updates automatically rebase, or disable with commit({rebase: false})
export function updateBio() {
    update((x: Bio) => {
        if (bio.name == "joe") {
            x.bio.splice(100, 1, <em>STAR!!</em>)
        }
    })
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

const artists = {
    name: "",
    age: 0
}
type Artists = typeof artists
primary(artists.name)

const album = {
    name: "",
    artist: "",
}
type Album = typeof artists
primary(album.name)

const sold = {
    name: "",
    count: 0,
}
type Sold = typeof sold
primary(album.name)

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
export const updateActor = (props: { name: string, age: number }) => {
    insert((x: Artists) => {
        x = props
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





/*
MERGE TargetProducts AS Target
USING SourceProducts	AS Source
ON Source.ProductID = Target.ProductID
    
-- For Inserts
WHEN NOT MATCHED BY Target THEN
    INSERT (ProductID,ProductName, Price) 
    VALUES (Source.ProductID,Source.ProductName, Source.Price)
    
-- For Updates
WHEN MATCHED THEN UPDATE SET
    Target.ProductName	= Source.ProductName,
    Target.Price		= Source.Price
    
-- For Deletes
WHEN NOT MATCHED BY Source THEN
    DELETE
*/