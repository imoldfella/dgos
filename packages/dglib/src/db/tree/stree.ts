

export class BlockStore {

}



export class CacheTable {
    //
}
export class DenseTable {
    b = new SharedArrayBuffer(1024 * 1024 * 1024)
}

export class Stree {
    b = new SharedArrayBuffer(1024 * 1024 * 1024)
    v
    constructor() {
        this.v = new Uint32Array(this.b)
    }


}


class Tree {

}

// tree with fixed root that points to other trees
class TreeTree extends Tree {

}

export class Ustore extends TreeTree {

}