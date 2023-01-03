/* @refresh reload */
import { render } from 'solid-js/web'
import { Suspense } from 'solid-js'
import { Router } from '@solidjs/router'
import './index.css'
import { Editor } from './pm'
import { Grid } from './grid_solid'
// to make bookmarks work we will need to push the route up through the iframe



async function init() {

  render(() =>
  (<Grid handle={0}/>), document.getElementById('app') as HTMLElement)
}
init()


/*
  // maybe we should have floating divs everywhere, even the headings
  // the floatable area between headings is problem; maybe it could be invisible "over the gap". divs should be absolute?


    <Editor id='1' />

    <Editor id='2' />

*/