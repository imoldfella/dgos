/*export abstract class Fs {

    abstract remove(fh: number): Promise<void>
    abstract create(fh: number): Promise<number>
    abstract open(fh: number): Promise<number>
    abstract truncate(fh: number, len: number): Promise<void>
    abstract flush(fh: number): Promise<void>
    abstract close(fh: number): Promise<void>
    // abstract write(a: ArrayBuffer, opt?: { at: number }): number
    // abstract read(a: ArrayBuffer, opt?: { at: number }): number
    abstract getSize(fh: number): Promise<number>
    abstract read(fh: number, at: number, begin: number, end: number): Promise<void>
    abstract write(fh: number, at: number, begin: number, end: number): Promise<void>

    // is this special or just a write?
    //abstract log(index: number, page: Uint32Array): Promise<void>

    async writeJson(path: string): Promise<void> {
    }
    async readJson(): Promise<any> {
        return
    }
}
*/

export enum Op {
    nuke,  truncate, flush, close, getSize, read, write
}
interface OpfsRq {
    userdata: number
    op: number
    fh: number
    at: number
    begin: number
    end: number
}
type Completer = (baton: number, result: number)=> Promise<void>
/*
    tag = 42
    m = new Map<number, [resolve: (a: any) => void, reject: (e: any) => void]>()
            const [userdata, result] = e.data
            const o = this.m.get(userdata)!
            this.m.delete(userdata)
            o[0](result)
*/
export abstract class Fs {
    oncomplete?:  Completer
    notify(x: Float64Array) {
        if (this.oncomplete){
            for (let i=0; i<x.length; i+=2)
                this.oncomplete(x[i*2], x[i*2+1])
        }
    }
    abstract submit(x: Float64Array):void
    // future work? send the requests in shared memory is probably faster and easier for wasm
    // abstract submitv(start: number, end: number):void
}
export function pack(o: OpfsRq[], to: Float64Array) {
    for (let i = 0; i < o.length; i++) {
        to.slice(i * 8, i * 8 + 8).set([
            o[i].userdata,
            o[i].op,
            o[i].fh,
            o[i].at,
            o[i].begin,
            o[i].end, 0, 0, 0
        ])
    }
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
export function newReq(f: Float64Array) : Req[] {
    const r = new Array<Req>(f.length>>3)

    r.forEach((e,i)=> {
        r[i] =  new Req(f.slice(i*8,i*8+8))
    })
    return r
}