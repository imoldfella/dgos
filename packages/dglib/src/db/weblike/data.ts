

// for opfs this will be rpc to a dedicated worker.
export abstract class Fs {
    abstract write(h: number, d: Uint8Array, at: number): Promise<void>
    abstract read(h: number, d: Uint8Array, at: number): Promise<void>

    abstract trim(h: number, at: number): Promise<void>
    abstract flush(h: number): Promise<void>

    abstract atomicWrite(h: number, d: string): Promise<void>
    abstract readFile(h: number): Promise<string>
    abstract getSize(h: number): Promise<number>

    // future work? send the requests in shared memory is probably faster and easier for wasm
    // abstract submitv(start: number, end: number):void
}
export async function readJson<T>(fs: Fs, h: number): Promise<T> {
    throw ""
}

export interface WorkerLike {
    on(message: string, fn: (e: any) => void): void
    postMessage(message: any): void
}

// server tracks this

// is cbor faster than structured cloning? hard to imagine.
// but can I pack arbitrary things?
export interface PortLike {
    postMessage(message: any): void 
}