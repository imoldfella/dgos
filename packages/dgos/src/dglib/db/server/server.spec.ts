import "fake-indexeddb/auto"
import { test, expect } from '@playwright/test'
import { createDbms } from "./server"
import { Compiler } from './compiler'

// a database is assocated with an orign
// if the data is not found locally, then we retrieve it from the origin.
// modifying the schema requires a compiler.

test('db', async () => {
    const dbms = await createDbms()

})

test('compiler', async () => {
    const dbms = await createDbms()
    const compiler = new Compiler(dbms)

    compiler.exec("create table(x,y)")

})