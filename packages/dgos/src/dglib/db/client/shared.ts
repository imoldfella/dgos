import { Rpc } from "../../thread/worker_rpc";
import { Client } from './dbw'

const client = new Map<MessagePort, Client>()

export interface SharedWorkerGlobalScope {
  onconnect: (event: MessageEvent) => void;
}
const _self: SharedWorkerGlobalScope = self as any;
_self.onconnect = function (e) {
  const port = e.ports[0];

  port.addEventListener('message', (e) => {
    let cl = client.get(port)
    if (!cl) {
      cl = new Client((r: Rpc) => { port.postMessage(r) })
      client.set(port, cl)
    }

    const r = e.data as Rpc
    cl.dispatch(r).then(a => {
      port.postMessage({
        id: r.id,
        result: a
      });
    })


  });
  port.start()
}

/*
_self.onconnect = function (e) {
  const port = e.ports[0];
  port.addEventListener('message', (e) => {
    const r = e.data as Rpc
    port.postMessage({
      id: r.id,
      result: r.method
    })
    return
    let cl = client.get(port)
    if (!cl) {
      cl = new Client(port)
      client.set(port, cl)
    }  

    dispatch(cl, r).then(e => {
      port.postMessage({
        id: r.id,
        result: e
      })
    }).catch(e => {
      port.postMessage({
        id: r.id,
        error: e
      })
    })

    if (r.method == 'stop') {
      client.delete(port)
    }
  })

  port.start();
}
*/
