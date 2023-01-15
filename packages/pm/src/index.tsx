/* @refresh reload */
import { render } from 'solid-js/web'
import { Suspense, onMount } from 'solid-js'
import { Router } from '@solidjs/router'
import './index.css'
import './pm.css'
import { Editor } from './pm'
import { Grid } from './grid_solid'
import { faker } from '@faker-js/faker'
// to make bookmarks work we will need to push the route up through the iframe


const app = document.getElementById('app') as HTMLElement

async function editor() {
  render(() =>
  (<div>
    <Editor id='1' /><Editor id='2' /></div>), app)
}
async function init() {

  render(() =>
    (<Grid handle={0} />), app)
}

let addr: {
  [key: number]: string
}[] = []

for (let i = 0; i < 1000; i++) {
  addr.push({
    0: faker.name.firstName(),
    1: faker.name.lastName(),
    2: faker.address.streetAddress(),
    3: faker.address.city(),
    4: faker.address.state(),
    5: faker.address.zipCode(),
  })
}

interface RowStyle {
  size: number
}
type CellStyle = RowStyle;

let sheet = {
  nextCol: 9,
  row: addr,
  col: [0, 1, 2, 3, 4, 5, 6, 7, 8],
}
interface Rect {
  top: number, left: number, bottom: number, right: number
}
class Cell {
}
interface SheetSlice {

}
interface SpliceOp {
  start: number

  insert: number[]
}
// we need a stream of slice operations, what about move?
abstract class Source {
  abstract size(): [number, number] // x,y
  abstract slice(r: Rect): SheetSlice
}

class Sheet {
  anchor = [0, 0]
  constructor(public div: HTMLDivElement, public data: Source) {

  }
}

async function s2() {
  let el: HTMLDivElement
  onMount(() => {
    for (let i = 0; i < 1000; i++) {

    }
  })
  render(() =>
  (<div ref={el!}>

  </div>), app)
}

s2()


/*
  // maybe we should have floating divs everywhere, even the headings
  // the floatable area between headings is problem; maybe it could be invisible "over the gap". divs should be absolute?


 

*/