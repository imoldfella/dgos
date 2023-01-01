import { Fs } from '../weblike/data'
import { idbExists, useIdbFs } from './idbclient'
import { useOpfs } from './opfsclient'

export async function createDbms(opt?: any) {

    const pages = opt?.pages ?? 16 * 1024

    const mem = new WebAssembly.Memory({
        initial: pages, // 64K *64K = 4GB
        maximum: pages,
        shared: true
    })

    const fs = await useFs(mem.buffer)


}

export async function useFs(m: ArrayBuffer): Promise<Fs> {
    if (!await idbExists('dg')) {
        const o = await useOpfs(m)
        if (o) return o
    }
    return useIdbFs()
}

