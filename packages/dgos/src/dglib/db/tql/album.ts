
import { where, limit, sort as order, primary, insert, update, remove, merge, drop, Schema, outer, SchemaObject, lateral } from '../data_schema'

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
    })
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
export const updateActor: SchemaObject = (props: { name: string, age: number }) => {
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