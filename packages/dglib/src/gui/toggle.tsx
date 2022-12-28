import { Component, JSX, Match, Signal, Switch } from "solid-js"

export const ToggleButton: Component<{ signal: Signal<boolean>, off: JSX.Element, on: JSX.Element }> = (props) => {
    const [getState, setState] = props.signal
    return <Switch>
        <Match when={!getState()}>
            {props.off}
        </Match>
        <Match when={true}>
            {props.on}
        </Match></Switch>
}