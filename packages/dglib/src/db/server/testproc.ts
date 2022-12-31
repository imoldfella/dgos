import { z } from "zod"
import { DbmsSvr, Session } from "./dbms";
import { ObserveRange, RangeDelta } from "./data";



// 
const FormData = z.object({
    firstName: z.string().min(1).max(18),
    lastName: z.string().min(1).max(18),
    phone: z.string().min(10).max(14).optional(),
    email: z.string().email(),
    url: z.string().url().optional(),

});

async function commitForm(dbms: Session, method: string, id: number, x: z.infer<typeof FormData>) {
    FormData.parse(x)  // throws if error
    return {
        welcome: x.firstName
    }
}


// websockets has no backpressure mechanism; rate limit perhaps?
// install a function to set the parameters of this function and return a handle to it.
// add the subscription to the client connection so that we can clean up
// subscriptions are a type of range observer; all queries are ranges at the bottom.
async function subscribeQuery(s: Session, method: string, id: number, x: any) {
    const begin = new Uint8Array(0)
    const end = begin

    const r: ObserveRange = {
        begin: new Uint8Array(),
        end: new Uint8Array(),
        startPosition: 0,
        endPosition: 0,
        startVersion: 0,
        id: id,
        change: (delta: RangeDelta<any>) => {
            // we can rerun the query and compute the diff here, or simply pass to the client.
            s.port.postMessage({
                id: id,
                result: delta
            })
        }
    }
    // adding a log record to a cell is an update.
    s.observeRange(r)
    return true
}

export function install(d: DbmsSvr) {
    d.proc.set('commitForm', commitForm)
}