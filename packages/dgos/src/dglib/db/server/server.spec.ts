import "fake-indexeddb/auto"
import { test, expect } from '@playwright/test'
import { createDbms } from "./server"
import { Compiler } from './compiler'

test('db', async () => {
    const dbms = await createDbms()
    const compiler = new Compiler(dbms)

    compiler.exec("create table(x,y)")

})