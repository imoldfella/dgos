import dotenv from 'dotenv'
import { createDbms } from '../../dglib/src/dbserver/nodejs'

dotenv.config()
    , createDbms()