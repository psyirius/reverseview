var p_text1_arr = new Array();
var p_text2_arr = new Array();
var p_text1_font = "";
var p_text2_font = "";
var p_title = "";
var p_footnote = "";
var p_current_index = 0;
var p_last_index = 0;
var p_bkgnd_filename = "";
var p_bkgnd_motion = false;
var p_font_color = "";
var p_font_color2 = "";
var p_font_color_invert = "";
var p_font_color2_invert = "";
var p_window_X = "800";
var p_window_Y = "600";
var p_topMargin = 50;
var p_bottomMargin = 50;
var p_leftMargin = 50;
var p_rightMargin = 50;
var p_align = "left";
var p_maxFontSize = 100;
var p_enableTransition = true;
var p_showTitle = true;
var p_enableShadow = true;
var p_ver1ScaleFactor = 1;
var p_ver2ScaleFactor = 1;
var p_bkgnd_color = "000000";
var p_bkgnd_color1 = "00ffa0";
var p_bkgnd_color2 = "FacFFF";
var p_bkgnd_grad_orient = 1;
var p_motion_bkgnd_filename = "motion_bkg/greencandles.swf";
var p_bkgnd_type = 3;
var p_text_orientation = "0";
var p_logo = "";
var p_showDate = true;
var p_showLogo = true;
var p_shadeBackground;
var p_transparentBackground;
var p_isArabic1 = false;
var p_isArabic2 = false;
var p_format = { mutipleLines: true };
var timeValue = 0;
var timeValueDefault = 150;
var motionFlagState = false;
var outlineThickness = 3;
var initialRenderDelay = 100;
var showingtheme = false;
var specialFontList = new Array(
  "JC_Malayalam",
  "JC_Hindi",
  "Malayalam",
  "ML-TTKarthika",
  "Thiruvachanam",
  "Kerala",
  "ML-TTRevathi",
  "Tamil Bible",
  "ML-Keraleeyam1",
  "",
  "Shusha",
  "kambar",
  "tamil",
  "Kerala"
);
var firstTime = true;
var presentDebug = false;
function initPresentation() {
  debugPrintPresent("*** Init Presentation****");
  passVariable(0);
  motionFlagState = false;
  if (p_enableTransition) {
    initTransition(true);
  } else {
    initTransition(false);
  }
  presentation_initEvent();
  getDate();
  updatePresentation();
  updateContent();
}
function presentation_initEvent() {
  $("#presentationContent").swipe({
    swipe: function (c, e, f, d, b) {
      a(e);
    },
  });
  function a(b) {
    switch (b) {
      case "up":
      case "down":
        clearPresenter();
        break;
      case "right":
        prevSlide();
        window.parent.goToPrevSlide();
        break;
      case "left":
        nextSlide();
        window.parent.goToNextSlide();
        break;
    }
  }
  window.onunload = function (b) {
    window.parent.iamclosingStage();
  };
}
function clearPresenter() {
  window.close();
}
var canvas_top, canvas_left, canvas_height, canvas_width;
var title_top, title_left, title_height, title_width;
var c_top, c_left, c_height, c_width;
var c1_top, c1_left, c1_height, c1_width;
var c2_top, c2_left, c2_height, c2_width;
var f_top, f_left, f_height, f_width;
var titleAllocation = 0.1;
var contentAllocation = 0.85;
var footerAllocation = 0.05;
function setupBackground() {
  if (p_bkgnd_type == 1) {
    if (p_transparentBackground == true) {
      document.getElementById("backgroundLayer").style.opacity = "0";
    }
    document.getElementById("p_body").style.backgroundImage = "url()";
    document.getElementById("p_body").style.backgroundColor = p_bkgnd_color;
  }
  if (p_bkgnd_type == 2) {
    var b = "";
    switch (p_bkgnd_grad_orient) {
      case 3:
        b = b + "-webkit-gradient(linear, 0% 0%, 0% 100%, from(";
        break;
      case 1:
        b = b + "-webkit-gradient(linear, 0% 0%, 100% 0%, from(";
        break;
      case 2:
        b = b + "-webkit-gradient(linear, 0% 100%, 0% 0%, from(";
        break;
      case 0:
        b = b + "-webkit-gradient(linear, 100% 0%, 0% 0%, from(";
        break;
      default:
        b = b + "-webkit-gradient(linear, 0% 0%, 0% 100%, from(";
    }
    b = b + p_bkgnd_color1 + "), to(" + p_bkgnd_color2 + "))";
    document.getElementById("p_body").style.backgroundImage = "url()";
    document.getElementById("p_body").style.backgroundImage = b;
  }
  if (p_bkgnd_type == 3) {
    var a = air.File.applicationStorageDirectory;
    var c = a.resolvePath(p_bkgnd_filename[0]);
    if (!p_bkgnd_motion) {
      document.getElementById("backgroundImage").src = c.url;
      document.getElementById("backgroundImage").width = p_window_X;
      document.getElementById("backgroundImage").height = p_window_Y;
      document.getElementById("backgroundLayer").width = p_window_X;
      document.getElementById("backgroundLayer").height = p_window_Y;
      if (p_transparentBackground == true) {
        document.getElementById("backgroundLayer").style.opacity = 0;
      }
    } else {
      if (!motionFlagState) {
        document.getElementById("backgroundLayer").innerHTML =
          '<img id="backgroundImage">';
        document.getElementById("backgroundImage").src = c.url;
        document.getElementById("backgroundImage").width = p_window_X;
        document.getElementById("backgroundImage").height = p_window_Y;
        document.getElementById("backgroundLayer").width = p_window_X;
        document.getElementById("backgroundLayer").height = p_window_Y;
        motionFlagState = true;
        zoompan(c.url);
      } else {
        zoompan(c.url);
      }
    }
  }
}
function setupCanvasPosition() {
  var a = 20;
  canvas_top = p_topMargin;
  canvas_left = p_leftMargin;
  canvas_width = p_window_X - canvas_left - p_rightMargin;
  canvas_height = p_window_Y - canvas_top - p_bottomMargin;
  document.getElementById("semitransparentLayer").style.left = canvas_left - a;
  document.getElementById("semitransparentLayer").style.top = canvas_top - a;
  document.getElementById("semitransparentLayer").style.width =
    canvas_width + a * 2;
  document.getElementById("semitransparentLayer").style.height =
    canvas_height + a * 2;
  if (p_shadeBackground) {
    document.getElementById("semitransparentLayer").style.visibility =
      "visible";
  } else {
    document.getElementById("semitransparentLayer").style.visibility = "hidden";
  }
}
function setupTitlePosition() {
  if (p_title.length < 1) {
    titleAllocation = 0;
    contentAllocation = 0.95;
    title_top = 0;
    title_left = 0;
    title_height = 0;
    title_width = 0;
  } else {
    titleAllocation = 0.1;
    contentAllocation = 0.85;
    title_top = canvas_top;
    title_left = canvas_left;
    title_width = canvas_width;
    title_height = parseInt(canvas_height * titleAllocation);
  }
  document.getElementById("presentationTitle").style.left = title_left;
  document.getElementById("presentationTitle").style.top = title_top;
  document.getElementById("presentationTitle").style.width = title_width;
  document.getElementById("presentationTitle").style.height = title_height;
}
function setupContentPosition() {
  var b = p_text1_arr[p_current_index].length;
  var a = p_text2_arr[p_current_index].length;
  if (a < 2) {
    p_text_orientation = 2;
  }
  if (p_text_orientation == "2") {
    c1_top = parseInt(canvas_top) + parseInt(title_height) + 1;
    c1_left = canvas_left;
    c1_width = canvas_width;
    c1_height = parseInt(canvas_height * contentAllocation);
    c2_top = 0;
    c2_left = 0;
    c2_width = 0;
    c2_height = 0;
  } else {
    if (p_text_orientation == "0") {
      var d = contentAllocation;
      var c = contentAllocation;
      var e = b / (b + a);
      d = contentAllocation * e;
      c = contentAllocation - d;
      c1_top = parseInt(canvas_top) + parseInt(title_height) + 1;
      c1_left = canvas_left;
      c1_width = canvas_width;
      c1_height = parseInt(canvas_height * d);
      c2_top = c1_top + c1_height + 1;
      c2_left = canvas_left;
      c2_width = canvas_width;
      c2_height = parseInt(canvas_height * c);
    } else {
      var f = 40;
      c1_top = parseInt(canvas_top) + parseInt(title_height) + 1;
      c1_left = canvas_left;
      c1_width = parseInt(canvas_width / 2) - f / 2;
      c1_height = parseInt(canvas_height * contentAllocation);
      c2_top = parseInt(canvas_top) + parseInt(title_height) + 1;
      c2_left = parseInt(canvas_left) + parseInt(c1_width) + parseInt(f);
      c2_width = parseInt(canvas_width / 2) - f / 2;
      c2_height = parseInt(canvas_height * contentAllocation);
    }
  }
  document.getElementById("content1").style.left = c1_left;
  document.getElementById("content1").style.top = c1_top;
  document.getElementById("content1").style.width = c1_width;
  document.getElementById("content1").style.height = c1_height;
  document.getElementById("content2").style.left = c2_left;
  document.getElementById("content2").style.top = c2_top;
  document.getElementById("content2").style.width = c2_width;
  document.getElementById("content2").style.height = c2_height;
}
function setupFooterPosition() {
  f_height = parseInt(canvas_height * footerAllocation);
  f_top = parseInt(canvas_top) + parseInt(canvas_height) - f_height;
  f_left = canvas_left;
  f_width = canvas_width;
  document.getElementById("footer_date").style.left = f_left;
  document.getElementById("footer_date").style.top = f_top;
  document.getElementById("footer_date").style.width = f_width;
  document.getElementById("footer_date").style.height = f_height;
  document.getElementById("footnote").style.left = f_left;
  document.getElementById("footnote").style.top = f_top;
  document.getElementById("footnote").style.width = f_width;
  document.getElementById("footnote").style.height = f_height;
  document.getElementById("footer_vv").style.left = f_left;
  document.getElementById("footer_vv").style.top = f_top;
  document.getElementById("footer_vv").style.width = f_width;
  document.getElementById("footer_vv").style.height = f_height;
}
function setupRTLClass() {
  if (p_isArabic1) {
    $("#content1").addClass("arabic");
    $("#presentationTitle").addClass("arabic");
  } else {
    $("#content1").removeClass("arabic");
    $("#presentationTitle").removeClass("arabic");
  }
  if (p_isArabic2) {
    $("#content2").addClass("arabic");
  } else {
    $("#content2").removeClass("arabic");
  }
}
function updatePresentation() {
  debugPrintPresent("Updating prestation frames...");
  setupBackground();
  setupRTLClass();
  setupCanvasPosition();
  setupTitlePosition();
  setupContentPosition();
  setupFooterPosition();
}
function get_next_index() {
  var a = p_current_index * 1 + 1;
  if (p_current_index == p_last_index) {
    a = 0;
  }
  return a;
}
function get_prev_index() {
  var a = p_current_index * 1 - 1;
  if (p_current_index == 0) {
    a = p_last_index;
  }
  return a;
}
function nextSlide() {
  p_current_index = get_next_index();
  document.getElementById("content1").style.textShadow = null;
  document.getElementById("content2").style.textShadow = null;
  setupContentPosition();
  if (!showingtheme) {
    updateContentWithAnimation();
  } else {
    showThemeProcess();
    updateContent2();
  }
}
function prevSlide() {
  p_current_index = get_prev_index();
  document.getElementById("content1").style.textShadow = null;
  document.getElementById("content2").style.textShadow = null;
  setupContentPosition();
  if (!showingtheme) {
    updateContentWithAnimation();
  } else {
    showThemeProcess();
    updateContent2();
  }
}
function updateContent() {
  if (!showingtheme) {
    updateContentWithAnimation();
  }
}
function updateContentWithAnimation() {
  var a = $("#presentationContent");
  a.animate({ opacity: "0.0" }, timeValue, "swing", function () {
    updateContent2();
    a.animate({ opacity: "1.0" }, timeValue, "swing");
  });
}
function getDate() {
  var d = new Date();
  var c = d.getHours();
  var b = "";
  var a = " AM";
  if (c == 0) {
    b = 12;
  } else {
    if (c <= 11) {
      b = c;
    } else {
      if (c == 12) {
        b = 12;
        a = " PM";
      } else {
        b = c - 12;
        a = " PM";
      }
    }
  }
  var f = d.getMinutes();
  if (f < 10) {
    f = "0" + f;
  }
  if (p_showDate) {
    document.getElementById("footer_date").innerHTML =
      d.toDateString() + " &nbsp;&nbsp; " + b + ":" + f + a;
  }
  var e = setTimeout(getDate, 5000);
}
function updateContent2() {
  restoreSlideProcess();
  document.getElementById("content1").style.visibility = "hidden";
  document.getElementById("content2").style.visibility = "hidden";
  document.getElementById("content1").innerHTML = "";
  document.getElementById("content2").innerHTML = "";
  if (firstTime) {
    updateContentInitial();
    updateContentStyling();
  } else {
    updateContentStyling();
  }
}
function updateContentInitial() {
  document.getElementById("content1").style.visibility = "hidden";
  document.getElementById("content2").style.visibility = "hidden";
  document.getElementById("content1").innerHTML = p_text1_arr[p_current_index];
  document.getElementById("content2").innerHTML = p_text2_arr[p_current_index];
  firstTime = false;
}
function updateContentStyling() {
  p_font_color_invert = invert_hex_color(p_font_color);
  p_font_color2_invert = invert_hex_color(p_font_color2);
  var b = p_format.mutipleLines;
  if (p_title != "") {
    b = true;
  }
  if (p_title != "") {
    document.getElementById("presentationTitle").innerHTML =
      formatReferenceWithFonts(p_title, p_text1_font, p_text2_font);
    document.getElementById("presentationTitle").style.color = p_font_color;
    setTimeout(function () {
      textFit(document.getElementsByClassName("box3"), {
        alignVert: true,
        detectMultiLine: false,
        multiLine: p_format.mutipleLines,
        minFontSize: 30,
        maxFontSize: p_maxFontSize * 1,
        alignVertWithFlexbox: false,
      });
      document.getElementById("presentationTitle").style.visibility = "visible";
    }, initialRenderDelay);
  } else {
    document.getElementById("presentationTitle").innerHTML = "";
    document.getElementById("presentationTitle").style.visibility = "hidden";
  }
  document.getElementById("footnote").innerHTML = p_footnote;
  document.getElementById("footnote").style.color = p_font_color;
  if (p_showLogo) {
    document.getElementById("footer_vv").innerHTML = p_logo;
    document.getElementById("footer_vv").style.color = p_font_color;
  }
  document.getElementById("footer_vv").style.textShadow =
    "2px 2px 3px #" +
    p_font_color_invert +
    ", -2px -2px 3px #" +
    p_font_color_invert;
  document.getElementById("footer_date").style.textShadow =
    "2px 2px 3px #" +
    p_font_color_invert +
    ", -2px -2px 3px #" +
    p_font_color_invert;
  if (p_enableShadow) {
    document.getElementById("footnote").style.textShadow =
      "2px 2px 3px #" +
      p_font_color_invert +
      ", -2px -2px 3px #" +
      p_font_color_invert;
  }
  document.getElementById("content1").style.textAlign = p_align;
  document.getElementById("content2").style.textAlign = p_align;
  document.getElementById("content1").style.fontFamily = p_text1_font;
  document.getElementById("content2").style.fontFamily = p_text2_font;
  document.getElementById("content1").style.color = p_font_color;
  document.getElementById("content2").style.color = p_font_color2;
  document.getElementById("content1").innerHTML = p_text1_arr[p_current_index];
  if (p_text_orientation != "2") {
    document.getElementById("content2").innerHTML =
      p_text2_arr[p_current_index];
  }
  setTimeout(function () {
    textFit(document.getElementsByClassName("box1"), {
      alignVert: true,
      detectMultiLine: false,
      multiLine: b,
      minFontSize: 30,
      maxFontSize: p_maxFontSize * 1,
      reProcess: true,
      alignVertWithFlexbox: false,
    });
    if (p_text_orientation != "2") {
      textFit(document.getElementsByClassName("box2"), {
        alignVert: true,
        detectMultiLine: false,
        multiLine: b,
        minFontSize: 30,
        maxFontSize: p_maxFontSize * 1,
        alignVertWithFlexbox: false,
      });
    }
    if (p_enableShadow) {
      a();
    }
    document.getElementById("content1").style.visibility = "visible";
    document.getElementById("content2").style.visibility = "visible";
    initialRenderDelay = 100;
  }, initialRenderDelay);
  function a() {
    outlineThickness = getOutlineThickness(
      p_text1_arr[p_current_index],
      p_text1_font
    );
    document.getElementById("content1").style.webkitTextStroke =
      outlineThickness + "px #" + p_font_color_invert;
    outlineThickness = getOutlineThickness(
      p_text2_arr[p_current_index],
      p_text2_font
    );
    document.getElementById("content2").style.webkitTextStroke =
      outlineThickness + "px #" + p_font_color2_invert;
    document.getElementById("presentationTitle").style.webkitTextStroke =
      outlineThickness + "px #" + p_font_color2_invert;
  }
}
function getOutlineThickness(b, c, d) {
  if (b == null) {
    return 0;
  }
  var a = b.length;
  if (parseInt(p_maxFontSize) < 48) {
    return 0.5;
  }
  if (c == "Malayalam") {
    return 0;
  }
  if (d != null) {
    if (d > 100) {
      return 2;
    } else {
      if (d > 80) {
        return 1;
      } else {
        return 0.5;
      }
    }
  } else {
    if (a > 100) {
      return 1;
    } else {
      return 1;
    }
  }
}
function showThemeProcess() {
  if (!showingtheme) {
    showingtheme = true;
    $("#presentationTitle").hide();
    $("#content1").hide();
    $("#content2").hide();
    $("#footnote").hide();
  } else {
    showingtheme = false;
    $("#presentationTitle").show();
    $("#content1").show();
    $("#content2").show();
    $("#footnote").show();
  }
}
function showBlankProcess() {
  document.getElementById("presentationTitle").innerHTML = "";
  document.getElementById("content1").innerHTML = "";
  document.getElementById("content2").innerHTML = "";
  document.getElementById("footnote").innerHTML = "";
  $("#backgroundLayer").css("background-color", "black");
  $("#backgroundImage").hide();
}
function restoreSlideProcess() {
  $("#backgroundImage").show();
}
function findKey(a) {
  key = a.keyCode;
  switch (key) {
    case 27:
      clearPresenter();
      break;
    case 39:
    case 40:
    case 34:
      if (!showingtheme) {
        nextSlide();
        window.parent.goToNextSlide();
      }
      break;
    case 37:
    case 38:
    case 33:
      if (!showingtheme) {
        prevSlide();
        window.parent.goToPrevSlide();
      }
      break;
    case 84:
      showThemeProcess();
      break;
    default:
      break;
  }
}
function savePresentationMargin() {
  var k = true;
  var e = document.getElementById("presentConfigMarginTop").value;
  var c = document.getElementById("presentConfigMarginBottom").value;
  var f = document.getElementById("presentConfigMarginLeft").value;
  var n = document.getElementById("presentConfigMarginRight").value;
  if (IsNumeric(e) && IsNumeric(c) && IsNumeric(f) && IsNumeric(n)) {
    vvConfigObj.set_p_topMargin(e);
    vvConfigObj.set_p_bottomMargin(c);
    vvConfigObj.set_p_leftMargin(f);
    vvConfigObj.set_p_rightMargin(n);
  } else {
    k = false;
    alert("Invalid entry for margin");
    document.getElementById("presentConfigMarginTop").value =
      vvConfigObj.get_p_topMargin();
    document.getElementById("presentConfigMarginBottom").value =
      vvConfigObj.get_p_bottomMargin();
    document.getElementById("presentConfigMarginLeft").value =
      vvConfigObj.get_p_leftMargin();
    document.getElementById("presentConfigMarginRight").value =
      vvConfigObj.get_p_rightMargin();
  }
  var v = document.getElementById("presentConfigMaxFontSize").value;
  if (IsNumeric(v)) {
    if (withinRange(30, 200, v)) {
      vvConfigObj.set_p_maxFontSize(v);
    } else {
      k = false;
      alert("Maximum font size value out of Range");
      document.getElementById("presentConfigMaxFontSize").value =
        vvConfigObj.get_p_maxFontSize();
    }
  } else {
    k = false;
    alert("Invalid maximum font size value.");
    document.getElementById("presentConfigMaxFontSize").value =
      vvConfigObj.get_p_maxFontSize();
  }
  var l = document.getElementById("presentConfigEnableTransition").checked;
  vvConfigObj.set_p_enableTransition(l);
  var d = document.getElementById("presentConfigEnableSongTitle").checked;
  vvConfigObj.set_p_showTitle(d);
  var g = document.getElementById("presentConfigEnableShadow").checked;
  vvConfigObj.set_p_enableShadow(g);
  var q = document.getElementById("justify_left").checked;
  var z = document.getElementById("justify_center").checked;
  var a = document.getElementById("justify_right").checked;
  var i = "left";
  if (z) {
    i = "center";
  }
  if (a) {
    i = "right";
  }
  vvConfigObj.set_p_align(i);
  var y = document.getElementById("porient_hori").checked;
  var h = document.getElementById("porient_vert").checked;
  var r = "0";
  if (h) {
    r = "1";
  }
  p_text_orientation = r;
  vvConfigObj.set_p_text_orientation(p_text_orientation);
  var p = document.getElementById("showPrimaryFont").checked;
  if (p) {
    vvConfigObj.set_song_primaryOnly("true");
  } else {
    vvConfigObj.set_song_primaryOnly("false");
  }
  var y = document.getElementById("porient_song_hori").checked;
  var h = document.getElementById("porient_song_vert").checked;
  var r = "0";
  if (h) {
    r = "1";
  }
  p_song_text_orientation = r;
  vvConfigObj.set_song_text_orientation(p_song_text_orientation);
  var x = document.getElementById("customLogoText1").value;
  var w = document.getElementById("customLogoText2").value;
  vvConfigObj.set_logoText1(x);
  vvConfigObj.set_logoText2(w);
  var t = document.getElementById("presentConfigShowDateTime").checked;
  var m = document.getElementById("presentConfigShowVVLogo").checked;
  var s = document.getElementById("presentConfigShowCustomLogo").checked;
  vvConfigObj.set_showDateTime(t);
  vvConfigObj.set_showVVLogo(m);
  vvConfigObj.set_showCustomLogo(s);
  var j = document.getElementById("presentConfigOntop").checked;
  vvConfigObj.set_presentationOnTop(j);
  var u = document.getElementById("show2LinesSlides").checked;
  vvConfigObj.set_show2lines(u);
  var o = document.getElementById("hideStanzaNumber").checked;
  vvConfigObj.set_hideStanzaNumber(o);
  var b = document.getElementById("fitLineSetup").checked;
  vvConfigObj.set_pformat_multiplelines(b);
  if (k) {
    vvConfigObj.save();
  }
}
function initTransition(a) {
  timeValue = 0;
  if (a) {
    timeValue = timeValueDefault;
  }
}
function zoompan(c) {
  var b = new Image();
  var a = 1;
  b.onload = function () {
    var g = b.height;
    var k = b.width;
    var j = air.Screen.screens;
    var h = j[0].bounds.width;
    var f = j[0].bounds.height;
    var e = h / k;
    var i = f / g;
    a = e;
    if (i > e) {
      a = i;
    }
    d();
  };
  b.src = c;
  function d() {
    var e = 13;
    jQuery.fx.interval = 80;
    $("#backgroundLayer").crossSlide(
      { fade: 1 },
      [
        {
          src: c,
          alt: "",
          from:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            a +
            "x",
          to:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% 3x",
          time: e,
        },
        {
          src: c,
          alt: "",
          from:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            a +
            "x",
          to:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% 3x",
          time: e,
        },
        {
          src: c,
          alt: "",
          from:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            a +
            "x",
          to:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% 3x",
          time: e,
        },
        {
          src: c,
          alt: "",
          from:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            a +
            "x",
          to:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% 3x",
          time: e,
        },
        {
          src: c,
          alt: "",
          from:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            a +
            "x",
          to:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% 3x",
          time: e,
        },
        {
          src: c,
          alt: "",
          from:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            a +
            "x",
          to:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% 3x",
          time: e,
        },
        {
          src: c,
          alt: "",
          from:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            a +
            "x",
          to:
            Math.floor(Math.random() * 100 + 1) +
            "% " +
            Math.floor(Math.random() * 100 + 1) +
            "% 3x",
          time: e,
        },
      ],
      function (f, g, h, i) {
        if (h == undefined) {
          $("div.caption").text(g.alt).animate({ opacity: 0.7 });
        } else {
          $("div.caption").fadeOut();
        }
      }
    );
  }
}
function formatReferenceWithFonts(i, c, b) {
  var h = "";
  var a = i.split(")");
  if (a[1] != null) {
    var f = a[1];
    var g = a[0].split("(");
    var e = g[0];
    var d = g[1];
    h += '<span style="font-family:' + c + ';">' + e + "</span>";
    h += '<span style="font-family:' + b + ';"> (' + d + ") </span>";
    h += '<span style="font-family:' + c + ';">' + f + "</span>";
  } else {
    h += '<span style="font-family:' + c + ';">' + i + "</span>";
  }
  return h;
}
function invert_hex_color(d) {
  var e = "0123456789ABCDEF";
  function c(f) {
    return e.charAt((f >> 4) & 15) + e.charAt(f & 15);
  }
  function b(f) {
    f = f.toUpperCase();
    return parseInt(f, 16);
  }
  function a(h) {
    var f = h;
    if (f.toString().length < 6 || f.toString().length > 6) {
      f = f.toString(16);
    }
    hex1 = f.slice(0, 2);
    hexb1 = f.slice(2, 4);
    hexc1 = f.slice(4, 6);
    hex2 = 16 * b(hex1.slice(0, 1));
    hex3 = b(hex1.slice(1, 2));
    hex1 = hex1 + hex2;
    hexb2 = 16 * b(hexb1.slice(0, 1));
    hexb3 = b(hexb1.slice(1, 2));
    hexb1 = hexb2 + hexb3;
    hexc2 = 16 * b(hexc1.slice(0, 1));
    hexc3 = b(hexc1.slice(1, 2));
    hexc1 = hexc2 + hexc3;
    var g = c(255 - hex1) + "" + c(255 - hexb1) + "" + c(255 - hexc1);
    return g;
  }
  return a(d);
}
function debugPrintPresent(a) {
  if (presentDebug) {
    air.trace("[presentation3.js]: " + a);
  }
}
