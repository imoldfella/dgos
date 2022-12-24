import { test, expect } from '@playwright/test'
import { createDbms } from '../dglib/db/server';

test('', async() => {
    const dbms = await createDbms();

    // the main thing we want to do is submit transactions and la
    const stmt = dbms.prepare('select')

    // each query acts as a listener as well? or 
    const q = await dbms.query<{}>(stmt, {} ) 
    q.addListener(()=>{})
    q.close()

    const tx = dbms.begin()

    const h = stmt.exec(tx)

    await tx.commit()
    
    h.forEach((r)=>{
        console.log(r)
    })
    
})