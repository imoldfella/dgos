import { For, JSXElement, onMount } from "solid-js"
import { GridBase } from "./grid"
import { dbms } from "./worker_proxy"


// we should be able to have a mostly fixed pool of reusable divs
// we might need to expand the pool for aggressive zoom outs though.


// there's little point to doing this in solid, just mount it.
// this will make it easier to support react.


// a uri can be a query, although having a query type could give us better typing.

// a connection to the shared worker is generall [port, handle], but could have some comlink type proxying as well. zod?


// when we 


//  we need to describe the grid source
// the grid source will describe how it want's to be displayed

export function Grid(props: {handle: number}) {
    const s = new GridBase(props.handle)
    const div: HTMLDivElement[] = []

    let el: HTMLDivElement
    onMount(() => {
        s.mount(el)
    })

    return (<div ref={el!} class='h-full w-full'>

    </div>)
}