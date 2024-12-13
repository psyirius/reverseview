import {Window, Canvas} from 'skia-canvas'

const RES = [
    [0, 0],
    []
]

const [W, H] = [1920, 1080];

{
    let canvas = new Canvas(W, H);

    let frame = 0;
    setInterval(() => {
        console.log("draw", frame);
        draw(canvas, frame);
        frame += 1;
    }, 10);
}

function draw(canvas: Canvas, frame: number) {
    const ctx = canvas.getContext("2d")

    const {width, height} = canvas;

    ctx.lineWidth = 25 + 25 * Math.cos(frame / 10)
    ctx.beginPath()
    ctx.arc(150, 150, 50, 0, 2 * Math.PI)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(150, 150, 10, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()

    // get the image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // save the image data
    RES[0] = [width, height];
    RES[1] = Array.from(data);
}

// let win = new Window(W, H)
// win.title = "Canvas Window"
// win.on("draw", (e: any) => {
//     const { canvas } = e.target;
//     console.log("draw", e.frame);
//     draw(canvas, e.frame);
// })

// Import the framework and instantiate it
import Fastify from 'fastify'
const fastify = Fastify({
    logger: true
})

// Declare a route
fastify.get('/', async function handler (request, reply) {
    return RES;
})

; (async () => {
    // Run the server!
    try {
        await fastify.listen({ host: '0.0.0.0', port: 8088 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})()