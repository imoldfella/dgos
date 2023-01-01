import yargs from "yargs"
import { createDeviceKey, createKey, identityFromBip39, loadCbor, storeCbor } from "../../dglib/src/crypto"

async function createIdentity() {
  const key = createKey()
  console.log("BIP39=", key)
  const id = await identityFromBip39(key)
  console.log("IDENTITY=", storeCbor(await createDeviceKey(id)))
  process.exit()
}
function createDevice(idstr: string) {
  const id = loadCbor(idstr)
  console.log("IDENTITY=", storeCbor(createDeviceKey(id)))
}


