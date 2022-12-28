import { Component, createSignal, ParentComponent } from "solid-js"


// could we make this a pinnable flyout, that takes a signal , maybe creates a signal?
// The branch
export function createFlyout() {
    const r = createSignal(false)
    return r
}

export const Header: ParentComponent<{}> = (props) => {
    return <div class='sticky'>{props.children}</div>
}
export const Container: ParentComponent<{}> = (props) => {
    return <div>{props.children}</div>
}
export const Content: ParentComponent<{}> = (props) => {
    return <div>{props.children}</div>
}
export const Flyout = {
    Container,
    Header,
    Content,
}