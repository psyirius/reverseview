import {useEffect, useRef} from "preact/hooks";
import {console} from "@/platform/adapters/air";
import * as gfx from "dojox/gfx";
import * as socket from 'dojox/socket';

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
const imageFrames = [];

for (let i = 0; i < 150; i++) {
    imageFrames.push(
        [`framez-${numToStringPad(i, 3)}`, `/gfx/Timeline 1_0010${numToStringPad(8000 + i, 4)}.png`]
    );
}

console.trace(imageFrames[0]);

export default function RenderCanvas() {
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

//         const ctx = canvas.getContext("2d");
//         const imageData = ctx.createImageData(100, 100);
//
// // Iterate through every pixel
//         for (let i = 0; i < imageData.data.length; i += 4) {
//             // Modify pixel data
//             imageData.data[i + 0] = 190; // R value
//             imageData.data[i + 1] = 0;   // G value
//             imageData.data[i + 2] = 210; // B value
//             imageData.data[i + 3] = 255 / 2; // A value
//         }
//
//         ctx.putImageData(imageData, 0, 0);

        const timer = setInterval(() => {
            renderFrame();
            frameCount++;
        }, 0);

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

        const [frameId] = imageFrames[currentFrame++ % imageFrames.length];
        const image = document.getElementById(frameId) as HTMLImageElement;
        // console.trace(image);
        ctx.drawImage(image, 0, 0);

        // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // const data = imageData.data;
        // for (let i = 0; i < data.length; i += 4) {
        //     // hue shift the color by one degree
        //     let r = data[i];
        //     let g = data[i + 1];
        //     let b = data[i + 2];
        //
        //     const [h, s, l] = rgbToHsl(r, g, b);
        //     const [r2, g2, b2] = hslToRgb(h + 1 / 360, s, l);
        //
        //     data[i] = r2;
        //     data[i + 1] = g2;
        //     data[i + 2] = b2;
        // }
        // ctx.putImageData(imageData, 0, 0);
    }

    return (
        <>
            {/* <div id="surfaceElement"></div> */}
            <canvas
                ref={canvasRef}
                style={style}
            ></canvas>
            <button onClick={renderFrame}>CHO</button>

            <div style="display:none">
                {imageFrames.map(([id, src]) => (
                    <img id={id} src={src} width={W} height={H} alt=""/>
                ))}
            </div>
        </>
    );
}