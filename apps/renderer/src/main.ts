import {Window, Canvas} from 'skia-canvas'

let win = new Window(300, 300)
win.title = "Canvas Window"
win.on("draw", (e: any) => {
    const { canvas } = e.target;

    const ctx = (canvas as Canvas).getContext("2d")

    const {width, height} = canvas;
})