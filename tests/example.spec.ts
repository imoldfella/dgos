import { test, expect } from '@playwright/test';


import * as th from '../packages/dgos/src/dglib/thread'


test('ring', async ({ page }) => {
  const mem = new th.Mem()
  // ring is a clonable thing you can send to other workers
  const ring = th.createRingBuffer(mem)
  const entry = th.ringEntry(ring)
  global.crypto.getRandomValues(entry)
  const entry2 = th.ringEntry(ring)

  th.ringWrite(ring, entry)
  th.ringRead(ring, entry2)

  const a = mem.allocLines(1)
    expect(entry).toEqual(entry2)
});
