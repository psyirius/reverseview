const nav = `
<div class="style2">
  <div class="ui grid">
    <div class="ten wide column">
          <div class="ui input">
            <input class="prompt" type="text" size="25" placeholder="Reference : Psa 23 1" id="nav_bibleRefID">
          </div>
    </div>
    
    <div class="two wide column"><span class="iconImageStyle"><img id="nav_bibleRef_findID"></span></div>
    <div class="two wide column"><span class="iconImageStyle"><img id="nav_bibleRef_presentID"></span></div>
  </div>
  <br>

  <table width="250" border="0" cellspacing="0" cellpadding="0" align=center>
    <tr>
      <td width="40">&nbsp;</td>
      <td>
        <div align="center" class="tempList">| BOOK</div>
      </td>
      <td>
        <div align="center" class="tempList">| CHAPTER</div>
      </td>
      <td>
        <div align="center" class="tempList">| VERSE</div>
      </td>
    </tr>
    <tr>
      <td width="40">&nbsp;</td>
      <td height="53">
        <div align="center" class="tempList">
          <select name="book" size="26" id="bookList" class="custom-select navListStyleNew" style="width:160px">
          </select>
        </div>
      </td>
      <td>
        <div align="center" class="tempList">
          <select name="chapter" size="26" id="chapterList" class="custom-select navListStyleNew" style="width:65px">
          </select>
        </div>
      </td>
      <td>
        <div align="center" class="tempList">
          <select name="verse" size="26" id="verseList" class="custom-select navListStyleNew" style="width:55px">
          </select>
        </div>
      </td>
    </tr>
    <tr>
      <td colspan="3">
      </td>
    </tr>

  </table>

  <br>

  <p class="style2" align=left>Recent:
    <select id="recentSel" size="2" class="custom-select navListStyleNew recentListStyle"></select>
  </p>


  <div class="ui grid ">
    <div class="ten wide column">
      <div class="ui icon input">
        <input class="prompt" type="text" size="14" id="searchID" placeholder="Word Search">
      </div>
    </div>
    <div class="four wide column">
      <span class="iconImageStyle"><img id="searchButtonID"></span>
    </div>
  
  </div>
</div>
`;

const search = `
<div id="searchField" class="searchFieldContainer">
    <div id="searchTabDiv">
        <div class="generalheading2">Advanced Search</div><br>
        <div class="style2">
            <label>Search</label>

            <input id="adSearch" type="text" size="30" maxlength="100">

            <select id="searchStyle">
                <option value="0" selected>Contains</option>
                <option value="1">Exact Phrase</option>
            </select>

            <!--
                    <select id="searchVersion">
                          <option value="0" selected>Primary</option>
                          <option value="1">Secondary</option>
                    </select>
            -->
            <select id="searchBook">
                <option value="1">Book</option>
            </select>

            <input type="button" id="adSearchButton" value=" SEARCH "><br>
        </div>
        <hr>
        <div class="generalheading2">Search Results</div>
        <div id="searchSummaryID"  class="searchResultContainerx"></div>
        <div id="searchResultID"  class="searchResultContainer">Search Result</div>
    </div>
</div>
`;

