
/* perhaps? not esm, not tsx.
const path = require('path');

require('ts-node').register();
require(path.resolve(__dirname, './worker.ts'));
*/

// compiled manually?


import { parentPort, workerData } from 'worker_threads';
let mem //: WebAssembly.Memory

parentPort?.once('message', (e) => {
    mem = e
})

// parentPort?.postMessage(
//     factorial(workerData.value)
// );