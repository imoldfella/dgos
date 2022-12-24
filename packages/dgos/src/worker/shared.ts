export { }
import Comlink from 'comlink'
import { Config, Options, Shared } from './data';


// this is the shared worker for dggui

const obj: Shared = {
    double: (value: number) => value * 2,

    // return a config that can be used to build a store
    config: (opts: Options) => {
        let c = opts
        return {} as Config
    }
}

Comlink.expose(obj, self as any);


