
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

export default function RightGraphicsTab() {
    return (
        <div id="graphicsTab" dangerouslySetInnerHTML={{__html: INNER_HTML}}>
        </div>
    )
}