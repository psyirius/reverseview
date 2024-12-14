// @ts-nocheck
import { useRef } from "preact/hooks";
import {console} from "@/platform/adapters/air";

interface Props {
    src: string;

    sandboxRoot: string;
    documentRoot: string;
    allowCrossDomainXHR?: boolean; // typo

    visible?: boolean;

    [key: string]: any;
}

export default function SandboxFrame({ src, visible, ...rest }: Props) {
    const frame = useRef<HTMLIFrameElement>(null);

    const style = {
        // display: visible ? 'block' : 'none',
        // width: visible ? '100%' : '0',
        // height: visible ? '100%' : '0',
        width: '100%',
        height: '100%',
        border: 'none',
    };

    function onLoad() {
        console.trace("sandboxLoaded");

        const childWindow = frame.current!.contentWindow;

        // expose the parent sandbox bridge to the child
        childWindow.parentSandboxBridge = {
            sayHello: function(message) {
                console.trace(message);
            },
            trace: console.trace,
            callMeBack: function(callback) {
                console.trace('Calling back...');
                callback('Hello from child');
            }
        };

        // expose the child sandbox bridge to the parent
        const { childSandboxBridge } = childWindow;

        console.trace('UA: ' + window.htmlLoader.userAgent);

        childSandboxBridge.sayHello("Hello from parent");
    }

    return (
        <iframe
            ref={frame}
            src={src}
            style={style}
            {...rest}
            onLoad={onLoad}
        ></iframe>
    );
}