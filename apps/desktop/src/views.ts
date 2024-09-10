const recent = `
<div class="generalheading2">Recent Selection</div><br>
<!--<select id="recentSel" size="15" class="navListStyle"></select>-->
`;

const setup_presentui = `
<div class="generalPanelDIV">
        <div class="generalheading2">Presentation Setup</div><br>
        <div class="style2">
                Presentation Screen<br>
                <select id="selectScreenID" class="selectboxStyle">
        <option value=1>Screen 1</option>
        </select> <br><br>

                Margins<br>
                <table width="90%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                                <td width="15%">TOP </td>
                        <td width="20%"><input name="presentConfigMarginTop" type="text" id="presentConfigMarginTop" value="50" size="6"></td>
                        <td width="15%">LEFT </td>
                        <td width="20%"><input name="presentConfigMarginLeft" type="text" id="presentConfigMarginLeft" value="50" size="6"></td>
                        </tr>
                        <tr>
                                <td>BOTTOM </td>
                        <td><input name="presentConfigMarginBottom" type="text" id="presentConfigMarginBottom" value="50" size="6"></td>
                                <td>RIGHT </td>
                        <td><input name="presentConfigMarginRight" type="text" id="presentConfigMarginRight" value="50" size="6"></td>
                        </tr>
                </table>
                <br>
                Maximum Font Size <input type="text" id="presentConfigMaxFontSize" value="150" size="6"> px (30px to 200px)<br>
                <br>
                Justification :
                <input type="radio" name="justify" id="justify_left" value="Left"> Left
                <input type="radio" name="justify" id="justify_center" value="Center" CHECKED > Center
                <input type="radio" name="justify" id="justify_right" value="Right"> Right
                <br><br>


                <input type="checkbox" id="presentConfigEnableTransition"> Enable Transition<br>
                <input type="checkbox" id="presentConfigEnableShadow"> Enable Outline<br><br><br>

                <input type="checkbox" id="presentConfigShowDateTime"> Show Date and Time<br>
                <input type="checkbox" id="presentConfigShowVVLogo"> Show VerseVIEW Logo<br>
                <input type="checkbox" id="presentConfigShowCustomLogo"> Show Custom Logo<br>
                <input name="customLogoText1" type="text" id="customLogoText1" size="40"><br>
                <input name="customLogoText2" type="text" id="customLogoText2" size="40"><br><br>


                VERSE<br>
                Verse Presentaton Style :
                <input type="radio" name="p_orient" id="porient_hori" value="Horizontal"> Horizontal
                <input type="radio" name="p_orient" id="porient_vert" value="Vertical" CHECKED > Vertical
                <br><br>

                SONG LYRICS <br>
                <input type="checkbox" id="presentConfigEnableSongTitle"> Show Song Title<br>
                <input type="checkbox" id="showPrimaryFont"> Show lyrics in primary language<br>
                Lyrics Presentaton Style :
                <input type="radio" name="p_orient_song" id="porient_song_hori" value="Horizontal"> Horizontal
                <input type="radio" name="p_orient_song" id="porient_song_vert" value="Vertical" CHECKED > Vertical
                <br><br>

        <br>
                <p>
                <input name="presentConfigSaveButton" type="button" id="presentConfigSaveButton" value=" SAVE ">
                </p>
                <br>
        </div>
</div>
`;

const bgnd = `
<table width="100%" border="0" align="center">
  <tr>
    <td width="300px">
        <div class="generalheading2">Selected Background</div>
        <table id="bkgndSelected" width="100%" border="0" cellspacing="0" cellpadding="0" align="left" valign="top">
                        <tr>
                        <td height="200"></td>
                        </tr>
                </table>
    </td>
    <td>
        <div class="generalheading2" style="vertical-align:top;">Text Color</div><br>
        <div id="colorPickerID" class="colorPickerStyle">
                <!-- Color Picker -->
        </div>
        <div class="style2">
                <input id="cp_reset_id" type="button" value=" RESET "> |
                        <input id="cp_save_id" type="button" value=" SAVE ">
                </div>
    </td>
    </tr><tr>

  </tr>
</table>
<hr>
<div class="generalheading2">Background Selection</div><br>
<div id="bkgndDivId" class="bkgndDIV">
<table id="bkgndList" width="100%" border="1" cellspacing="-" cellpadding="0">
</table>

<div class="style2">
<br>
<span class="iconImageStyle"><img id="addBkgndButton"></span>
<span class="iconImageStyle"><img id="delBkgndButton"></span>
</div>

</div>
`;

const monitor = `
<b>Presentation Screen</b> <br>
<div id="monitorDiv" class="monitorClass"></div>

<br><br><hr>
<b>Presentation Controls</b> <br><br>

<span class="iconImageStyle"><img id="mon_prevBut"></span>
<span class="iconImageStyle"><img id="mon_nextBut"></span>
<span class="iconImageStyle"><img id="mon_themeBut"></span>
<span class="iconImageStyle"><img id="mon_blankBut"></span>
<span class="iconImageStyle"><img id="mon_closeBut"></span>
`;

const presentation = `
<p> PRESENTATION </p><br>
<p> 
  <input type="checkbox" name="checkbox" value="checkbox">
  Enable Dual Screen support</p>
<br><hr>

<p>MARGIN</p><br>
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td><table width="15%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td width="50%">TOP</td>
          <td width="50%"><input name="presentConfigMarginTop" type="text" id="presentConfigMarginTop" value="50" size="6"></td>
        </tr>
        <tr>
          <td>BOTTOM</td>
          <td><input name="presentConfigMarginBottom" type="text" id="presentConfigMarginBottom" value="50" size="6"></td>
        </tr>
        <tr>
          <td>LEFT</td>
          <td><input name="presentConfigMarginLeft" type="text" id="presentConfigMarginLeft" value="50" size="6"></td>
        </tr>
        <tr>
          <td>RIGHT</td>
          <td><input name="presentConfigMarginRight" type="text" id="presentConfigMarginRight" value="50" size="6"></td>
        </tr>
      </table>
    </td>
    <td>IMAGE</td>
  </tr>
</table><br>
<p>
  <input name="presentConfigSaveButton" type="button" id="presentConfigSaveButton" value=" SAVE ">
</p>
`;
