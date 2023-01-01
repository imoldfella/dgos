
export enum Op {
    nuke, truncate, flush, close, getSize, read, write
}
export interface OpfsRq {
    userdata: number
    op: number
    fh: number
    at: number
    begin: number
    end: number
}
export class Req {
    constructor(public nv: Float64Array) {
    }
    get userdata() { return this.nv[0] }
    get op() { return this.nv[1] }
    get fh() { return this.nv[2] }
    get at() { return this.nv[3] }
    get begin() { return this.nv[4] }
    get end() { return this.nv[5] }

}
/*
    tag = 42
    m = new Map<number, [resolve: (a: any) => void, reject: (e: any) => void]>()
            const [userdata, result] = e.data
            const o = this.m.get(userdata)!
            this.m.delete(userdata)
            o[0](result)
*/
