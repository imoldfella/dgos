
import Comlink from 'comlink'
import { Shared, Db, Options } from './data'

// return shared worker and also a
export async function useShared(opt: Options) {
    const worker = new SharedWorker(new URL("./worker.js", import.meta.url));
    const c = Comlink.wrap<Shared>(worker.port)
    return [c, new Db(await c.config(opt))]
}