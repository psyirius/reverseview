/*
    PROCESS THE DATA AND DISPLAY IT CORRECTLY FOR THE THEME
*/
function processLower3rdResponse(){
    var verseNumber = "";

    $(".textStyle").css("text-align", textAlign);

    $(".textStyle").css("text-shadow", textShadow);
    $(".textStyle").css("-webkit-text-stroke", textOutline);

    if (backgroundImage){
        //console.log(backgroundFilename);
        $(".theme1").css("background-image", "url(" + backgroundFilename + ")");
    } else {
        $(".theme1").css("background-image", "none");
    }

    if (enableUpperCase){
        p_text1 = p_text1.toUpperCase();
        p_text2 = p_text2.toUpperCase();
    }

    if (p_title != "") {		//Detect it is a verse and add the book name and chapter
        //p_text1 = p_title + "<br>" + p_text1;		// Only lyrics  - so no title
        //p_text2 = p_title + ":" + p_text2;
        verseNumber = (p_text1.split(" "))[0];
        //console.log(verseNumber);
        p_text1 = p_text1.substr(p_text1.indexOf(" ") + 1);
        p_text2 = p_text2.substr(p_text2.indexOf(" ") + 1);
    }

    if (showBothTranslations) {
        p_text1 = p_text1 + "<BR>" + "<div style='font-family:" + p_font2 + "'>" + p_text2 + "</div>";
        console.log(p_text1);
    }

    //console.log(p_text1);
    if (p_text1 == "") {
        console.log("blank");
    }



    //SETUP THE POSITION of left translation
    $("#resultID1").css("top", ref_top);
    $("#resultID1").css("left", ref_left);
    $("#resultID1").css("width", ref_width);
    $("#resultID1").css("height", ref_height);

    //SETUP THE POSITION of right translation
    $("#resultID2").css("top", vv_top);
    $("#resultID2").css("left", vv_left);
    $("#resultID2").css("width", vv_width);
    $("#resultID2").css("height", vv_height);

    $("#resultID1").css("color", vv_text_color1);
    $("#resultID2").css("color", vv_text_color2);


    var f = p_font1;
    if (newFont1 != ""){
        f = newFont1;
    }
    $("#resultID1").css("font-family", f);
    $("#resultID1").html(p_title + ":" + verseNumber);

    //var f = p_font2;
    //if (newFont2 != ""){
    //	f = newFont2;
    //}
    $("#resultID2").css("font-family", f);
    $("#resultID2").html(p_text1);

    textFit(document.getElementsByClassName('box1')[0], {
        minFontSize: refminfont,
        maxFontSize: refmaxfont,
        alignVert: true,
        multiLine: false,
        widthOnly: false,
        detectMultiLine: false
    });

    textFit(document.getElementsByClassName('box2')[0], {
        minFontSize: minfont,
        maxFontSize: maxfont,
        alignVert: true,
        multiLine: textMultiLine,
        widthOnly: false,
        detectMultiLine: false
    });
}