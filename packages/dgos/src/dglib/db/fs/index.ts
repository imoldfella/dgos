// define a simple file system that can be operated from another worker.


// only the log can be split, the buffer writer must be shared
// not clear there is enough value to justify the overhead of splitting the log

export * from './data'

import { Fs } from './data'
import { idbExists, useIdbFs } from './idbclient'
import { useOpfs } from './opfsclient'

// check if we already have indexeddb, use it if found
// check if opfs is available, if so use that
// use idb

export async function useFs(m: ArrayBuffer): Promise<Fs> {
    if (!await idbExists('dg')) {
        const o = await useOpfs(m)
        if (o) return o
    }
    return useIdbFs(m)
}


