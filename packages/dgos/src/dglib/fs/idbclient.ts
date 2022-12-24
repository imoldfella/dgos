import { Store } from "./data"


// low high low high
type BlobRange = Uint32Array
// low high
type DiskPointer = Uint32Array

function onerror() {
  console.log("error!!")
}
// store 64K blobs, 
export class IdbStore implements Store {
  constructor(public db: IDBDatabase) {
  }
  readPage(d: Uint32Array, target: Uint32Array, then: (d: Uint32Array, status: number) => void): void {
    throw new Error('Method not implemented.')
  }
  writePage(d: Uint32Array, target: Uint32Array, then: (d: Uint32Array, status: number) => void): void {
    throw new Error('Method not implemented.')
  }
  log(): Promise<Log> {
    throw new Error('Method not implemented.')
  }

}

export async function openIdbStore(): Promise<Store> {
  const r = indexedDB.open("datagrove", 1)
  const rx = new Promise<Store>((resolve, reject) => {
    let db: IDBDatabase
    r.onerror = onerror
    r.onsuccess = (event) => {
      db = r.result;
      resolve(new IdbStore(db))
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


// typically we might want to read the header, then read just the range of columns that we need. only used on parquet format. For these the parquet file is stored in a sequence of 64K blobs.
export function partialReadPage() {
  const getBlobs = (x: BlobRange, target: Uint32Array) => {

  }

}
