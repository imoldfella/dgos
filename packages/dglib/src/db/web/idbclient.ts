import { Fs } from "../../weblike/data"
import idb from 'idb'

// https://stackoverflow.com/questions/17468963/check-if-indexeddb-database-exists
export const idbExists = async (dbName: string, version = 1) => {
  let newDb = false;
  await ((): Promise<void> => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, version);
      req.onupgradeneeded = () => {
        req.transaction!.abort();
        newDb = true;
        resolve();
      }
      req.onsuccess = () => {
        resolve();
      }
    });
  })();

  return newDb;
}

export class IdbFs extends Fs {
  async write(h: number, d: Uint8Array, at: number): Promise<void> {

  }
  async read(h: number, d: Uint8Array, at: number): Promise<void> {

  }
  async flush(h: number): Promise<void> {

  }
  async atomicWrite(h: number, d: any): Promise<void> {

  }
  async atomicRead(h: number): Promise<any> {

  }
  async getSize(h: number): Promise<number> {
    return 0
  }
  async trim(h: number, at: number): Promise<void> {
    this.db.delete('dg', IDBKeyRange.bound([h, 0], [h, 0]))
  }
  constructor(public db: idb.IDBPDatabase) {
    super()
  }
}

export async function useIdbFs(): Promise<IdbFs> {
  const db = await idb.openDB('dg', 1, {
    upgrade(db) {
      db.createObjectStore('dg');
    },
  });
  return new IdbFs(db)
}
