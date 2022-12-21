import { Icon } from "solid-heroicons";
import { Component, JSX, splitProps } from "solid-js"
// copied from solid heroicons, why can't I use that though? upstream export?


type Props = JSX.SvgSVGAttributes<SVGSVGElement> & { path: JSX.Element }
export const Icon2: Component<Props> = (props) => {
    const [internal, external] = splitProps(props, ["path"]);

    return (
        <Icon path={{
            mini: false,
            outline: false,
            path: internal.path
        }} />
    );
};