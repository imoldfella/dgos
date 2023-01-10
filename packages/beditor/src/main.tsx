import { JSXElement, onMount } from 'solid-js'
import { render } from 'solid-js/web'
import { Icon } from 'solid-heroicons'
import { xMark , check} from 'solid-heroicons/solid'
import './index.css'

import { Editor } from './editor'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'

// when we paste we should try to understand if its markdown or html we are pasting

// convert markdown to html
export async function md2html(md: string): Promise<string> {
    const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .use(rehypeSlug)
        .process(md ?? "error")
    return String(file)
}

const ed = new Editor
let original = ""


const save = ()=>{
  top?.postMessage(ed.text)
}
const cancel = ()=>{
  top?.postMessage(original)
}
onmessage = (e) => {
  original = e.data
  md2html(e.data).then(e =>{
    ed.text = e
  })
}

function Button(props: {
  onClick:  ()=>void,
  class: string,
  children: JSXElement
}) {
  return <button class={`${props.class} inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}>{props.children}</button>
}

// get the text from the app using the iframe, then post it back.
function EditorApp() {
  // we can try to recreate the editor as raw typescript to make it easier to wrap in various frameworks. 

  let el : HTMLDivElement
  onMount(()=>{
    ed.mount(el)
    ed.text = ""
  })
  return <div class='w-screen h-screen'>
    <div class='h-8 bg-neutral-800 p-1 flex '>
      <Button onClick={ save } class='mx-1 bg-indigo-600 hover:bg-indigo-700'>Save<Icon class='ml-1 h-4 w-4' path={check}/></Button>
      <p class='flex-1 text-center'>Untitled</p>
      <Button onClick={ cancel } class='mx-1 bg-red-600 hover:bg-red-700'>Cancel<Icon class='ml-1 h-4 w-4' path={xMark}/></Button>
      </div>
    <div class='h-full w-full prose dark:prose-invert' ref={el!}/>
    </div>
}


render(() => <EditorApp />, document.getElementById('app')!)


