

export interface SharedMemory {
    buffer: WebAssembly.Memory
    offset: number
    length: number
}