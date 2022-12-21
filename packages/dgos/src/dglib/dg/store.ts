
export const x = 1

// Create a local store, maybe merge in some program assets, but use dglib to manage a store that 

// 1. Create a store - this needs to accept a url for the data, maybe two for concierge. does this mean the entire site then is a component?
// 2. Build a layout on that store. Could this be built into dgos?


class Db {

}

class DbProvider {

}

class DbView {

}

export interface DbConfigure {
}

export function defineDb(a: DbConfigure): Db {
    return new Db
}



