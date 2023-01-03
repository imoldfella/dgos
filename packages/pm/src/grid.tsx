import { dbms } from './worker_proxy'

export class GridBase<T = any> {
    el: HTMLDivElement[] = []
    port?: MessagePort

    constructor(public handle: number) {

    }
    open(x: number) {
        if (this.handle) {
            this.close()
        }
        this.handle = x
    }
    close(){
    }
    mount(parent: HTMLElement) {
        const d: HTMLDivElement = (<div class='hidden'></div>) as HTMLDivElement

        for (let i = 0; i < 1000; i++) {
            const e = d.cloneNode() as HTMLDivElement
            this.el.push(e)
            parent.appendChild(e)
        }
    }
}