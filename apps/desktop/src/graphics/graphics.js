import { GradiantBackgroundColor } from "./gradbkgnd";
import { SolidBackgroundColor } from "./solidbkgnd";
import { TextColor } from "./textcolor";
import {ColorPickerPanel} from "./colorpicker";
import {StillBackground} from "./stillbkgnd";
import {$RvW} from "@/rvw";

const INNER_HTML = `
<div id="graphicsDiv">
    <div id="leftcolumn">
        <div class="generalheading2">
            Text Color
        </div>
        <div id="graphics_text_color_id" class="graphics_selColor"></div>
        <div class="graphics_changeColor style2">
            <input type="button" id="changeTextColorButton" value=" CHANGE "> | 
            <input type="button" id="resetTextColorButton" value=" RESET ">
        </div>
        
        <br> 
        
        <div class="generalheading2">
            Background Image
        </div>
        <img id="selected_still_id" width=150 height=100><br>
        <!-- <input type="button" id="setAsBackgroundButtonID" value=" SET as Background "> -->
        <br><br>
        
        <div class="generalheading2">
            Logo Image
        </div>
        <img id="selected_logostill_id" width=150 height=100><br>
        <!-- <input type="button" id="setAsLogoButtonID" value=" SET as Logo "> -->
        <br><br>
    </div>
    
    <div id="rightcolumn">
        <div class="generalheading2">Background</div>
        <div class="style2">
            <input type="radio" name="bkgndtype" id="bkgnd_solid" value="0"> Solid Colors
            <input type="radio" name="bkgndtype" id="bkgnd_gradient" value="1"> Graident
            <input type="radio" name="bkgndtype" id="bkgnd_still" value="2" CHECKED > Still Background
            <input type="radio" name="bkgndtype" id="bkgnd_motion" value="3"> <!-- Motion Background -->
        </div>
        
        <div id="solid_bkgnddiv">
            <div id="graphics_solid_color_id" class="graphics_selColor"></div>
            <div class="graphics_changeColor style2">
                <input type="button" id="changeBkgndColorButton" value=" CHANGE "> | 
                <input type="button" id="resetBkgndColorButton" value=" RESET ">
            </div>
        </div>
        <div id="graident_bkgnddiv">
            <div id="graphics_grad_color_id" class="graphics_selColor"></div>
            <div class="graphics_changeColor style2">
                <input type="button" id="changeGradColor1Button" value=" COLOR 1 "> | 
                <input type="button" id="changeGradColor2Button" value=" COLOR 2 "> | 
                <input type="button" id="resetGradColorButton" value=" RESET "> <br>
                Orientation: 
                <select id="orientGradListID" class="selectboxStyle">
                    <option value=0 SELECTED>Left</option>
                    <option value=1>Right</option>
                    <option value=2>Top</option>
                    <option value=2>Bottom</option>
                </select>
            </div>
        </div>
    

        <div id="still_bkgnddiv" class="still_bkgnddiv_style style2">

            
            <div id="list_still_bkgnd_div" class="list_still_bkgnd_style">
                <!-- <div class="wrapperClass"> -->
                    <div id="control_still_bkgnddiv" class="conrol_still_bkgnddiv_style floatleftClass">
                        <input type="button" id="addStillBkgndButtonID" value=" ADD "> |
                        <input type="button" id="delStillBkgndButton" value=" DELETE "><br>
                        <input type="button" id="setAsBackgroundButtonID" value=" SET as Background "><br>
                        <input type="button" id="setAsLogoButtonID" value=" SET as Logo "><br>
                        
                        <input type="checkbox" id="still_animate"> Motion Background<br>
                        <input type="checkbox" id="randomBackgroundID"> Random Background<br>                
                        <input type="checkbox" id="shadedBackgroundID"> Shaded Background<br>
                        <input type="checkbox" id="transparentBackgroundID"> Transparent Background<br>

                    </div>
                    <div class="floatleftClass"><img id="selectedx_still_id" width=150 height=100></div>
                <!-- </div> -->
            
                <div id="still_bkgnd_grid"></div>
                <!-- <table id="list_still_bkgnd" class="bkgnd_table_temp" width="95%" border="1" cellspacing="0" cellpadding="10">
                </table> -->
            </div>
        </div>
        
        <div id="motion_bkgnddiv">
            <br>
            <b>Select Motion Graphics</b> <br>
            <select size="10"  id="motionbkgnd_selectID" class="wideselectboxStyle" style="align:top">
                <!-- <option value=1>None</option> -->
            </select>
            <div class="style2">
                <input type="button" id="addMotionBkgndButtonID" value=" ADD "> | 
                <input type="button" id="delMotionBkgndButton" value=" DELETE ">
            </div>
            <input type="checkbox" id="shadedBackgroundID"> Shaded Background<br>
        </div>
    
    </div>
        
        
    <div id="cp_panelx" class="cp_container"></div>
</div>


    
</div>
<!-- </body> -->`;

