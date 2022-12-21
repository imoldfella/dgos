import { Store, StoreFile } from './data'
import { FileSystemSyncAccessHandle } from './opfs'

//In the origin private file system, a FileSystemHandle represents either the root directory of the origin’s space, or a descendant of the root directory.

// not available in safari, maybe not chrome either any more
interface FileSystemAccessHandle {
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
export class OpfsStore implements Store {
  constructor(public root: FileSystemDirectoryHandle) {

  }  // 0 
  open(path: string): Promise<StoreFile> {
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

  async create(filename: string): Promise<StoreFile> {
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


/*
  xRead(fileId, pData, iOffset) {
    return this.handleAsync(async () => {
      const fileEntry = this.#mapIdToFile.get(fileId);
      log(`xRead ${fileEntry.filename} ${pData.size} ${iOffset}`);

      let nBytesRead;
      if (fileEntry.accessHandle) {
        nBytesRead = fileEntry.accessHandle.read(pData.value, { at: iOffset });
      } else {
        // Not using an access handle is slower but allows multiple readers.
        const file = await fileEntry.fileHandle.getFile()
        const blob = file.slice(iOffset, iOffset + pData.value.byteLength);
        const buffer = await blob.arrayBuffer();
        pData.value.set(new Int8Array(buffer));
        nBytesRead = Math.min(pData.value.byteLength, blob.size);
      }

      if (nBytesRead < pData.size) {
        pData.value.fill(0, nBytesRead, pData.size);
        return VFS.SQLITE_IOERR_SHORT_READ;
      }
      return VFS.SQLITE_OK;
    });
  }

  xWrite(fileId, pData, iOffset) {
    const fileEntry = this.#mapIdToFile.get(fileId);
    log(`xWrite ${fileEntry.filename} ${pData.size} ${iOffset}`);

    const nBytes = fileEntry.accessHandle.write(pData.value, { at: iOffset });
    return nBytes === pData.size ? VFS.SQLITE_OK : VFS.SQLITE_IOERR;
  }

  xTruncate(fileId, iSize) {
    return this.handleAsync(async () => {
      const fileEntry = this.#mapIdToFile.get(fileId);
      log(`xTruncate ${fileEntry.filename} ${iSize}`);

      const accessHandle = await this.#getAccessHandle(fileEntry);
      await accessHandle.truncate(iSize);
      return VFS.SQLITE_OK;
    });
  }

  xSync(fileId, flags) {
    return this.handleAsync(async () => {
      const fileEntry = this.#mapIdToFile.get(fileId);
      log(`xSync ${fileEntry.filename} ${flags}`);

      await fileEntry.accessHandle?.flush();
      return VFS.SQLITE_OK;
    });
  }

  xFileSize(fileId, pSize64) {
    return this.handleAsync(async () => {
      const fileEntry = this.#mapIdToFile.get(fileId);
      log(`xFileSize ${fileEntry.filename}`);

      let size;
      if (fileEntry.accessHandle) {
        size = await fileEntry.accessHandle.getSize();
      } else {
        size = (await fileEntry.fileHandle.getFile()).size;
      }
      pSize64.set(size)
      return VFS.SQLITE_OK;
    });
  }

  xLock(fileId, flags) {
    return this.handleAsync(async () => {
      const fileEntry = this.#mapIdToFile.get(fileId);
      log(`xLock ${fileEntry.filename} ${flags}`);
      await fileEntry.locks.lock(flags);

      if (flags === VFS.SQLITE_LOCK_EXCLUSIVE) {
        await this.#getAccessHandle(fileEntry);
      }
      return VFS.SQLITE_OK;
    });
  }

  xUnlock(fileId, flags) {
    return this.handleAsync(async () => {
      const fileEntry = this.#mapIdToFile.get(fileId);
      log(`xUnlock ${fileEntry.filename} ${flags}`);

      if (flags !== VFS.SQLITE_LOCK_EXCLUSIVE) {
        await fileEntry.accessHandle?.close();
        fileEntry.accessHandle = null;
      }

      await fileEntry.locks.unlock(flags);
      return VFS.SQLITE_OK;
    });
  }

  xSectorSize(fileId) {
    log('xSectorSize', BLOCK_SIZE);
    return BLOCK_SIZE;
  }

  xDeviceCharacteristics(fileId) {
    log('xDeviceCharacteristics');
    return VFS.SQLITE_IOCAP_SAFE_APPEND |
      VFS.SQLITE_IOCAP_SEQUENTIAL |
      VFS.SQLITE_IOCAP_UNDELETABLE_WHEN_OPEN;
  }

  xAccess(name, flags, pResOut) {
    return this.handleAsync(async () => {
      log(`xAccess ${name} ${flags}`);
      try {
        const [directoryHandle, filename] = await this.#getPathComponents(name, false);
        await directoryHandle.getFileHandle(filename);
        pResOut.set(1);
      } catch (e) {
        pResOut.set(0);
      }
      return VFS.SQLITE_OK;
    });
  }

  xDelete(name, syncDir) {
    return this.handleAsync(async () => {
      log(`xDelete ${name} ${syncDir}`);
      const [directoryHandle, filename] = await this.#getPathComponents(name, false);
      if (syncDir) {
        await directoryHandle.removeEntry(filename);
      } else {
        directoryHandle.removeEntry(filename);
      }
      return VFS.SQLITE_OK;
    });
  }


  async #getPathComponents(nameOrURL, create) {
    const url = typeof nameOrURL === 'string' ?
      new URL(nameOrURL, 'file://localhost/') :
      nameOrURL;
    const [_, directories, filename] = url.pathname.match(/[/]?(.*)[/](.*)$/);

    let directoryHandle = DIRECTORY_CACHE.get(directories);
    if (!directoryHandle) {
      directoryHandle = this.#root ?? await this.#rootReady;
      for (const directory of directories.split('/')) {
        if (directory) {
          directoryHandle = await directoryHandle.getDirectoryHandle(directory, { create });
        }
      }
      DIRECTORY_CACHE.set(directories, directoryHandle);
    }
    return [directoryHandle, filename];
  }

  async #getAccessHandle(fileEntry) {
    if (!fileEntry.accessHandle) {
      fileEntry.accessHandle = await fileEntry.fileHandle.createSyncAccessHandle();
    }
    return fileEntry.accessHandle;
  }
}

*/