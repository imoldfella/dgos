
import { createSignal } from "solid-js"

export const dbms = new SharedWorker(new URL("./worker", import.meta.url))

dbms.port.start()

const reply = new Map<number, [(x: any) => void, (x: any) => void, boolean]>()
let nextTag = 42

export async function ask(method: string, params: any): Promise<any> {
    const tag = nextTag++
    return new Promise((resolve, reject) => {
        reply.set(tag, [resolve, reject, true])
        dbms.port.postMessage({
            method: method, id: tag, params: params
        })
    })
}


dbms.port.onmessage = (e: MessageEvent) => {
    console.log(e)
    const o = reply.get(e.data.id)
    if (o) {
        if (e.data.error) {
            o[1](e.data.error)
        } else {
            o[0](e.data.result)
        }
        if (o[2]) reply.delete(e.data.id)
    }
}

export interface DgStep {

}



// a document is a series of steps. we can treat an initial html document as a single insertion step.
// because this is a shared worker, we can't really lose steps?


export function subscribe(topic: string, version: number, then: (steps: DgStep[]) => void): [number, string] {
    const tag = nextTag++
    reply.set(tag, [then, then, true])
    dbms.port.postMessage({
        method: 'subscribe',
        id: tag,
        params: {
            topic,
            version
        }
    })
    return [tag, topic]
}

export function close(h: [number, string]) {
    dbms.port.postMessage({
        method: 'close',
        id: h[0],
        params: h[1]
    })
}

export function tryPublish(topic: string, steps: DgStep[]) {
    return ask('publish', {
        topic: 'test',
        steps: steps
    })
}

export function rebasePublish(topic: string, steps: DgStep[]) {

}