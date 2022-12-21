import { Store } from './data'
import { useOpfsStore } from './opfs_store'

export * from './data'


export async function useFs(): Promise<Store> {
    return useOpfsStore()
}