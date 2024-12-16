import {useEffect, useRef} from "preact/hooks";

export default function Modal() {
    const modal = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            // @ts-ignore
            $(modal.current).modal('show');
        }, 5000);
    }, []);

    return (
        <>
        </>
    )
}