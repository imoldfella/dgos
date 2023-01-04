import { dbms } from './worker_proxy'

interface Column {
    width: number
    heading: string
}
interface Row {
    height: number
    heading: string
}
// we know the number of rows, but we don't necessarily know how tall each row is, and we don't allocate div's to all rows.
//  widths are predetermined
export class GridBase<T = any> {
    el: HTMLDivElement[] = []
    port?: MessagePort

    column: Column[] = []
    row: Row[] = []
    constructor(public handle: number, public topLeft: [number,number], zoom =1) {

    }
    open(x: number) {
        if (this.handle) {
            this.close()
        }
        this.handle = x
    }
    close(){
    }
    spray() {

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