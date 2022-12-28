import { createDbms2 } from '../server'
import { Fs, Op } from "../weblike/data"


export async function  createDbms(opt?: any) {

    const pages = opt?.pages ?? 16 * 1024

    const mem = new WebAssembly.Memory({
        initial: pages, // 64K *64K = 4GB
        maximum: pages,
        shared: true
    })

    const fs = new Nodefs(mem.buffer)

    return createDbms2(fs, opt)

}


export class Nodefs extends Fs {
    submit(x: Float64Array): void {
        throw new Error('Method not implemented.')
    }
    atomicWrite(h: number, d: any): void {
        throw new Error("Method not implemented.")
    }
    atomicRead(h: number): Promise<any> {
        throw new Error("Method not implemented.")
    }
    getSize(h: number): Promise<number> {
        throw new Error("Method not implemented.")
    }
    getFiles(): Promise<number[]> {
        throw new Error("Method not implemented.")
    }
    trim(h: number, at: number): Promise<void> {
        throw new Error("Method not implemented.")
    }

    constructor(public b: ArrayBuffer) {
        super()
    }
}