const notes = `
<div class="generalheading2">Bible Notes Manager</div>
<table border="0"><tr height="100px"><td>
<div class="bibleMngContainerLeft">
        <b>Notes File</b> <br>
        <input type="button" id="nm_newID" value=" NEW "> |
        <input type="button" id="nm_add_buttonID" value=" LOAD ">
        <br><br>

        <b>Select Notes</b> <br>
        <select id="nm_selectID" class="selectboxStyle">
        <option value=1>Default Notes</option>
    </select> <br>

    <input type="button" id="nm_sel_buttonID" value=" SELECT "> |
        <input type="button" id="nm_deleteID" value=" DELETE "> |
        <input type="button" id="nm_save_file_buttonID" value=" SAVE "><br><br>

        <b>Notes Type</b>
         <input type="radio" name="nm_note_type" id="nm_note_type1" value="1" checked="checked">Chapter &nbsp;&nbsp;
        <input type="radio" name="nm_note_type" id="nm_note_type2" value="2">Topic
        <!-- <input type="button" id="nm_helpID" value=" HELP ">--> <br><br>


</div></td>
<td>
<div id="nm_new_promptID" class="bibleMngContainerRight">

        <b>Name</b> <br><input type="text" id="nm_name_promptID" size="25"><br>
        <b>Description</b> <br><textarea id="nm_description_promptID" rows="4" cols="25"></textarea>
    <input type="button" id="nm_save_promptID" value=" SAVE "> |
    <input type="button" id="nm_cancel_promptID" value=" CANCEL ">
</div>

<div id="nm_sel_dataID" class="bibleMngContainerRight">
        <!-- <input type="text" id="nm_filenameID" size="30">-->

        <b>Name</b> <br><div id="nm_nameID" class="nm_text"></div><br>
        <b>Description</b> <br><div id="nm_descriptionID" class="nm_text"></div>
    <!-- input type="button" id="nm_debugID" value=" DEBUG "><br> -->
</div>


<!-- <div class="bibleMngContainerRight">Right DIV area</div> -->
</td></tr></table>

<hr>
<div class="generalheading2">Notes</div>
<div id="notesResultsID" class="notesResultDIV"></div>
`;

