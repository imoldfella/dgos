import dotenv from 'dotenv'
import { createDbms } from '../../dglib/src/db/webnot'

dotenv.config()
createDbms()