export { }
// this might make more sense in zig. Each page has one or more tuples. Each page leaf page may have 1 or more extension pages in a two level array. special support for monadic fields that are represented as value plus a log.

// interior page pointers are 14 bits of page + 16 bits of offset on that page.
// each leaf has pax values + varlen values

// history pages are insert only



export class BufferPool {
    constructor(public data: Uint32Array) { }

    get Subpages(): number[] {
        return []
    }

    // 1,2,4,8,16,32, varlen bytes per entry.
    types(page: number): Uint8Array {
        return new Uint8Array(this.data.buffer)
    }

    column<T>(page: number, index: number) {

    }
    setColumn<T>(page: number, index: number) {

    }

}

enum StepOp {

}
export interface TreeStep {
    step: StepOp,
    params: any  // fix this to descriminated union.
}

// here we deterministically modify a tree value (eg. prosemirror) with steps
// we take an attribute lock that depends on the predicted flag. the transaction may abort if submitter hasn't seen the latest prediction.
// there a multiple levels of predictions because of tabs. this is handled locally in the shared worker which then manages the host transaction.
const stepfn = []
export async function pmModify(txid: number, b: BufferPool, page: number, step: TreeStep[], predicted: boolean) {



}