const settings = `
<div class="generalPanelDIV">
        <div class="generalheading2">Screen Setup</div><br>
        <div class="style2">

                <div class="ui grid">
                        <div class="four wide column">
                                <input type="checkbox" id="mainConfigEnable" Checked> Enable Main Presentation<br>
                                <b>Main Presentation Screen</b><br>
                                <select id="selectScreenID" class="selectboxStyle"></select>
                <button id="refresh-screens-main">Refresh</button>
                        </div>
                        <div class="four wide column">
                                <input type="checkbox" id="stageConfigEnable"> Enable Stage Presentation<br>
                                <b>Stage Presentation Screen</b><br>
                                <select id="selectStageScreenID" class="selectboxStyle"></select>
                <button id="refresh-screens-stage">Refresh</button>
                        </div>
                </div>
                <br>


                <hr>

                <div class="generalheading2">Presentation Screen Setup</div>
                <div id="presentationScreenSetupID" class="padded">
                        <b>Margins</b>
                        <div class="row">
                                <div class="column" style="background-color:#bbb; width: 15%;">
                                        TOP <input name="presentConfigMarginTop" type="text" id="presentConfigMarginTop" value="50"
                                                size="4">
                                </div>
                                <div class="column" style="background-color:#bbb; width: 15%;">
                                        LEFT <input name="presentConfigMarginLeft" type="text" id="presentConfigMarginLeft" value="50"
                                                size="4">
                                </div>
                                <div class="column" style="background-color:#bbb; width: 15%;">
                                        BOTTOM <input name="presentConfigMarginBottom" type="text" id="presentConfigMarginBottom" value="50"
                                                size="4">
                                </div>
                                <div class="column" style="background-color:#bbb; width: 15%;">
                                        RIGHT <input name="presentConfigMarginRight" type="text" id="presentConfigMarginRight" value="50"
                                                size="4">
                                </div>
                        </div>

                        <br>
                        <div class="ui grid">
                                <div class="six wide column">
                                        <b>Maximum Font Size</b> <input type="text" id="presentConfigMaxFontSize" value="150" size="6"> px
                                        (30px to
                                        200px)<br>
                                        <br>
                                        <b>Justification </b>
                                        <input type="radio" name="justify" id="justify_left" value="Left"> Left
                                        <input type="radio" name="justify" id="justify_center" value="Center" CHECKED> Center
                                        <input type="radio" name="justify" id="justify_right" value="Right"> Right
                                        <br><br>


                                        <input type="checkbox" id="presentConfigOntop"> Keep Presentation Window on Top<br>
                                        <input type="checkbox" id="presentConfigEnableTransition"> Enable Transition<br>
                                        <input type="checkbox" id="presentConfigEnableShadow"> Enable Outline<br><br><br>

                                        <input type="checkbox" id="presentConfigShowDateTime"> Show Date and Time<br>
                                        <input type="checkbox" id="presentConfigShowVVLogo"> Show VerseVIEW Logo<br>
                                        <input type="checkbox" id="presentConfigShowCustomLogo"> Show Custom Logo<br>
                                        <input name="customLogoText1" type="text" id="customLogoText1" size="40"><br>
                                        <input name="customLogoText2" type="text" id="customLogoText2" size="40"><br><br>
                                </div>

                                <div class="six wide column">
                                        <b>VERSE</b><br>
                                        <b>Verse Presentaton Style </b>
                                        <input type="radio" name="p_orient" id="porient_hori" value="Horizontal"> Horizontal
                                        <input type="radio" name="p_orient" id="porient_vert" value="Vertical" CHECKED> Vertical
                                        <br><br>

                                        <b>SONG LYRICS</b> <br>
                                        <input type="checkbox" id="presentConfigEnableSongTitle"> Show Song Title<br>
                                        <input type="checkbox" id="showPrimaryFont"> Show lyrics in primary language<br>
                                        <input type="checkbox" id="show2LinesSlides"> Two (2) lines per slide<br>
                                        <input type="checkbox" id="hideStanzaNumber"> Hide stanza number<br>
                                        <input type="checkbox" id="fitLineSetup" CHECKED> Enable Line Wrap<br>
                                        <b>Lyrics Presentaton Style </b>
                                        <input type="radio" name="p_orient_song" id="porient_song_hori" value="Horizontal"> Horizontal
                                        <input type="radio" name="p_orient_song" id="porient_song_vert" value="Vertical" CHECKED> Vertical
                                        <br>
                                </div>

                        </div>
                </div>


                <div class="ui grid">
                        <div class="six wide column">
                                <button type="button" class="btn btn-secondary btn-sm" id="presentConfigSaveButton">SAVE</button>
                        </div>
                </div>

                <hr>


                <div class="generalheading2">Stage Screen Setup</div>
                <div id="stageScreenSetupID" class="padded">
                        <b>Stage Screen Style </b>

                        <!-- StageVIEW style -->
                        <div class="ui grid">
                                <div class="two wide column">
                                        <select id="selectStageStyle" class="selectboxStyle">
                                                <option value=0>Horizontal</option>
                                                <option value=1>Vertical</option>
                                                <option value=3>1/3rd View</option>
                                        </select>
                                </div>
                        </div>

                        <!-- Window View -->
                        <div id="stageviewAsWindowDiv">
                                <div class="ui grid">
                                        <div class="two wide column">
                                                <input type="checkbox" id="stageviewWindow"> Window View
                                        </div>
                                        <div class="two wide column">
                                                <input type="checkbox" id="stageviewMiniWindow"> Small Window
                                        </div>
                                        <div class="two wide column">
                                                <input type="checkbox" id="stageviewGreenWindow"> Green Screen
                                        </div>
                                </div>
                        </div>

                        <div class="ui grid">
                                <div class="six wide column">
                                        <!-- Opacity of the 1/3rd view strip -->
                                        <div id="stageviewOpacityDiv">Opacity<input type="text" id="thirdview_opacity" value="0.6" size="6">
                                                <div class="ui range" id="thirdview_opacity_range"></div>
                                        </div>

                                        <!-- Height of 1/3rd View -->
                                        <div id="stageviewHeightDiv">Height<input type="text" id="thirdview_height" value="33" size="6">
                                                <div class="ui range" id="thirdview_height_range"></div>
                                        </div>

                                        <!-- Vertical Position of 1/3rd View -->
                                        <div id="stageviewPositionDiv">Vertical Position<input type="text" id="thirdview_position"
                                                        value="33" size="6">
                                                <div class="ui range" id="thirdview_position_range"></div>
                                        </div>
                                </div>
                                <div class="six wide column">
                                        <!-- Maximum font size 1/3rd View -->
                                        <div id="stageviewMaxFontsizeDiv">Maximum Font Size<input type="text" id="thirdview_maxFontSize"
                                                        value="33" size="6">
                                                <div class="ui range" id="thirdview_maxFontSize_range"></div>
                                        </div>

                                        <!-- Color of Text in StageVIEW -->
                                        <div id="stageviewForegroundColorDiv">Text Color<input type="text" id="thirdview_fcolor" value=""
                                                        size="6">
                                                <div class="ui range" id="thirdview_fcolor_range"></div>
                                        </div>

                                        <!-- Background color of strip -->
                                        <div id="stageviewBackgroundColorDiv">Background Color<input type="text" id="thirdview_bcolor"
                                                        value="" size="6">
                                                <div class="ui range" id="thirdview_bcolor_range"></div>
                                        </div>
                                </div>
                        </div>
                        <br>




                        <div class="ui grid">
                                <div class="three wide column">
                                        <div id="stageviewPrimaryDiv"><input type="checkbox" id="thirdview_primary"> Show primary only
                                        </div>
                                </div>
                                <div class="three wide column">
                                        <div id="stageviewSecondaryDiv"><input type="checkbox" id="thirdview_secondary"> Show secondary only
                                        </div>
                                </div>
                        </div>
                        <br>




                        <div id="stageviewAlignLeftDiv"><input type="checkbox" id="thirdview_alignLeft"> Align Left </div>
                        <div id="stageviewAlignCenterDiv"><input type="checkbox" id="thirdview_alignCenter"> Align Center </div>
                        <div id="stageviewAlignHorizontalDiv"><input type="checkbox" id="thirdview_alignHorizontal"> Horizontal
                        </div>

                        <div id="stageviewOutlineDiv"><input type="checkbox" id="thirdview_outline"> Auto Text Outline </div>
                        <div id="stageviewShadowDiv"><input type="checkbox" id="thirdview_shadow"> Text Shadow </div>
                        <div id="stageviewShowTextureDiv"><input type="checkbox" id="thirdview_showTexture"> Add Texture </div>

                        <div id="stageviewTimeDiv"><input type="checkbox" id="stageSettingShowTime"> Show date and time </div>

                        <div id="stageMessageDivID" class="padded">
                                <b>Message Setup</b><br>
                                <textarea rows="4" cols="50" id="stageConfigMessage"></textarea>
                                <input name="stageMessageShow" type="button" id="stageMessageShow" value=" SHOW "> |
                                <input name="stageMessageHide" type="button" id="stageMessageHide" value=" CLEAR ">
                        </div>
                </div>


                <hr>
                <br>

        </div>
</div>
`;

