import { Map0 } from "./map0"

// not used currently; a general structure for shared workers that operate with pub sub

// clients can use pagehide event to send close.
export abstract class SharedPubSub {
    port
    topic
 
    constructor(){
        this.port = new Map0<MessagePort, Set<string>>(()=>new Set<string>())
        this. topic = new Map0<string, Set<MessagePort>>(()=>new Set<MessagePort>())
    }
    subscribe(port: MessagePort, ...topic: string[]) {
        for (let t of topic){
            this.port.get(port).add(t)
            this.topic.get(t).add(port)
        }
    }   
    unsubscribe(port: MessagePort, ...topic: string[]){
        for (let t of topic){
            this.port.get(port).delete(t)
            this.topic.get(t).delete(port)
        }
    }
    disconnect(port: MessagePort){
        for (let t of this.port.get(port)) {
            this.topic.get(t).delete(port)
        }
        this.port.delete(port)
    }
    publish(value: any, ...topic: string[]){
        for (let t of topic) {
            for (let p of this.topic.get(t)){
                p.postMessage(value)
            }
        }
    }
    connect(port: MessagePort, ...subscribe: string[]) {
        // send messages like ['sub', topic], ['pub', 'topic', any], [close]
        port.start()
        for (let s of subscribe) {
            this.subscribe(port,s)
        }
        port.addEventListener('message',(m: MessageEvent)=>{
            const a = m.data
            const method = a[0]
            const args = a.slice(1)
            this.dispatch(port, method, args)
        })
    }
    dispatch(port: MessagePort, method: string, args: any[]){
        switch(method){
            case 'sub':
                this.subscribe(port,...args)
                break
            case 'unsub':
                this.unsubscribe(port, ...args)
                break
            case 'close':
                this.disconnect(port)
            case 'publish':
                this.publish(port, args[0],...args.slice(1))
                break;
            }
    }
}
/*
    dispatch(port: MessagePort, method: string, args: any[]){
        switch(method){
        case 'pub':
            break;
        default: 
            super.dispatch(port,method,args)
        }
    }
*/