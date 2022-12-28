import { Component, JSX, splitProps } from "solid-js"

type ListTileProp = {
    indent?: number
    class?: string,
    selected?: boolean,
    active?: boolean,
    leading: JSX.Element,
    title: JSX.Element,
    trailing: JSX.Element
    onclick?: () => void
}

export const ListTile: Component<ListTileProp> = (props) => {
    const border = () => {
        if (props.selected) return 'border-blue-700'
        if (props.active) return 'border-blue-500'
        return 'border-neutral-900'
    }
    return <div onclick={props.onclick} class={`border-l-2 hover:border-blue-700 flex items-center ${border()} ${props.class}`}>
        <div class='flex-none'>{props.leading}</div>
        <div class='flex-1'>{props.title}</div>
        <div class='flex-none'>{props.trailing}</div></div>
}

