
import { createSignal } from "solid-js"

export const dbms = new SharedWorker(new URL("./worker", import.meta.url ))

dbms.port.start()

const reply = new Map<number, [(x: any)=>void,(x: any)=>void]>()
let nextTag = 42

export async function rpc(method: string, id: number, params: any) : Promise<any> {
    const tag = nextTag++
    return new Promise((resolve, reject) =>{
        reply.set(tag, [resolve,reject])
    })
}

dbms.port.onmessage = (e: MessageEvent) => { 
    console.log(e)
    const o = reply.get(e.data.id)
    if (o){
        if (e.data.error) {
            o[1](e.data.error)
        } else {
            o[0](e.data.result)
        }
    }
}

export interface Step {
    
}


// a document is a series of steps. we can treat an initial html document as a single insertion step.
// because this is a shared worker, we can't really lose steps?
export function subscribe(topic: string,update: (steps: Step[])=>void) {

}

export function publish(topic: string, steps: Step[] ) {

}