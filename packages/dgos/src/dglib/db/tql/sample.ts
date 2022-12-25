

import { where, limit, count, all, sort } from './tql'

function f(key: string): any {
    console.log("evaluate: ", key);
    return function () {
        console.log("call: ", key);
    };
}
function table(): any { }

class db {

    @table()
    artists() {
        return {
            name: ""
        }
    }

    @f("red")
    countArtists() {
        return {
            a: this.artists().name,
            c: count()
        }
    }


    topArtists() {
        limit(5)
        let a = this.artists()
        where(a.name > "a")
        wherein(a.name, a)
        sort(a.name)
        group(a.name)
        return {
            c: all()
        }
    }
}