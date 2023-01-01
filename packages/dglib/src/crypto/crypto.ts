import { generateMnemonic, mnemonicToSeed } from 'bip39'
import * as secp from '@noble/secp256k1'
import { encode, decode } from 'cbor-x'
import z from 'zod'

export function getRandom(): number {
    const r = new BigUint64Array(1)
    window.crypto.getRandomValues(r)
    return Number(r[0])
}

export const Chainz = z.object({
    signer: z.instanceof(Uint8Array),
    signature: z.instanceof(Uint8Array),
    expires: z.string().optional(),
    nogrant: z.boolean().optional()
})
export type Chain = z.infer<typeof Chainz>

export const Identityz = z.object({
    public: z.instanceof(Uint8Array),
    private: z.instanceof(Uint8Array).optional(),
    chain: z.array(Chainz)
})
export type Identity = z.infer<typeof Identityz>

// a way to assign name, blue check, etc. We need audit log for these
export const Attested = z.object({
    attribute: z.any(),
    chain: z.array(Chainz)
})

// the server only cares about the root id, not the name, and not really the device key
// The device key will need to sign a random challenge, it can sign the DH key if that's available.


const toHex = (a: Uint8Array) => a.reduce((a, b) => a + b.toString(16).padStart(2, '0'), '')
const fromHex = (hexString: string) => {
    if (hexString.length) {
        return Uint8Array.from(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
    } else return new Uint8Array(0)
}

export function storeCbor(s: any): string {
    return toHex(encode(s))
}
export function loadCbor(s: string) {
    return decode(fromHex(s))
}

// prng.seedFileSync = () => seed.toString('hex')
// const { privateKey, publicKey } = pki.rsa.generateKeyPair({ bits: 4096, prng, workers: 2 })

export async function identityFromBip39(s: string): Promise<Identity> {
    const privKey = await secp.utils.sha256((new TextEncoder).encode(s)) //.toString('hex')
    const pubKey = secp.getPublicKey(privKey, true)
    const msgHash = await secp.utils.sha256(pubKey)
    const sig = await secp.sign(msgHash, privKey)
    const isValid = secp.verify(sig, msgHash, pubKey);
    if (!isValid) throw "bad key error"

    return {
        public: pubKey,
        private: privKey,
        chain: [{
            signer: pubKey,
            signature: sig,
        }]
    }
}

// 
export async function createDeviceKey(i: Identity) {
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
    return generateMnemonic()
}

