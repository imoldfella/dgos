import { Identity } from "./crypto"
import bip39 from 'bip39'
import { pki, random } from "node-forge"
import * as secp from '@noble/secp256k1'
import { encode, decode } from 'cbor-x'
import z from 'zod'


export function cborHex(s: string): Identity {

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

export function createKey() {
    return bip39.generateMnemonic()
}

export function validateKey(s: string) {
    return bip39.validateMnemonic(s)
}