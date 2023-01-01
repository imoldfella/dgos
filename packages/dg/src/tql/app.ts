import { createDb, useDb } from '../../../dglib/src/dbcompiler'
import { albumSchema } from './album'

export const schemaSet = {
    'album.datagrove.com': albumSchema
}
const db = createDb(schemaSet) // in shared worker
const dbc = useDb(new URL("./worker", import.meta.url), schemaSet)