import { usePrefersDark } from "@solid-primitives/media";
import { createSignal, createContext, useContext, ParentComponent, createEffect } from "solid-js";

const MediaContext = createContext();

export const MediaProvider: ParentComponent<{}> = (props) => {
    const prefersDark = usePrefersDark();
    createEffect(() => {
        setDark(prefersDark())
    });
    const [count, setCount] = createSignal(),
        Media = [
            count,
            {
                setDark(x: boolean) {
                    setDark(x)
                },
            }
        ];

    return (
        <MediaContext.Provider value={Media}>
            {props.children}
        </MediaContext.Provider>
    );
}

export function useMedia() { return useContext(MediaContext); }

export function setDark(x: boolean) {
    if (x) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    } // => boolean
}




