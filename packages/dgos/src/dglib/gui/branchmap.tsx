import { Icon } from "solid-heroicons";
import { ellipsisHorizontal, mapPin, chevronLeft, xMark } from "solid-heroicons/solid";
import { Component, createSignal, For, Signal } from "solid-js";
import { ListTile } from "./list";
import { Match, Switch } from "solid-js"
import { createWindowSize } from "@solid-primitives/resize-observer"
import { Splitter } from "./splitter";
import { Content, SandboxShow } from "./sandbox";
import { datagrove } from "../dg/dglogo";
import { deleteTab, insertTab } from "./dbproc";
import { useDb } from "./db";


// these should probably in next level up? listen to the div that we are placed in instead of window?
export const windowSize = createWindowSize();
export const mobile = () => {
    const r = windowSize.width < 650
    //console.log("windowWidth", windowSize.width)
    return r
}

// todo: count bubble
export const Avatar: Component<{ alt: string, src: string, count: number }> = (props) => <img title='a' class="flex-none rounded-md h-12 w-12 shadow m-2" src={props.src} />

enum BranchMapShow {
    mobileMenu,
    mobileContent,
    desktop,
    desktopPin,
}

// a lens provides a transaction builder?


// try a floating command bar always at the top.
export const BranchMap: Component<{}> = () => {
    const db = useDb()
    const left = createSignal(255)
    const [pin, setPin] = createSignal(false)
    const [menu, setMenu] = createSignal(false)

    // computing show takes 
    const show = () => {
        if (mobile())
            return menu() ? BranchMapShow.mobileMenu : BranchMapShow.mobileContent
        return pin() ? BranchMapShow.desktopPin : BranchMapShow.desktop
    }
    const togglePin = () => setPin(!pin())
    const ContextMenu = () => <Icon class='flex-none  h-5 w-5 m-2 text-blue-700 hover:text-blue-500' path={ellipsisHorizontal} />

    // limited to two levels; it's not clear how his could be extended to more than two levels
    const Vtabs: Component<{}> = (props) => {

        // <PinToggle signal={[pin, setPin]} />
        const BranchMapTitle: Component<{}> = (props) => {
            const PinToggle: Component<{ signal: Signal<boolean> }> = (props) => {
                return pin() ? <Icon path={chevronLeft} /> : <Icon path={mapPin} />
            }
            //return <Icon path={chevronLeft} />

            return <ListTile
                onclick={() => {
                    insertTab(db.db)
                }}
                class='h-16'
                title="Datagrove"
                leading={<Icon viewBox='0 0 492 492' path={datagrove} class='w-12 h-12 flex-none text-blue-700 hover:text-blue-500 m-2' />}
                trailing={<Icon path={pin() ? chevronLeft : mapPin} class='h-6 w-6 text-blue-700 hover:text-blue-500' onclick={togglePin} />}
            />
        }
        return <div class='bg-neutral-900 dark:text-white text-black h-full w-full overflow-y-scroll max-h-screen flex flex-col' >
            < BranchMapTitle />
            <div class='flex-1  overflow-y-auto'>
                <For each={db.tabs.getTab()}>{(e:any, i) => {
                    return <ListTile
                        onclick={() => db.tabs.select(e)}
                        class='h-16'
                        indent={0}
                        selected={e.selected}
                        title={<span>{e.name}</span>}
                        leading={<Avatar alt={e.name} src={e.avatar} count={e.count} />}
                        trailing={<Icon path={xMark} class='h-6 w-6 text-neutral-500 hover:text-blue-500' onclick={() => deleteTab(db.db,i())} />}
                    />
                }}</For>
            </div>
        </div >
    }


    return (
        <div class='h-full w-full'>
            < Switch >
                <Match when={show() == BranchMapShow.mobileMenu}>
                    <div class='fixed z-10 left-0 top-0 h-screen'><Vtabs /></div>
                    <div class='fixed z-50 left-16 right-0 h-screen'>
                        <Content show={SandboxShow.sitemap} />
                    </div>
                </Match>
                <Match when={show() == BranchMapShow.mobileContent}>
                    <Content show={SandboxShow.content} />
                </Match>
                <Match when={show() == BranchMapShow.desktopPin}>
                    <Splitter left={left} class=''>
                        <Vtabs />
                        <Content show={SandboxShow.both} />
                    </Splitter>
                </Match>
                <Match when={show() == BranchMapShow.desktop}>
                    <div class='fixed z-50 left-0 top-0 h-screen w-16 hover:w-64'>
                        <Vtabs />
                    </div>
                    <div class='fixed left-16 right-0 h-screen'>
                        <Content show={SandboxShow.both} />
                    </div>
                </Match>
            </Switch>
        </div >)
}
