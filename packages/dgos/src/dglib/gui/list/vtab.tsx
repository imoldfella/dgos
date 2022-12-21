import { Icon } from "solid-heroicons"
import { chevronLeft, ellipsisHorizontal, mapPin } from "solid-heroicons/solid"
import { Component, createSignal, For, JSX, Match, ParentComponent, Show, Signal, splitProps, Switch } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { faker } from '@faker-js/faker'

// we could have every table be an array with optional primary key.
// we could insert at key,+/-
// we could count(key)
// we could 
// note that almost every row will have some "file" node as part of the key, so no key is a strange case.

// maybe these are useful?
const Option: ParentComponent<{ class?: string }> = (props) => {
    return <div class={props.class}>{props.children}</div>
}
const Options: ParentComponent<{ class?: string }> = (props) => {
    return <div class={props.class}>{props.children}</div>
}
const Sticky: ParentComponent<{ class?: string }> = (props) => {
    return <div class={'sticky ' + (props.class ?? "")}>{props.children}</div>
}


// a tree is a list with hidden expanders 

interface Tree {
    length(): number
    isLeaf(n: number): boolean

    // toggling returns the number of descendants added or removed.
    toggle(index: number): number
}

interface TransformWrapper<T> {
    offset: number
    value: T
}
// Tree state can include dragging? how does tanstack table manage that?
// dragging requires a voided target space 
// actions must set a new list of wrappers that give a transform and the item.
// we need the tree state to be able to tell the children and open state of each item in order to drag correctly.
// The list of items are in a database and the database can change.


class TreeState<T> {
    setter?: (_: TreeState<T>) => void
    active: number = 0
    selection: number[] = []
    constructor(public root: T) {

    }
}


export function updateTree(ts: TreeState<any>, delta: Partial<TreeState<any>>) {

}



