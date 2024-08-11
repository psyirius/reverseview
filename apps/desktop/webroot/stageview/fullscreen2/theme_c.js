/* 
    PROCESS THE DATA AND DISPLAY IT CORRECTLY FOR THE THEME
*/
function processLower3rdResponse() {
    $(".textStyle").css("text-align", textAlign);

    $(".textStyle").css("text-shadow", textShadow);
    $(".textStyle").css("-webkit-text-stroke", textOutline);

    if (backgroundImage) {
        //console.log(backgroundFilename);
        $(".theme1").css("background-image", "url(" + backgroundFilename + ")");
    } else {
        $(".theme1").css("background-image", "none");
    }

    if (enableUpperCase) {
        p_text1 = p_text1.toUpperCase();
        p_text2 = p_text2.toUpperCase();
    }

    var verseNumber = "";
    if (p_title != "") {
        //Detect it is a verse and add the book name and chapter
        verseNumber = p_text1.split(" ")[0];
        //console.log(verseNumber);
        p_text1 = p_text1.substr(p_text1.indexOf(" ") + 1);
        p_text2 = p_text2.substr(p_text2.indexOf(" ") + 1);
    }

    if (showBothTranslations) {
        //p_text1 = p_text1 + "<BR>" + "<div style='font-family:" + p_font2 + "'>" + p_text2 + "</div>";
    }

    //console.log(p_text1);
    if (p_text1 == "") {
        console.log("blank");
    }

    //console.log($( window ).width());
    var newscreenResolutionHorizontal = $(window).width();
    var newscreenResolutionVertical = $(window).height();

    var vv_width_percent = newscreenResolutionHorizontal / screenResolutionHorizontal;
    var vv_height_percent = newscreenResolutionVertical / screenResolutionVertical;

    var new_vv_top = vv_top * vv_height_percent;
    var new_vv_left = vv_left * vv_width_percent;
    var new_vv_width = vv_width * vv_width_percent;
    var new_vv_height = vv_height * vv_height_percent;
    var new_spaceBetweenTranslations = spaceBetweenTranslations * vv_height_percent;

    var new_ref_top = ref_top * vv_height_percent;
    var new_ref_left = ref_left * vv_width_percent;
    var new_ref_width = ref_width * vv_width_percent;
    var new_ref_height = ref_height * vv_height_percent;

    //console.log(new_ref_top);

    if (p_title != "") {
        //Detect it is a verse and add the book name and chapter
        p_title = p_title + ":" + verseNumber;

        //FOR REFERENCE
        $("#resultIDRef").css("top", new_ref_top);
        $("#resultIDRef").css("left", new_ref_left);
        $("#resultIDRef").css("width", new_ref_width);
        $("#resultIDRef").css("height", new_ref_height);
    }

    if (showBothTranslations) {
        if (showHorizontal) {
            setSplitRatio();
            //console.log("here");
            //SETUP THE POSITION of left translation
            $("#resultID1").css("top", new_vv_top);
            $("#resultID1").css("left", new_vv_left);
            $("#resultID1").css("width", new_vv_width);
            $("#resultID1").css("height", new_vv_height * t1_ratio - new_spaceBetweenTranslations);

            //SETUP THE POSITION of right translation
            $("#resultID2").css("top", new_vv_top + new_vv_height * t1_ratio + new_spaceBetweenTranslations * 2);
            $("#resultID2").css("left", new_vv_left);
            $("#resultID2").css("width", new_vv_width);
            $("#resultID2").css("height", new_vv_height * t2_ratio - new_spaceBetweenTranslations);
        } else {
            //SETUP THE POSITION of left translation
            $("#resultID1").css("top", new_vv_top);
            $("#resultID1").css("left", new_vv_left);
            $("#resultID1").css("width", new_vv_width / 2 - new_spaceBetweenTranslations);
            $("#resultID1").css("height", new_vv_height);

            //SETUP THE POSITION of right translation
            $("#resultID2").css("top", new_vv_top);
            $("#resultID2").css("left", new_vv_left + new_vv_width / 2 + new_spaceBetweenTranslations * 2);
            $("#resultID2").css("width", new_vv_width / 2 - new_spaceBetweenTranslations);
            $("#resultID2").css("height", new_vv_height);
        }
    } else {
        //SETUP THE POSITION for full screen single translation
        $("#resultID1").css("top", new_vv_top);
        $("#resultID1").css("left", new_vv_left);
        $("#resultID1").css("width", new_vv_width);
        $("#resultID1").css("height", new_vv_height);
    }

    $("#resultIDRef").css("color", ref_text_color1);
    $("#resultID1").css("color", vv_text_color1);
    $("#resultID2").css("color", vv_text_color2);

    var f = p_font1;
    if (newFont1 != "") {
        f = newFont1;
    }
    $("#resultID1").css("font-family", f);
    $("#resultID1").css(text1_style);
    $("#resultID1").html(p_text1);

    if (p_title != "") {
        $("#resultIDRef").css("font-family", f);
        $("#resultIDRef").css(ref_border);
        $("#resultIDRef").html(p_title);
        $("#resultIDRef").show();
    } else {
        $("#resultIDRef").hide();
    }

    if (showBothTranslations && p_text2.length > 2) {
        var f = p_font2;
        if (newFont2 != "") {
            f = newFont2;
        }
        $("#resultID2").css("font-family", f);
        $("#resultID2").css(text2_style);
        $("#resultID2").html(p_text2);
    }

    if (p_title != "") {
        textFit(document.getElementsByClassName("box0")[0], {
            minFontSize: minfont,
            maxFontSize: maxfont,
            alignVert: true,
            multiLine: textMultiLine,
            widthOnly: false,
            detectMultiLine: false,
        });
    }

    textFit(document.getElementsByClassName("box1")[0], {
        minFontSize: minfont,
        maxFontSize: maxfont,
        alignVert: true,
        multiLine: textMultiLine,
        widthOnly: false,
        detectMultiLine: false,
    });

    if (showBothTranslations && p_text2.length > 2) {
        textFit(document.getElementsByClassName("box2")[0], {
            minFontSize: minfont,
            maxFontSize: maxfont,
            alignVert: true,
            multiLine: textMultiLine,
            widthOnly: false,
            detectMultiLine: false,
        });
    }
}

var t1_ratio = 0.5;
var t2_ratio = 0.5;
function setSplitRatio() {
    var len1 = p_text1.length;
    var len2 = p_text2.length;

    t1_ratio = len1 / (len1 + len2);
    t2_ratio = 1 - t1_ratio;
}