export class GraphicsMgr {
    constructor() {
        this.assignColor = l;
        this.setNumOfPicsInRow = c;
        this.getBkgndFilename = j;
        this.getLogoFilename = a;
        this.getMotionFlag = m;
        this.getShadeFlag = h;
        this.getTransparentFlag = w;
        var n = null;
        var p = null;
        var e = null;
        var f = null;
        var u;
        var t;
        var q;
        var i;
        var o;
        var g;

        init(INNER_HTML);

        function init(x) {
            document.getElementById("graphicsTab").innerHTML = x;
            $("#bkgnd_motion").hide();
            $("#motion_bkgnddiv").hide();
            n = new TextColor();
            n.init();
            p = new SolidBackgroundColor();
            p.init();
            e = new GradiantBackgroundColor();
            e.init();
            f = new StillBackground();
            f.init();
            d();
            k();
            s();
        }
        function d() {
            var x = $RvW.vvConfigObj.get_p_bkgnd_type();
            document.getElementById("solid_bkgnddiv").style.visibility = "hidden";
            document.getElementById("graident_bkgnddiv").style.visibility = "hidden";
            document.getElementById("still_bkgnddiv").style.visibility = "hidden";
            document.getElementById("motion_bkgnddiv").style.visibility = "hidden";
            switch (x) {
                case "1":
                    document.getElementById("solid_bkgnddiv").style.visibility = "visible";
                    document.getElementById("bkgnd_solid").checked = true;
                    break;
                case "2":
                    document.getElementById("graident_bkgnddiv").style.visibility =
                        "visible";
                    document.getElementById("bkgnd_gradient").checked = true;
                    break;
                case "3":
                    document.getElementById("still_bkgnddiv").style.visibility = "visible";
                    document.getElementById("bkgnd_still").checked = true;
                    break;
                case "4":
                    document.getElementById("motion_bkgnddiv").style.visibility = "visible";
                    document.getElementById("bkgnd_motion").checked = true;
                    break;
                default:
                    document.getElementById("still_bkgnddiv").style.visibility = "visible";
                    document.getElementById("bkgnd_still").checked = true;
                    break;
            }
        }
        function k() { }
        function s() {
            document.getElementById("bkgnd_solid").addEventListener("change", v, false);
            document
                .getElementById("bkgnd_gradient")
                .addEventListener("change", v, false);
            document.getElementById("bkgnd_still").addEventListener("change", v, false);
            document
                .getElementById("bkgnd_motion")
                .addEventListener("change", v, false);
        }
        function v() {
            var y = document.getElementById("bkgnd_solid").checked;
            var A = document.getElementById("bkgnd_gradient").checked;
            var x = document.getElementById("bkgnd_still").checked;
            var z = document.getElementById("bkgnd_motion").checked;
            if (y) {
                document.getElementById("solid_bkgnddiv").style.visibility = "visible";
                document.getElementById("graident_bkgnddiv").style.visibility = "hidden";
                document.getElementById("still_bkgnddiv").style.visibility = "hidden";
                document.getElementById("motion_bkgnddiv").style.visibility = "hidden";
                $RvW.vvConfigObj.set_p_bkgnd_type(1);
                $RvW.vvConfigObj.save();
            }
            if (A) {
                document.getElementById("solid_bkgnddiv").style.visibility = "hidden";
                document.getElementById("graident_bkgnddiv").style.visibility = "visible";
                document.getElementById("still_bkgnddiv").style.visibility = "hidden";
                document.getElementById("motion_bkgnddiv").style.visibility = "hidden";
                $RvW.vvConfigObj.set_p_bkgnd_type(2);
                $RvW.vvConfigObj.save();
            }
            if (x) {
                document.getElementById("solid_bkgnddiv").style.visibility = "hidden";
                document.getElementById("graident_bkgnddiv").style.visibility = "hidden";
                document.getElementById("still_bkgnddiv").style.visibility = "visible";
                document.getElementById("motion_bkgnddiv").style.visibility = "hidden";
                $RvW.vvConfigObj.set_p_bkgnd_type(3);
                $RvW.vvConfigObj.save();
            }
            if (z) {
                document.getElementById("solid_bkgnddiv").style.visibility = "hidden";
                document.getElementById("graident_bkgnddiv").style.visibility = "hidden";
                document.getElementById("still_bkgnddiv").style.visibility = "hidden";
                document.getElementById("motion_bkgnddiv").style.visibility = "visible";
                $RvW.vvConfigObj.set_p_bkgnd_type(4);
                $RvW.vvConfigObj.save();
            }
        }
        function l(y, x) {
            if (x == 0) {
                n.assignTextColor(y);
            }
            if (x == 4) {
                n.assignTextColor2(y);
            }
            if (x == 1) {
                p.assignSolidColor(y);
            }
            if (x == 2) {
                air.trace("Assign color 1 for gradient");
                e.assignGradColor1(y);
            }
            if (x == 3) {
                e.assignGradColor2(y);
            }
        }
        function b() {
            var x = new ColorPickerPanel();
            x.init(textColor, 0);
        }
        function c(x) {
            f.setNumOfPicsInRow(x);
        }
        function j() {
            return f.getBkgndFilename();
        }
        function a() {
            return f.getLogoFilename();
        }
        function m() {
            return f.getMotionFlag();
        }
        function w() {
            return f.getTransparentFlag();
        }
        function h() {
            return f.getShadeFlag();
        }
    }
}
