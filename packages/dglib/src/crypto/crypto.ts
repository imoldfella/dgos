export function getRandom(): number {
    const r = new BigUint64Array(1)
    window.crypto.getRandomValues(r)
    return Number(r[0])
}
