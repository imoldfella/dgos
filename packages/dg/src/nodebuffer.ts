

export function concatenate(arrays: Buffer[]) : Buffer{
    let totalLength = 0;
    for (const arr of arrays) {
        totalLength += arr.length;
    }
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return Buffer.from(result)
  }
  
  
  // RawData is https://github.com/websockets/ws.git
  type RawData = Buffer | ArrayBuffer | Buffer[];
  export function combine(a: RawData) : Buffer{
    if (a instanceof Array ) {
      return concatenate(a)
    } else if (a instanceof Buffer){
      return a
    }
    else {
      return Buffer.from(a)
    }
  }