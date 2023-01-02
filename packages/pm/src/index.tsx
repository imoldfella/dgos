/* @refresh reload */
import { render } from 'solid-js/web'
import { Suspense } from 'solid-js'
import { Router } from '@solidjs/router'
import './index.css'
import { Editor } from './pm'
// to make bookmarks work we will need to push the route up through the iframe

import { dbms } from './store'


async function init() {
  console.log(dbms)
  render(() =>
  (<div>
    <Editor/>
    </div>), document.getElementById('app') as HTMLElement)
}
init()
