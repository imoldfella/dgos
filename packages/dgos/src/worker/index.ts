import { DgguiShared } from './data'
import { useDb } from '../dglib/db/client/client'

export async function useShared() {
    return useDb<DgguiShared>(new URL("./worker.js", import.meta.url))
}