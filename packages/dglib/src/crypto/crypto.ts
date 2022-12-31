import bip39 from 'bip39'
import { pki, random } from "node-forge"
import * as secp from '@noble/secp256k1'
import { encode, decode } from 'cbor-x'
import z from 'zod'



export function getRandom(): number {
    const r = new BigUint64Array(1)
    window.crypto.getRandomValues(r)
    return Number(r[0])
}

export const Identityz = z.object({
    public: z.instanceof(Uint8Array),
    private: z.instanceof(Uint8Array).optional(),
    signer: z.instanceof(Uint8Array),
    signature: z.instanceof(Uint8Array)
})
export type Identity = z.infer<typeof Identityz>


const toHex = (a: Uint8Array) => a.reduce((a, b) => a + b.toString(16).padStart(2, '0'), '')
const fromHex = (hexString: string) =>
    Uint8Array.from(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

export function storeCbor(s: any): string {
    return toHex(encode(s))
}
export function loadCbor(s: string) {
    return decode(fromHex(s))
}

// prng.seedFileSync = () => seed.toString('hex')
// const { privateKey, publicKey } = pki.rsa.generateKeyPair({ bits: 4096, prng, workers: 2 })

export async function identityFromBip39(s: string): Promise<Identity> {
    const privKey = (await bip39.mnemonicToSeed(s)) //.toString('hex')
    const pubKey = secp.getPublicKey(privKey, true)
    const prng = random.createInstance()

    const msgHash = await secp.utils.sha256(pubKey)
    const sig = await secp.sign(msgHash, privKey)
    const isValid = secp.verify(sig, msgHash, pubKey);
    if (!isValid) throw "bad key error"

    return {
        public: pubKey,
        private: privKey,
        signer: pubKey,
        signature: sig,
    }

}

export async function deviceKey(i: Identity) {
    const privKey = secp.utils.randomPrivateKey()
    const pubKey = secp.getPublicKey(privKey, true)
    const msgHash = await secp.utils.sha256(pubKey)
    const sig = await secp.sign(msgHash, i.private!)

    return {
        public: pubKey,
        private: privKey,
        signer: pubKey,
        signature: sig,
    }
}

export function createKey() {
    return bip39.generateMnemonic()
}

export function validateKey(s: string) {
    return bip39.validateMnemonic(s)
}