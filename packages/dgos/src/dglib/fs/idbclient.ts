import { Fs, Op, Req } from "./data"
import idb from 'idb'


// low high low high
type BlobRange = Uint32Array
// low high
type DiskPointer = Uint32Array

export class IdbFs extends Fs {
  constructor(public db: idb.IDBPDatabase, public mem: Uint32Array) {
    super()
  }
  getBuffer(r: Req) {
    return this.mem.slice(r.begin, r.end)
  }

    async  submit(rv: Float64Array) {
      const cmv = new Float64Array(rv.length>>2)
      for (let i=0; i<rv.length; i+=8) {
        const r =  new Req(rv.slice(i*8,i*8+8))
          let v = 0
          try{
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
                      await this.db.delete('dg',  IDBKeyRange.bound([r.fh, 0],[r.fh,r.at]))
                      break
                  case Op.flush:
                  case Op.close:
                      break
                  case Op.getSize:
                      return
                  case Op.read:
                      const v = await this.db.get('dg',[r.fh,r.at])
                      this.getBuffer(r).set(v as Uint32Array)
                      break
                  case Op.write:
                      await this.db.put('dg',[r.fh,r.at], this.getBuffer(r))
                      break
              }
          } catch(e){
            v=-1
          }
          cmv[i*2]=r.userdata
          cmv[i*2+1] = 0
      }
      super.notify(cmv)
  }
}

export async function useIdbFs(m: ArrayBuffer): Promise<IdbFs> {
  const db = await idb.openDB('dg', 1, {
    upgrade(db) {
      db.createObjectStore('dg');
    },
  });
  return new IdbFs(db,new Uint32Array(m))
}
