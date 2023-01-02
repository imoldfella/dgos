import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser as PmParser} from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { exampleSetup } from "prosemirror-example-setup"
import { JSXElement, onMount } from "solid-js"

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
})

export function Editor() {
  let el : HTMLDivElement
  onMount(() => {
    const doc = (new DOMParser()).parseFromString("<p>I'm an editor</p>", "text/html")

    let view = new EditorView(el!, {
      state: EditorState.create({
        doc: PmParser.fromSchema(mySchema).parse(doc),
        plugins: exampleSetup({ schema: mySchema })
      })
    })
  })
  return <div class="dark:prose-invert prose  max-w-none" ref={el!}></div>

}

