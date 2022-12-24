import { Fs, Op, Req } from "./data"
import idb from 'idb'


// low high low high
type BlobRange = Uint32Array
// low high
type DiskPointer = Uint32Array

function onerror() {
  console.log("error!!")
}

export class IdbFs implements Fs {
  constructor(public db: IDBDatabase, public mem: ArrayBuffer) {
  }
  async submit(x: Float64Array, y: Float64Array): Promise<void> {
    for (let i = 0; i < x.length; i += 8) {
      const r = new Req(x.slice(i, i + 8))
      switch (r.op) {
        case Op.read:
          const key = [r.fh, r.at]
          const store = this.db.transaction("blob").objectStore("blob");
          const value = await store.get(key);

      }
    }
  }
  async submitv(start: number, end: number, result: number): Promise<void> {
    throw new Error("Method not implemented.")
  }

}

export async function useIdbFs(m: ArrayBuffer): Promise<IdbFs> {
  const r = indexedDB.open("datagrove", 1)
  const rx = new Promise<IdbFs>((resolve, reject) => {
    let db: IDBDatabase
    r.onerror = onerror
    r.onsuccess = (event) => {
      db = r.result;
      resolve(new IdbFs(db, m))
    }
    r.onupgradeneeded = (e) => {
      // need later?
      // if(db.objectStoreNames.contains("blob")) {
      //     db.deleteObjectStore("blob");
      // }
      db.createObjectStore("blob");
    }
  })
  return rx
}
