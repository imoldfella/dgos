/* @refresh reload */
import { render } from 'solid-js/web'
import { Suspense } from 'solid-js'
import { Router } from '@solidjs/router'
import './index.css'
import './pm.css'
import { Editor } from './pm'
import { Grid } from './grid_solid'
// to make bookmarks work we will need to push the route up through the iframe


const app = document.getElementById('app') as HTMLElement

async function editor() {
  render(() =>
  (<div>
    <Editor id='1' /><Editor id='2' /></div>),app)
}
async function init() {

  render(() =>
  (<Grid handle={0}/>), app)
}
editor()


/*
  // maybe we should have floating divs everywhere, even the headings
  // the floatable area between headings is problem; maybe it could be invisible "over the gap". divs should be absolute?


 

*/