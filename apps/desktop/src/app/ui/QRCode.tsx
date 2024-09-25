import {useEffect, useRef, useState} from "preact/hooks";
import {
    QRCodeRender,
    renderToCanvas
} from "qrcode-generator-es";

export interface Props {
    text: string
}

export default function QRCode({ text }: Props) {
    const qrCanvasRef = useRef<HTMLCanvasElement>(null);

    const [qrcode, setQRCode] = useState<QRCodeRender>(null);

    useEffect(() => {
        if (!qrcode) {
            const qrcode = new QRCodeRender({
                renderFn: renderToCanvas,
                text: text,
                el: qrCanvasRef.current!,
                size: 280,
            });

            qrcode.render();

            setQRCode(qrcode);
        } else {
            qrcode.resetData(text);
        }
    }, [text]);

    return (
        <canvas ref={qrCanvasRef}></canvas>
    );
}