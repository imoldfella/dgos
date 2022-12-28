
// I want a dgos provider, signal, or store that can update the vtablist and accept updates from it.

import { Component, createSignal } from "solid-js"


// this needs a hover flyout and a pin.
// we need to allow collapsing.
// this could probably have its own store, it's pretty independent.

// mobile will not call this 
// pin implies open
// unpin + open
// unpin + !open

// pin icon - https://tabler-icons.io/

// create a set of iframes, caching them.

// the content can be a custom app url, or could be some standard app that this program already knows how to read. each concierge site has a menu that picks.
// the content of Layout must all live in an iframe, unless it is the internal content (settings).
// what about a specialized splitter that allows one side to hide?
// sort building that here though.
// not really just the toc, this renders the markdown with a toc
// builds the toc from the html generated.

// myIframe.contentWindow.postMessage('hello', '*');

// create 100 empty iframes, display one.
// use injection to update empty ones when a new server is activated.
// solid guarantees this is only ever run once.
// if we forced an iframe for every server, then when we add a server it will rerun
// does it disrupt existing servers though?

// can we gogorbjs

// this is generating vtabs, how do we generate the corresponding iframe? make a flat list?

export enum SandboxShow {
    sitemap,
    content,
    both
}
// somehow we need to message into the 
export const Content: Component<{ show: SandboxShow }> = (props) => {
    return (<iframe sandbox='' title='a' class='w-full h-full overflow-hidden' srcdoc='<div style="background-color:  white">hello, world<div>'>
    </iframe>)
}


/*
// display needs to be full screen if the screen is small enough.
export enum ShowSitemap {
    adaptive,
    none,  // greater than 800 this is split
    full,
    split, // split is same as adaptive?
}
const [sitemap, setSitemap] = createSignal(ShowSitemap.adaptive)
// does it matter where the splitter is? we also need to derive that.
export const showSitemap = (): ShowSitemap => {
    if (mobile()) {
        return sitemap() == ShowSitemap.none ? ShowSitemap.none : ShowSitemap.full
    }
    if (sitemap() == ShowSitemap.adaptive) {
        return windowSize.width > 850 ? ShowSitemap.split : ShowSitemap.none
    }
    // we need to check if there's room for the  sitemap
    // also need to allow the sitemap to shrink if window isn't wide enough.
    return sitemap()
}
*/
