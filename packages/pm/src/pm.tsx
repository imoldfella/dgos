import { EditorState, Transaction } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, Node, DOMParser as PmParser } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup"
import { JSXElement, onMount } from "solid-js"
import { Step } from "prosemirror-transform"
import { history } from 'prosemirror-history'
import { subscribe, DgStep } from "./store"
import { collab, receiveTransaction, sendableSteps, getVersion } from "prosemirror-collab"

const htmlDoc = (new DOMParser()).parseFromString("", "text/html")

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks
})

// a provider perhaps? we need something async to go get the document, trigger suspense
// react query like?

let views = new Map<string, EditorView>()

function repeat<T>(x: T, length: number) {
    const r: T[] = []
    for (let i = 0; i != length; i++) {
        r.push(x)
    }
    return r
}
// apply the transaction directly to this view, but use sendablesteps and receivetransaction for the other view.
const fromShared = (tx: Transaction, id: string) => {
    // if we use a shared memory lock here, we can be sure to apply steps in order, but
    // it won't work because transaction won't be on the same state.
    // in practive though the updates will not be simultaneous
    // what about tabs where the user is different? these will be different databases?
    // no communication when offline? 

    // first update local, then get the sendable steps?
    const r = views.get(id)
    if (!r) {
        throw "no state"
        return
    }

    r.updateState(r.state.apply(tx))
    let snd = sendableSteps(r.state)
    if (!snd || !snd.steps) {
        console.log("no sendable", snd)
        return
    } else {
        const clientIds = repeat(snd.clientID, snd.steps.length)
        let o: Delta = {
            clientIds,
            version: snd.version,
            steps: snd.steps.map(e => e.toJSON())
        }
        let steps = JSON.stringify(o)
        let stepsr: Delta = JSON.parse(steps)
        let stepsx: Step[] = stepsr.steps.map((e) => Step.fromJSON(mySchema, e))
        for (let [k, o] of views) {
            console.log("stepsr", stepsr)
            const tx = receiveTransaction(o.state, stepsx, stepsr.clientIds, { mapSelectionBackward: true })
            console.log("Receive!", k, tx)
            o.updateState(o.state.apply(tx))
        }
    }
}

interface Delta {
    clientIds: (number | string)[],
    version: number,
    steps: any[]
}

// we need to create the view with a 
export function Editor(props: { id: string }) {
    let el: HTMLDivElement
    onMount(() => {
        let state = EditorState.create({
            doc: PmParser.fromSchema(mySchema).parse(htmlDoc),
            plugins: [
                ...exampleSetup({ schema: mySchema, history: false }),
                history(),
                collab({ version: 0, clientID: props.id })
            ],
        })

        // dispatch transaction will 
        let view = new EditorView(el!, {
            dispatchTransaction: (tx) => { fromShared(tx, props.id) },
            state: state
        })
        views.set(props.id, view)
    })
    return <div data-id={props.id} class="dark:prose-invert prose  max-w-none" ref={el!}></div>

}

interface Bundle {
    steps: Step[]
    clientIds: string[]
}

/*
// All state changes go through this
export function dispatch(view: EditorView, action: {
  type: string,
  doc?: Node
  version?: number,
  transaction: Transaction
}) {
  let state = EditorState.create({
    doc: action.doc,
    plugins: exampleSetup({ schema, history: false }).concat([
      history(),
      collab({ version: action.version }),
    ]),
  })

  view.updateState(state)
  let el: HTMLDivElement

  const fn = (transaction: Transaction) => {
    dispatch(view, {
      type: "transaction",
      transaction
    })

    let v = new EditorView(el!, {
      state: state,
      dispatchTransaction: fn,
    })
  }
}*/




