
export class Bitset {
    u = new Uint32Array(1024);
    set(index: number, value: boolean) {
        const w = index >> 5
        const b = index & 31
        if (value) {
            this.u[w] |= 1 << b
        } else {
            this.u[w] &= (0xFFFFFFFF - (1 << b))
        }
    }
    get(index: number): boolean {
        const w = index >> 5
        const b = index & 31
        return (this.u[w] & (1 << b)) != 0
    }

    pickRandom(out: number[]) {

    }
}
