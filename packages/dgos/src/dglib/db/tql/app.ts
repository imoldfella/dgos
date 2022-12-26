import { createDb, useDb } from '../data_schema'
import { albumSchema } from './album'

export const schemaSet = {
    'album.datagrove.com': albumSchema
}
const db = createDb(schemaSet) // in shared worker
const dbc = useDb(new URL("./worker", import.meta.url), schemaSet)