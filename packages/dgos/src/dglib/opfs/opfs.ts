

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

export async function readJson<T>(d: FileSystemDirectoryHandle, path: string):Promise<T|undefined> {
    const f = await d.getFileHandle(path)
    const f2 = await f.getFile()
    const tx = await f2.text()
    return tx?JSON.parse(await f2.text()):undefined
}
export async function writeJson(d: FileSystemDirectoryHandle, path: string, a: any) {
    const f = await d.getFileHandle(path, { create: true })
    const accessHandle = await (f as any).createSyncAccessHandle();
    const encoder = new TextEncoder();
    const writeBuffer = encoder.encode(JSON.stringify(a));
    const writeSize = accessHandle.write(writeBuffer, { "at": 0 });
}
