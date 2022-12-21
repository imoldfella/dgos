

export type LogPos = number

type Listener = (d: Uint32Array[]) => void
export interface Log {
    write(data: Uint32Array): Promise<void>
    addListener(fn: Listener): Promise<void>
    getPos(): Promise<void>
}

