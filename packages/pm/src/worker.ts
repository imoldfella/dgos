import { version, Rect } from './data'

// lives in shared worker? we need at least a proxy in the client?
// the database will need some concept of what is active, and ui's generally think of things as n-dimensional vectors


// most objects can be shared, so their data model is instantiated in the SharedWorker and accessed by proxy in the ui threads.

// getting data is mostly async, so support suspense? client can't know how long things take, although for the most part won't wait? signals are the most basic form of subscription, but we can build on that? would the explicit load status be a better fit? then we can have partial displays.
// we have lazy for dynamic import("") for lightly used components.




type GridListener<T> = (cell: {x: number,y:number,key: string,value: T}[]) => void
// tracks the range that is being viewed.
class GridView<T> {
    constructor(public rect: Rect, public gs: GridSource<T>){
    }
   
    splice(dim: number, start: number, deleteCount=1, ...item: number[]){
        
    }
}
export class GridSource<T> {
    view = new Set<GridView<T>>()

    splice(dim: number, start: number, deleteCount=1, ...item: number[]){

    }
    hide(dim: number, start: number, end: number) {
    }
    addListener(v: GridView<T> ) {

    }

    // notifier gridviews if their relevent cells have been changed.
    invalidate(g: Rect) {

    }
}



interface Step {

}

class Pmcell {
    steps: Step[] = []
    listeners = new Map<MessagePort, number>()
    // markdown? html? either?
    constructor(content: string) {
    }
    addListener(p: MessagePort, id: number) {
        this.listeners.set(p, id)
    }
    removeListener(p: MessagePort) {
        this.listeners.delete(p)
    }
    addSteps(st: Step[]) {
        this.steps = [this.steps, ...st];
        for (let [k, v] of this.listeners) {
            k.postMessage({
                id: v,
                result: st
            })
        }
    }
}

const doc = new Map<string, Pmcell>()
doc.set('test',
    new Pmcell("<p>hello, world</p>")
)

interface Rpc<T> {
    port: MessagePort
    method: string,
    id: number,
    params: T
}

const registry = new Map<string, (port: MessagePort, rpc: Rpc<any>) => Promise<void>>()


registry.set('subscribe', async (port: MessagePort, rpc: Rpc<{
    topic: string,
    version: number
}>) => {
    let o = doc.get(rpc.params.topic)
    if (!o) {
        o = new Pmcell("")
        doc.set(rpc.params.topic, o)
    }
    if (o.steps.length < rpc.params.version) {
        port.postMessage({
            id: rpc.id,
            error: `${rpc.params.topic} is only ${o.steps.length} long`
        })
        return
    }
    port.postMessage({
        id: rpc.id,
        result: o.steps.slice(rpc.params.version)
    })
    o.addListener(port, rpc.id)

})
registry.set('close', async (port: MessagePort, rpc: Rpc<string>) => {
    const o = doc.get(rpc.params)
    if (o) {
        o.removeListener(port)
    }
})

// publish will throw if the document doesn't exist 
// it will return length if successful or -length if some steps were missing.
registry.set('publish', async (port: MessagePort, rpc: Rpc<{
    id: string,
    lsn: number,
    steps: Step[]
}>) => {
    const o = doc.get(rpc.params.id)
    if (!o) {
        port.postMessage({
            id: rpc.id,
            error: `${rpc.params.id} does not exist`
        })
    }
    else {
        if (rpc.params.lsn == o.steps.length) {
            o.addSteps(rpc.params.steps)
            port.postMessage({
                id: rpc.id,
                result: o.steps.length
            })
        } else {
            port.postMessage({
                id: rpc.id,
                result: -o.steps.length
            })
        }
    }
})

interface SharedWorkerGlobalScope {
    onconnect: (event: MessageEvent) => void;
}
const _self: SharedWorkerGlobalScope = self as any;

_self.onconnect = (e) => {
    const port = e.ports[0];

    port.addEventListener('message', (e) => {
        const workerResult = `Result: ${e.data[0] + e.data[1]}`;
        port.postMessage(workerResult);
        console.log(e.data, workerResult)

        const rpc = registry.get(e.data.method)
        if (rpc) {
            rpc(port, e.data)
        }
    });

    port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
}
