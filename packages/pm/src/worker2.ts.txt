import { version } from './data'

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