const graphics = `
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

const schedule = `
<div class="ui left labeled button" tabindex="0">
  <a class="ui basic label">
    Schedule
  </a>
  <div id="sch_deleteID" class="ui button">Remove Selected</div>
  <div id="sch_deleteAllID" class="ui button">Remove All</div>
  <div id="sch_upID" class="ui button">Move Up</div>
  <div id="sch_downID" class="ui button">Move Down</div>
</div>

        <select class="custom-select navListStyleNew" size="5" style="width:300px" id="sch_selectID">
                <option value=1>None</option>
        </select>
        <div id="sch_verseTextID"></div>
<div class="ui divider"></div>
<button class="ui compact button" id="sch_show_in_lyrics">Show in Lyrics Tab</button>
`;

const song_nav = `
<!-- **** CATEGORY TAGS **** -->
<div class="ui grid ">
  <div class="eight wide column">
    <label for="songnav_category" class="col-form-label form-control-sm">Category</label>
    <select class="form-control-sm col-sm-10" id="songnav_category"></select>
  </div>
  <div class="eight wide column">
    <label for="songnav_tags" class="col-form-label form-control-sm">Tags</label>
    <select class="form-control-sm col-sm-10" id="songnav_tags">
      <option>WORSHIP</option>
    </select>
  </div>
</div>

