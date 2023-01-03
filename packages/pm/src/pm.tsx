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

const htmlDoc = (new DOMParser()).parseFromString("", "text/html")

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks
})

// a provider perhaps? we need something async to go get the document, trigger suspense
// react query like?

let views = new Set<EditorView>()

const fromShared = (tx: Transaction) => {
    // if we use a shared memory lock here, we can be sure to apply steps in order, but
    // it won't work because transaction won't be on the same state.
    // in practive though the updates will not be simultaneous
    // what about tabs where the user is different? these will be different databases?
    // no communication when offline? 
    for (let o of views) {
        let state = o.state.apply(tx)
        o.updateState(state)
    }
}

// we need to create the view with a 
export function Editor() {
    let el: HTMLDivElement
    onMount(() => {
        let state = EditorState.create({
            doc: PmParser.fromSchema(mySchema).parse(htmlDoc),
            plugins: [
                ...exampleSetup({ schema: mySchema, history: false }),
                history(),
            ],
        })

        // dispatch transaction will 
        let view = new EditorView(el!, {
            dispatchTransaction: fromShared,
            state: state
        })
        views.add(view)
    })
    return <div class="dark:prose-invert prose  max-w-none" ref={el!}></div>

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




