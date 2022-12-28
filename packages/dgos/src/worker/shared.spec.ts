import { test, expect } from '@playwright/test'
import { createDbms } from '../../../dglib/src/db/server/server';

test('', async() => {
    const dbms = await createDbms();

    // the main thing we want to do is submit transactions and la
    const stmt = await dbms.prepare<any,any>('select')

    // each query acts as a listener as well? or 
    const q = await dbms.query<{},{}>(stmt, {} ) 
    q.addListener(()=>{})
    q.close()

    const tx = await dbms.begin()

    const h = stmt.exec(tx)

    await tx.commit()
    
    h.forEach((r)=>{
        console.log(r)
    })
    
})