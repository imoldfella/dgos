import { Mem } from '../../../thread/mem'
import { Op, Req } from './opfs'

// maybe should inline this worker, its short and it probably needs to load to see if it can work?
// not clear if navigator in the main util will offer the method to check.

const filetable = new Map<number, FileSystemSyncAccessHandle>()
let shared: ArrayBuffer
let root: FileSystemDirectoryHandle

onmessage = (e) => {
    async function init(m: ArrayBuffer) {
        shared = m
        root = await navigator.storage.getDirectory();
        const h = root.getFileHandle('0', { create: true }) as any
        postMessage(!!h.createSyncAccessHandle)
    }

    // note that each entry is already tagged with userdata
    init(e.data).then(() => {
        onmessage = (e) => {
            const rq = e.data as Float64Array
            const cm = new Float64Array(rq.length >> 2)
            exec(rq, cm)
            postMessage(cm)
        }
    })
}

// in chrome 108, these are not async; don't use .then, and plan to remove the await
// https://developer.chrome.com/blog/sync-methods-for-accesshandles/
export interface FileSystemSyncAccessHandle {
    truncate(len: number): Promise<void>
    flush(): Promise<void>
    close(): Promise<void>
    write(a: ArrayBuffer, opt: { at?: number }): number
    read(a: ArrayBuffer, opt: { at?: number }): number
    getSize(): Promise<number>
}

// it might be cheaper to pass the request in shared ram?
// possibly this passes a number representing an offset in ram
// or a Uint32(16) so we can represent a uring style request?
function getBuffer(r: Req) {
    return shared.slice(r.begin, r.end)
}

async function getAccess(n: number) {
    let a = filetable.get(n)
    if (!a) {
        // note that create here is "create if necessary"
        const h = await root.getFileHandle(`${n}`, { create: true })
        a = (h as any).createSyncAccessHandle() as FileSystemSyncAccessHandle
        filetable.set(n, a)
    }
    return a
}

function complete(r: Req, result: number) {
    postMessage([r.userdata, result])
}

async function exec(rv: Float64Array, cmv: Float64Array) {
    for (let i = 0; i < rv.length; i += 8) {
        const r = new Req(rv.slice(i * 8, i * 8 + 8))
        let v = 0
        try {
            let a: FileSystemSyncAccessHandle
            if (r.fh) a = await getAccess(r.fh)
            switch (r.op) {
                case Op.nuke:
                    // not clear that there is any security here!
                    // probably not. It seems likely that browsers will not erase the presence. It will be better to rebuild a base presense, but even then, its not clear that we can every trust a browser to be private about anything.
                    // note assumption that files are all open!!!! firefox does not support entries or values (yet?) 
                    for (let o in filetable.keys()) {
                        root.removeEntry(`${o}`)
                    }
                    filetable.clear()
                case Op.truncate:
                    await a!.truncate(r.at)
                    break
                case Op.flush:
                    await a!.flush()
                    break
                case Op.close:
                    await a!.close()
                    filetable.delete(r.fh)
                    break
                case Op.getSize:
                    v = await a!.getSize()
                    return
                case Op.read:
                    const buffer =
                        await a!.read(getBuffer(r), { at: r.at })
                    break
                case Op.write:
                    await a!.write(getBuffer(r), { at: r.at })
                    break
            }
        } catch (e) {
            v = -1
        }
        cmv[i * 2] = r.userdata
        cmv[i * 2 + 1] = 0
    }
}





/*
  async submit(rv: Float64Array) {
    const cmv = new Float64Array(rv.length >> 2)
    for (let i = 0; i < rv.length; i += 8) {
      const r = new Req(rv.slice(i * 8, i * 8 + 8))
      let v = 0
      try {
        // a file here is a range [ fh, 0] to [fh, Infinity]
        // store in 64k blocks, this is on the client to enforce
        // but we could maybe throw here?
        switch (r.op) {
          case Op.nuke:
            // not clear that there is any security here!
            // probably not. It seems unlikely that browsers will erase securely. It will be better to rebuild a base presense, but even then, its not clear that we can every trust a browser to be private about anything.
            idb.deleteDB('dg')
            break
          case Op.truncate:
            await this.db.delete('dg', IDBKeyRange.bound([r.fh, r.at], [r.fh, Infinity]))
            break
          case Op.flush:
          case Op.close:
            break
          case Op.getSize:
            return
          case Op.read:
            const v = await this.db.get('dg', [r.fh, r.at])
            this.getBuffer(r).set(v as Uint32Array)
            break
          case Op.write:
            await this.db.put('dg', [r.fh, r.at], this.getBuffer(r))
            break
        }
      } catch (e) {
        v = -1
      }
      cmv[i * 2] = r.userdata
      cmv[i * 2 + 1] = 0
    }
    super.notify(cmv)
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
*/