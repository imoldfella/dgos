export abstract class Fs {

    abstract remove(fh: number): Promise<void>
    abstract create(fh: number): Promise<number>
    abstract open(fh: number): Promise<number>
    abstract truncate(fh: number, len: number): Promise<void>
    abstract flush(fh: number): Promise<void>
    abstract close(fh: number): Promise<void>
    // abstract write(a: ArrayBuffer, opt?: { at: number }): number
    // abstract read(a: ArrayBuffer, opt?: { at: number }): number
    abstract getSize(fh: number): Promise<number>


    abstract read(fh: number, index: number[], page: Uint32Array[]): Promise<void>
    abstract write(fh: number, index: number[], page: Uint32Array[]): Promise<void>

    // is this special or just a write?
    //abstract log(index: number, page: Uint32Array): Promise<void>

    async writeJson(path: string): Promise<void> {
    }
    async readJson(): Promise<any> {
        return
    }
}

export enum Op {
    init,remove,create,open,truncate,flush,close,getSize,read,write,move
}
