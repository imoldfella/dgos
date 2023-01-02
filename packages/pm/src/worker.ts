import {} from 'prosemirror-state'

interface SharedWorkerGlobalScope {
    onconnect: (event: MessageEvent) => void;
}
const _self: SharedWorkerGlobalScope = self as any;

interface Step {

}

class Pmdoc {
    steps : Step[] = []
    listeners = new Map<MessagePort,number>()
    // markdown? html? either?
    constructor(content: string) {
    }
    addListener(p: MessagePort,id: number) {
        this.listeners.set(p,id)
    }
    removeListener(p: MessagePort) {
        this.listeners.delete(p)
    }
    addSteps(st: Step[]) {
        this.steps = [this.steps,...st];
        for (let [k,v] of this.listeners) {
            k.postMessage({
                id: v,
                params:  st
            })
        }
    }
}

const doc = new Map<string, Pmdoc>()
doc.set('test', 
    new Pmdoc("<p>hello, world</p>")
)

interface Rpc<T> {
    port: MessagePort
    method: string, 
    id: number,
    params: T
}

const registry = new Map<string, (port: MessagePort, rpc: Rpc<any>)=>Promise<void>>()


registry.set('subscribe', async (port: MessagePort, rpc: Rpc<{
    id: string,
    step: number
}>)=>{
    const o = doc.get(rpc.params.id)
    if (o) {
        port.postMessage({
            id: rpc.id,
            result: o.steps
        })
        o.addListener(port, rpc.id)
    } else {
        doc.set(rpc.params.id, new Pmdoc(""))
    }
})
registry.set('close', async (port: MessagePort, rpc: Rpc<{
    id: string,
    step: number
}>)=>{
    const o = doc.get(rpc.params.id)
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
}>)=>{
    const o = doc.get(rpc.params.id)
    if (!o) {
        port.postMessage({
            id: rpc.id,
            error: `${rpc.params.id} does not exist`
        })
    }
    else {
      if( rpc.params.lsn==o.steps.length) {
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
console.log("dbms started")