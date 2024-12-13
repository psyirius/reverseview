import {useEffect, useRef} from "preact/hooks";
import {console} from "@/platform/adapters/air";

const padStart = function padStart(self: string, targetLength: number, padString: string) {
    let current = self;

    while (current.length < targetLength) {
        current = padString + current;
    }

    return current;
}

function numToStringPad(num: number, pad: number) {
    return padStart(num.toString(), pad, '0');
}

const [W, H] = [1920, 1080];
let frameCount = 0;

let currentFrame = 0;

type Props = {
    url: string;
}

function fetchFrame(url: string, callback: (data: string, err: any) => void) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === xhr.DONE) {
            // console.trace("Status: " + xhr.status);
            if (xhr.status === 200) {
                callback(xhr.responseText, null);
            } else {
                callback(null, new Error('Failed to fetch frame'));
            }
        }
    }
    xhr.open('GET', url, true);
    xhr.send(null);
}

export default function RemoteCanvas({ url }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const style = {
        // display: visible ? 'block' : 'none',
        // width: visible ? '100%' : '0',
        // height: visible ? '100%' : '0',
        width: '100%',
        height: '100%',
        border: 'none',
    };

    useEffect(() => {
        const canvas = canvasRef.current!;

        canvas.width = W;
        canvas.height = H;

        // const ctx = canvas.getContext("2d", { alpha: false });

        const ctx = canvas.getContext("2d");

        // const imageData = ctx.createImageData(100, 100);
        //
        // // Iterate through every pixel
        // for (let i = 0; i < imageData.data.length; i += 4) {
        //     // Modify pixel data
        //     imageData.data[i + 0] = 190; // R value
        //     imageData.data[i + 1] = 0;   // G value
        //     imageData.data[i + 2] = 210; // B value
        //     imageData.data[i + 3] = 255 / 2; // A value
        // }
        //
        // ctx.putImageData(imageData, 0, 0);

        const timer = setInterval(() => {
            // console.trace("fetching frame");

            fetchFrame(url, (data, err) => {
                /// data: image data in base64
                // decode base64 to list of bytes

                if (err) {
                    console.trace(err);
                    return;
                }

                try {
                    const [[width, height], frame] = JSON.parse(data);

                    // console.trace(frame.length);

                    const imageData = ctx.createImageData(width, height);

                    // Iterate through every pixel
                    for (let i = 0; i < frame.length; i += 4) {
                        // Modify pixel data
                        imageData.data[i + 0] = frame[i + 0]; // R value
                        imageData.data[i + 1] = frame[i + 1]; // G value
                        imageData.data[i + 2] = frame[i + 2]; // B value
                        imageData.data[i + 3] = frame[i + 3]; // A value
                    }

                    console.trace('drawing frame');

                    ctx.putImageData(imageData, 0, 0);
                } catch (e) {
                    console.trace(e);
                }
            });

            // renderFrame();
            // frameCount++;
        }, 100);

        // setInterval(() => {
        //     console.trace(frameCount * 4);
        //     frameCount = 0;
        // }, 1000 / 4);

        return () => clearInterval(timer);
    }, []);

    function rgbToHsl(r: number, g: number, b: number) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, l];
    }

    function hslToRgb(h: number, s: number, l: number) {
        let r = 0;
        let g = 0;
        let b = 0;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = function hue2rgb(p: number, q: number, t: number) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [r * 255, g * 255, b * 255];
    }

    function renderFrame() {
        const canvas = canvasRef.current!;

        const ctx = canvas.getContext("2d");

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            // hue shift the color by one degree
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            const [h, s, l] = rgbToHsl(r, g, b);
            const [r2, g2, b2] = hslToRgb(h + 1 / 360, s, l);

            data[i] = r2;
            data[i + 1] = g2;
            data[i + 2] = b2;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    return (
        <>
            {/* <div id="surfaceElement"></div> */}
            <canvas
                ref={canvasRef}
                style={style}
            ></canvas>
            <button onClick={renderFrame}>CHO</button>
        </>
    );
}