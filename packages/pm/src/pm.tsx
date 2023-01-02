import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser as PmParser } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup"
import { JSXElement, onMount } from "solid-js"
import { Step } from "prosemirror-transform"
import { collab, receiveTransaction, sendableSteps, getVersion } from "prosemirror-collab"
import { history } from 'prosemirror-history'
import { subscribe, DgStep } from "./store"

const doc = (new DOMParser()).parseFromString("", "text/html")

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
})

// a provider perhaps? we need something async to go get the document, trigger suspense
// react query like?
export async function start() {
  subscribe('test', 0, (s: DgStep[]) => {

  })
}
export function Editor() {
  let el: HTMLDivElement
  onMount(() => {


    let view = new EditorView(el!, {
      state: EditorState.create({
        doc: PmParser.fromSchema(mySchema).parse(doc),
        plugins: [
          ...exampleSetup({ schema: mySchema, history: false }),
          history(),
          collab({ version: 0 })
        ]
      }),
    })
  })
  return <div class="dark:prose-invert prose  max-w-none" ref={el!}></div>

}

