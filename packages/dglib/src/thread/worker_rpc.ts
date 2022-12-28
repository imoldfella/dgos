

type PromisePair = { resolve: (x: any) => void, reject: (x: any) => void }

export interface Rpc {
    method?: string
    id?: number
    params?: any
    result?: any
    error?: any
}

type Sender = (e: Rpc) => void

type Method = (params: any) => Promise<any>

export class RpcClient {
    waiting = new Map<number, PromisePair>()
    method = new Map<string, Method>()
    resolve: any
    reject: any
    next = 42
    constructor(public sender: Sender) {
    }

    recv(r: Rpc) {
        if (r.method) {
            const fn = this.method.get(r.method)
            if (fn) {
                fn(r.params).then((v) => {
                    try {
                        this.sender({
                            id: r.id,
                            result: v
                        })
                    } catch (e) {
                        this.sender({
                            id: r.id,
                            error: e
                        })
                    }
                })
            }
        } else {
            const p = this.waiting.get(r.id ?? 0)
            if (!p) return
            if (r.result) {
                p.resolve(r.result)
            } else {
                p.reject(r.error)
            }
        }
    }
    addMethod(method: string, fn: (params: any) => Promise<any>) {
        this.method.set(method, fn)
    }

    async ask(method: string, params?: any): Promise<any> {
        this.sender({
            method: method,
            id: this.next,
            params: params
        })

        const r = new Promise((resolve, reject) => {
            this.waiting.set(this.next, {
                resolve,
                reject,
            })

        })
        this.next++
        return r
    }
}


export function worker(s: URL): RpcClient {
    const w = new Worker(s, { type: 'module' })
    const r = new RpcClient((e: Rpc) => {
        w.postMessage(e)
    })
    w.onmessage = (m) => {
        r.recv(m.data as Rpc)
    }
    return r
}

export function sharedWorker(s: URL): RpcClient {
    const w = new SharedWorker(s, { type: 'module' })
    const r = new RpcClient((e: Rpc) => {
        console.log('send', s, e)
        w.port.postMessage(e)
    })
    w.port.start()
    w.port.onmessage = (m) => {
        console.log('onmessage', m.data)
        r.recv(m.data as Rpc)
    }
    return r
}
