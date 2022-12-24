import { test, expect } from '@playwright/test';
import crypto from '@trust/webcrypto';
//import * as fs from 'fs'
import * as th from '.'
import { Mem, createMem } from '.';


test('ring', async ({ page }) => {
  const memv = createMem(1)
  const mem = new Mem(memv[0])

  // ring is a clonable thing you can send to other workers
  const ring = th.createRingBuffer(mem)
  const entry = th.ringEntry(ring)
  crypto.getRandomValues(entry)
  const entry2 = th.ringEntry(ring)

  th.ringWrite(ring, entry)
  th.ringRead(ring, entry2)

  const a = mem.allocTls(1)
  expect(entry).toEqual(entry2)
});
