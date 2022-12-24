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
    init, remove, create, open, truncate, flush, close, getSize, read, write, move
}
interface OpfsRq {
    userdata: number
    op: number
    fh: number
    at: number
    begin: number
    end: number
}
export interface Fs {
    submit(x: Float64Array, y: Float64Array): Promise<void>
    submitv(start: number, end: number, result: number): Promise<void>
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
