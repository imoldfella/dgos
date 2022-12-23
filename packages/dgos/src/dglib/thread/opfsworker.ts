export { }
import { Mem } from './mem'
import { RingBuffer, ringEntry, ringRead } from './ring'



//In the origin private file system, a FileSystemHandle represents either the root directory of the origin’s space, or a descendant of the root directory.

export interface FileSystemSyncAccessHandle {
    truncate(len: number): Promise<void>
    flush(): Promise<void>
    close(): Promise<void>
    write(a: ArrayBuffer, opt: { at?: number }): number
    read(a: ArrayBuffer, opt: { at?: number }): number
    getSize(): Promise<number>
}

export function getAccess(f: FileSystemFileHandle) {
    return (f as any).createSyncAccessHandle() as FileSystemSyncAccessHandle
}

export async function useOpfs() {
    return await navigator.storage.getDirectory();
}
const encoder = new TextEncoder();
const writeBuffer = encoder.encode("Thank you for reading this.");

export async function readJson<T>(d: FileSystemDirectoryHandle, path: string): Promise<T | undefined> {
    const f = await d.getFileHandle(path)
    const f2 = await f.getFile()
    const tx = await f2.text()
    return tx ? JSON.parse(await f2.text()) : undefined
}
export async function writeJson(d: FileSystemDirectoryHandle, path: string, a: any) {
    const f = await d.getFileHandle(path, { create: true })
    const accessHandle = await (f as any).createSyncAccessHandle();
    const encoder = new TextEncoder();
    const writeBuffer = encoder.encode(JSON.stringify(a));
    const writeSize = accessHandle.write(writeBuffer, { "at": 0 });
}

// not available in safari, maybe not chrome either any more
export interface FileSystemAccessHandle {
    truncate(len: number): void
    flush(): void
    close(): void
    write(a: ArrayBuffer, opt: { at?: number }): Promise<number>
    read(a: ArrayBuffer, opt: { at?: number }): Promise<void>
    getSize(): Promise<number>
}


export async function useOpfsStore() {
    const root = await navigator.storage.getDirectory();
    return new OpfsStore(root)
}
export class OpfsStore {
    constructor(public root: FileSystemDirectoryHandle) {

    }  // 0 
    open(path: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
    file: FileSystemSyncAccessHandle[] = []
    logpos = 0

    async remove(path: string): Promise<void> {
        return this.root.removeEntry(path)
    }
    // amazingly there is no rename


    write(fh: number, data: Uint32Array, at: number) {
        throw new Error('Method not implemented.')
    }
    writeLog(target: Uint32Array, then: (d: Uint32Array, status: number) => void): void {
        const n = this.file[0].write(target, { at: this.logpos })
        this.file[0].flush()
        then(target, (n == 4 * target.length) ? 0 : -1)
    }
    // reading the tail could be problematic? we could force log records to not cross 64k boundaries
    // then we can read backwards one 64K page at a time
    readTail(): Promise<Uint32Array> {
        throw new Error('Method not implemented.')
    }

    async create(filename: string): Promise<void> {
        const fileHandle = await this.root.getFileHandle(filename, { create: true });
        const ah = (fileHandle as any).createSyncAccessHandle()
        return ah
    }

    async createHandle(path: string): Promise<FileSystemSyncAccessHandle> {
        const fs = this.root.getFileHandle(path)
        return (fs as any).createSyncAccessHandle() as FileSystemSyncAccessHandle
    }

    readPage(d: Uint32Array, target: Uint32Array, then: (d: Uint32Array, status: number) => void): void {
        throw new Error('Method not implemented.');
    }
    writePage(d: Uint32Array, target: Uint32Array, then: (d: Uint32Array, status: number) => void): void {
        throw new Error('Method not implemented.');
    }


    async writeLargePage(writeBuffer: Uint8Array) {
        const accessHandle = await this.createHandle("x");
        const writeSize = accessHandle.write(writeBuffer, { "at": 0 });
        await accessHandle.flush();
        await accessHandle.close();
    }
    async readLargePage() {
        const accessHandle = await this.createHandle("x")
        const fileSize = await accessHandle.getSize();
        // Read file content to a buffer.
        const readBuffer = new SharedArrayBuffer(fileSize);
        const readSize = accessHandle.read(readBuffer, { "at": 0 });

    }
}

function encodeString(s: string): Uint8Array {
    return new TextEncoder().encode(s)
}



export async function createOpfsStore(): Promise<OpfsStore> {
    return new OpfsStore(await navigator.storage.getDirectory())
}

async function lock(lockName: string, options: LockOptions) {
    self.navigator.locks.request(lockName, options, lock => {
        if (lock) {

        }
    });
}
function init(r: RingBuffer) {
    const e = ringEntry(r)
    while (true) {
        ringRead(r, e)
    }
}
onmessage = (e) => {
    switch (e.data.method) {
        case 'init':
            init(e.data.params)
    }
}