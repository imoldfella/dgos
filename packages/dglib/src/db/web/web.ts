

import { useFs } from './fs'

export async function  createDbms(opt?: any) {

    const pages = opt?.pages ?? 16 * 1024

    const mem = new WebAssembly.Memory({
        initial: pages, // 64K *64K = 4GB
        maximum: pages,
        shared: true
    })

    const fs = await useFs(mem.buffer)

    
}