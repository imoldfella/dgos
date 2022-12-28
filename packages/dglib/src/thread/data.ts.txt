
// low high low high
export type BlobRange = Uint32Array
// low high
export type DiskPointer = Uint32Array

function onerror() {
    console.log("error!!")
}

// opfs is sync, but idb is not
export abstract class StoreFile {
    abstract truncate(len: number): Promise<void>
    abstract flush(): Promise<void>
    abstract close(): Promise<void>
    abstract write(a: ArrayBuffer, opt?: { at: number }): number
    abstract read(a: ArrayBuffer, opt?: { at: number }): number
    abstract getSize(): Promise<number>

    async writeJson(v: any) {
    }
    async readJson(): Promise<any> {
        return
    }
}


// store 64K blobs, 
export interface Store {

    remove(path: string): Promise<void>
    create(path: string): Promise<StoreFile>
    open(path: string): Promise<StoreFile>

    // readPage(d: DiskPointer, target: Uint32Array, then: (d: DiskPointer, status: number) => void): void
    // writePage(d: DiskPointer, target: Uint32Array, then: (d: DiskPointer, status: number) => void): void
    // writeLog(target: Uint32Array, then: (d: DiskPointer, status: number) => void): void
    //readTail(): Promise<Uint32Array>


}

