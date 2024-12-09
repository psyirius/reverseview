import {GradientBackgroundColor} from "./gradbkgnd";
import { SolidBackgroundColor } from "./solidbkgnd";
import { TextColor } from "./textcolor";
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

        const text = new TextColor();
        const solid = new SolidBackgroundColor();
        const gradient = new GradientBackgroundColor();
        const still = new StillBackground();

        function assignColor(y, x) {
            switch (x) {
                case 0:
                    text.assignTextColor(y);
                    break;
                case 1:
                    solid.assignSolidColor(y);
                    break;
                case 2:
                    gradient.assignGradColor1(y);
                    break;
                case 3:
                    gradient.assignGradColor2(y);
                    break;
                case 4:
                    text.assignTextColor2(y);
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
