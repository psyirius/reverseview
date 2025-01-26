import {StillBackground} from "./stillbkgnd";

export class GraphicsMgr {
    still = new StillBackground();

    addStillBg() {
        return this.still.addStillBg();
    }

    delStillBg(idx) {
        return this.still.delStillBg(idx);
    }

    getBkgndFilename() {
        return this.still.getBkgndFilename();
    }

    getLogoFilename() {
        return this.still.getLogoFilename();
    }
}
