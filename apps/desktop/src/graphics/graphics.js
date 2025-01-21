import {StillBackground} from "./stillbkgnd";

export class GraphicsMgr {
    still = new StillBackground();

    setNumOfPicsInRow(x) {
        this.still.setNumOfPicsInRow(x);
    }

    getBkgndFilename() {
        return this.still.getBkgndFilename();
    }

    getLogoFilename() {
        return this.still.getLogoFilename();
    }

    getMotionFlag() {
        return this.still.getMotionFlag();
    }

    getShadeFlag() {
        return this.still.getShadeFlag();
    }

    getTransparentFlag() {
        return this.still.getTransparentFlag();
    }
}
