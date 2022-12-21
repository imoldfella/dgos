import { createSignal } from "solid-js";
import { makeResizeObserver } from "@solid-primitives/resize-observer";

// we mostly care about mobile layout, we can make that a memo.
const { observe, unobserve } = makeResizeObserver(handleObserverCallback, { box: "content-box" });
observe(document.body);
//observe(ref);


function handleObserverCallback(entries: ResizeObserverEntry[]) {
    for (const entry of entries) {
      console.log(entry.contentRect.width);
    }
  }


export const [isMobile,setIsMobile] = createSignal(false)