<!-- **** TITLE SEQUENCE **** -->
<div class="ui grid vvrow40">
  <div class="nine wide column">
    <div class="ui search songsearch">
      <div class="ui icon input">
        <input class="prompt" type="text" size="14" id="songnav_editbox" placeholder="Search">
      </div>
      <div class="results"></div>
    </div>
  </div>


  <div class="one wide column">
    <span class="iconImageStyle"><img id="songnav_searchbutton"></span>
  </div>
  <div class="one wide column">
    <span class="iconImageStyle"><img id="songnav_searchauthorbutton"></span>
  </div>
  <div class="one wide column">
    <span class="iconImageStyle"><img id="songnav_clearbutton"></span>
  </div>
</div>

<!-- **** ERROR Notification and word suggestions **** -->
<div class="ui grid vvrow40">
  <div class="ten wide column">
    <div class="col-form-label form-control-sm" id="search_error_notification"></div>
  </div>
</div>

<div class="style2">
  <!-- <b>Song Title</b><br> -->
  <input type="text" id="songnav_filterbox" size="30"><br>
  <div id="songnav_songlistnew" class="yui-skin-sam"></div>
</div>
<!-- <input type="text" class="form-control form-control-sm" id="songnav_editbox_hold" placeholder="Search"> -->
`;

const song_lyrics = `
<!-- **** TITLE SEQUENCE **** -->
<div class="ui grid">
  <div class="ten wide column">
    <p class="h5" id="ly_name"></p>
    <small class="h6 text-muted" id="ly_name2"></small>
  </div>
  <!--<div class="five wide column">

  </div>-->
  <div class="one wide column">

  </div>
  <div class="one wide column">
    <label for="ly_sequence" class="invisible">Sequence</label>
  </div>
  <div class="four wide column">
    <input type="text" class="form-control form-control-sm invisible" id="ly_sequence" placeholder="">
  </div>
</div>

<!-- **** BUTTONS **** -->
<div class="ui grid">
  <div class="sixteen wide column">
    <button type="button" class="btn btn-secondary btn-sm" id="ly_edit">EDIT</button>
    <button type="button" class="btn btn-secondary btn-sm" id="ly_add2schedule">SCHEDULE</button>
    <button type="button" class="btn btn-secondary btn-sm" id="ly_present">PRESENT</button>
  </div>
</div>

<!-- **** SLIDES **** -->
<div class="ui grid">
  <div class="column border border-primary">
    <div id="ly_slide" class="ly_slide_class"></div>
  </div>
</div>

<!-- **** TAGS **** -->
<div class="ui grid">
  <div class="ten wide column" id="ly_tags">
  </div>
</div>

<!-- **** ADDITONAL INFO **** -->
<div class="ui grid">
  <div class="three wide column">
    <div class="form-group row">
      <label for="ly_cat" class="col-sm col-form-label font-weight-bold">Category</label>
      <label type="text" class="col-sm col-form-label" id="ly_cat"> </label>
    </div>
  </div>
  <div class="two wide column">
    <div class="form-group row">
      <label for="ly_key" class="col-sm col-form-label font-weight-bold">Key</label>
      <label type="text" class="col-sm col-form-label" id="ly_key"> </label>
    </div>
  </div>
  <div class="three wide column">
    <div class="form-group row">
      <label for="ly_copy" class="col-sm col-form-label font-weight-bold">Lyrics By</label>
      <!--<label type="text" class="col-sm col-form-label" id="ly_copy"> </label>-->
      <button type="button" class="btn btn-outline-secondary btn-sm" id="ly_copy"></button>
    </div>
  </div>
  <div class="eight wide column">
    <div class="form-group row">
      <label for="ly_notes" class="col-sm col-form-label font-weight-bold">Notes</label>
      <div type="text" class="col-sm col-form-label" id="ly_notes"> </div>
    </div>
  </div>
</div>
`;

const bible_verses = `
<div id="verseTab" class="tabSubContainer" >Loading Bible Database ... </div>
`;

export default {
    nav,
    search,
    notes,
    settings,
    graphics,
    schedule,
    song_nav,
    song_lyrics,
    bible_verses,
};

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
