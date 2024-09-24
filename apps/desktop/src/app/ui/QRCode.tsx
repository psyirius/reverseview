import {useEffect, useRef} from "preact/hooks";

export interface Props {
    text: string
}

export default function QRCode({ text }: Props) {
    const qrRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // air.trace('QRCode', text);

        // prevent appending multiple QR codes
        qrRef.current!.innerHTML = '';

        // global: QRCode
        // @ts-ignore
        new window.QRCode(qrRef.current!, text);
    }, [text]);

    return (
        <div ref={qrRef}></div>
    );
}