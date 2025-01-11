import {GradientBackgroundColor} from "./gradbkgnd";
import { SolidBackgroundColor } from "./solidbkgnd";
import {StillBackground} from "./stillbkgnd";

export class GraphicsMgr {
    constructor() {
        this.assignColor = assignColor;
        this.setNumOfPicsInRow = setNumOfPicsInRow;
        this.getBkgndFilename = getBkgndFilename;
        this.getLogoFilename = getLogoFilename;
        this.getMotionFlag = getMotionFlag;
        this.getShadeFlag = getShadeFlag;
        this.getTransparentFlag = getTransparentFlag;

        const solid = new SolidBackgroundColor();
        const gradient = new GradientBackgroundColor();
        const still = new StillBackground();

        function assignColor(y, x) {
            switch (x) {
                case 1: // Solid background color
                    solid.assignSolidColor(y);
                    break;
                case 2: // Gradient color 1
                    gradient.assignGradColor1(y);
                    break;
                case 3: // Gradient color 2
                    gradient.assignGradColor2(y);
                    break;
            }
        }

        function setNumOfPicsInRow(x) {
            still.setNumOfPicsInRow(x);
        }

        function getBkgndFilename() {
            return still.getBkgndFilename();
        }

        function getLogoFilename() {
            return still.getLogoFilename();
        }

        function getMotionFlag() {
            return still.getMotionFlag();
        }

        function getTransparentFlag() {
            return still.getTransparentFlag();
        }

        function getShadeFlag() {
            return still.getShadeFlag();
        }
    }
}
