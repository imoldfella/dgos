
// Map with a zero value that makes a new value for misses.
export class Map0<K,V> extends Map<K,V> {
    constructor(public make: ()=>V){
        super()
    }
    get(k: K) :V {
        let v = super.get(k)
        if (!v) {
            v = this.make()
            super.set(k,v)
        }

        return v
    }
}

