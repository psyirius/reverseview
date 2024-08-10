var presentWindowOpen = false;
var pWindowX = "100";
var pWindowY = "100";
var stageViewWindowX = "100";
var stageViewWindowY = "100";
var dualScreen = true;
var screenList = null;
var stageView = false;
var stageViewScreenIndex = 2;
var newWindow = null;
var newStageWindow = null;
var index_for_presentationContent = 0;
function getCurrentScreen() {
  var b;
  var a = air.Screen.getScreensForRectangle(window.nativeWindow.bounds);
  a.length > 0 ? (b = a[0]) : (b = air.Screen.mainScreen);
  return b;
}
function getScreenList() {
  screenList = air.Screen.screens;
}
function fillScreenList() {
  var f = screenList.length;
  var c = "";
  var b, e;
  var a, g;
  clearSelectList("selectScreenID");
  clearSelectList("selectStageScreenID");
  for (var d = 0; d < f; d++) {
    b = screenList[d].bounds.width;
    e = screenList[d].bounds.height;
    a = screenList[d].bounds.x;
    g = screenList[d].bounds.y;
    c = "Screen  " + (d + 1) + " " + b + "x" + e + " @ " + a + "," + g;
    document.getElementById("selectScreenID").options[d] = new Option(c, d);
    document.getElementById("selectStageScreenID").options[d] = new Option(
      c,
      d
    );
  }
  setScreenIndex($RvW.vvConfigObj.get_selectedScreenIndex(), f);
  setStageScreenIndex($RvW.vvConfigObj.get_selectedStageScreenIndex(), f);
}
function getSelectedScreenIndex() {
  var a = document.getElementById("selectScreenID").selectedIndex;
  $RvW.vvConfigObj.set_selectedScreenIndex(a);
}
function getSelectedStageScreenIndex() {
  var a = document.getElementById("selectStageScreenID").selectedIndex;
  $RvW.vvConfigObj.set_selectedStageScreenIndex(a);
}
function setScreenIndex(a, b) {
  if (a < b) {
    document.getElementById("selectScreenID").selectedIndex = a;
  } else {
    document.getElementById("selectScreenID").selectedIndex = 0;
  }
}
function setStageScreenIndex(a, b) {
  if (a < b) {
    document.getElementById("selectStageScreenID").selectedIndex = a;
  } else {
    document.getElementById("selectStageScreenID").selectedIndex = 0;
  }
}
function addScreenSelectionEvent() {
  document
    .getElementById("selectScreenID")
    .addEventListener("change", processScreenSelChange, false);
  document
    .getElementById("selectStageScreenID")
    .addEventListener("change", processStageScreenSelChange, false);
}
function processScreenSelChange() {
  getSelectedScreenIndex();
  $RvW.vvConfigObj.save();
}
function processStageScreenSelChange() {
  getSelectedStageScreenIndex();
  $RvW.vvConfigObj.save();
}
function presentation() {
  stageView = $("#stageConfigEnable").is(":checked");
  var k = new air.NativeWindowInitOptions();
  k.systemChrome = "none";
  k.type = "lightweight";
  k.transparent = true;
  var g = getCurrentScreen();
  var j = air.Screen.screens;
  var c;
  var i;
  stageViewScreenIndex = $RvW.vvConfigObj.get_selectedStageScreenIndex();
  if (j[stageViewScreenIndex] == null) {
    stageViewScreenIndex = 0;
    $RvW.vvConfigObj.set_selectedStageScreenIndex(stageViewScreenIndex);
  }
  stageView = stageView && j[stageViewScreenIndex] != null;
  var e = $RvW.vvConfigObj.get_selectedScreenIndex();
  if (j[e] == null) {
    e = 0;
    $RvW.vvConfigObj.set_selectedScreenIndex(e);
  }
  if (dualScreen && j[e] != null) {
    c = j[e].bounds;
    pWindowX = j[e].bounds.width;
    pWindowY = j[e].bounds.height;
  } else {
    c = j[0].bounds;
    pWindowX = j[0].bounds.width;
    pWindowY = j[0].bounds.height;
    air.trace("p window singl " + pWindowX + " " + pWindowY);
  }
  if (!presentWindowOpen) {
    newWindow = air.HTMLLoader.createRootWindow(true, k, true, c);
    var b = $("#mainConfigEnable").is(":checked");
    newWindow.visible = b;
    newWindow.addEventListener("htmlDOMInitialize", DOMIntializeCallback);
    newWindow.window.nativeWindow.addEventListener(
      air.Event.CLOSE,
      presentWindowClosed
    );
    newWindow.window.nativeWindow.alwaysInFront =
      $RvW.vvConfigObj.get_presentationOnTop();
    newWindow.window.nativeWindow.stage.frameRate = 30;
    newWindow.load(new air.URLRequest("presentation.htm"));
    newWindow.window.iamclosingStage = function () {
      if (stageView && newStageWindow != null) {
        newStageWindow.window.nativeWindow.close();
      }
    };
    newWindow.window.goToNextSlide = function () {
      if (stageView && newStageWindow != null) {
        newStageWindow.window.nextSlide();
      }
      updatePresentationContent(true);
    };
    newWindow.window.goToPrevSlide = function () {
      if (stageView && newStageWindow != null) {
        newStageWindow.window.prevSlide();
      }
      updatePresentationContent(false);
    };
    if (stageView) {
      var h = new air.NativeWindowInitOptions();
      var a = $RvW.vvConfigObj.get_svWindow();
      i = j[stageViewScreenIndex].bounds;
      if (a) {
        h.resizable = false;
        h.maximizable = false;
        h.minimizable = false;
        var f = $("#stageviewMiniWindow").is(":checked");
        if (j[stageViewScreenIndex].bounds.width < 1900) {
          i.width = 1280 / 2;
          i.height = 720 / 2;
        } else {
          i.width = 1280;
          i.height = 720;
        }
        if (f) {
          i.width /= 1.5;
          i.height /= 1.5;
        }
      } else {
        h.systemChrome = "none";
        h.type = "lightweight";
        h.transparent = true;
        h.renderMode = "direct";
      }
      stageViewWindowX = j[stageViewScreenIndex].bounds.width;
      stageViewWindowY = j[stageViewScreenIndex].bounds.height;
      newStageWindow = air.HTMLLoader.createRootWindow(true, h, true, i);
      newStageWindow.addEventListener(
        "htmlDOMInitialize",
        DOMIntializeStageViewCallback
      );
      newStageWindow.window.nativeWindow.addEventListener(
        air.Event.CLOSING,
        closePresentWindowMain
      );
      newStageWindow.window.nativeWindow.alwaysInFront = false;
      newStageWindow.window.nativeWindow.stage.frameRate = 30;
      newStageWindow.load(new air.URLRequest("stageview.htm"));
      newStageWindow.window.iamclosingPresentation = function () {
        if (newWindow != null) {
          newWindow.window.nativeWindow.close();
        }
      };
    } else {
      newStageWindow = null;
    }
    presentWindowOpen = true;
  } else {
    try {
      newWindow.window.passVariable(0);
      newWindow.window.updatePresentation();
      newWindow.window.updateContent();
    } catch (d) {
      air.trace("Possible double click... NewWindow is still getting ready..");
    }
    if (stageView && newStageWindow != null) {
      try {
        newStageWindow.window.passVariable(1);
        newStageWindow.window.updatePresentation();
        newStageWindow.window.updateContent();
      } catch (d) {
        air.trace(
          "Possible double click... NewStageWindow is still getting ready.."
        );
      }
    }
  }
}
function closePresentWindowMain() {
  if (presentWindowOpen) {
    newWindow.window.nativeWindow.close();
    newWindow = null;
    if (!$RvW.vvConfigObj.get_mainConfigEnable()) {
      presentWindowOpen = false;
    }
  }
  if (stageView && newStageWindow != null) {
    newStageWindow.window.nativeWindow.close();
    newStageWindow = null;
  }
  presentationContent = "";
}
function presentWindowClosed() {
  presentWindowOpen = false;
  newWindow = null;
  disableNavButtons(true);
}
function DOMIntializeCallback(a) {
  newWindow.window.passVariable = passVariable;
}
function DOMIntializeStageViewCallback(a) {
  newStageWindow.window.passVariable = passVariable;
}
function passVariable(o) {
  presentationContent = presentationContentString(
    p_title,
    p_text1_font,
    p_text2_font,
    p_text1_arr[p_current_index],
    p_text2_arr[p_current_index]
  );
  index_for_presentationContent = p_current_index;
  this.p_text1_arr = p_text1_arr;
  this.p_text2_arr = p_text2_arr;
  this.p_text1_font = p_text1_font;
  this.p_text2_font = p_text2_font;
  this.p_title = p_title;
  this.p_footnote = p_footnote;
  this.p_current_index = p_current_index;
  this.p_last_index = p_last_index;
  this.p_bkgnd_filename = p_bkgnd_filename;
  this.p_bkgnd_motion = p_bkgnd_motion;
  this.p_bkgnd_color = $RvW.vvConfigObj.get_p_solidBkgndColor();
  this.p_font_color = p_font_color;
  this.p_font_color2 = p_font_color2;
  this.p_format_multiplelines = $RvW.vvConfigObj.get_pformat_multiplelines();
  if (o == 1) {
    var f = $("#thirdview_fcolor").val();
    this.p_font_color = $RvW.colorChart[f];
    this.p_font_color2 = $RvW.colorChart[f];
  }
  this.p_bkgnd_color1 = $RvW.vvConfigObj.get_p_bkgnd_color1();
  this.p_bkgnd_color2 = $RvW.vvConfigObj.get_p_bkgnd_color2();
  this.p_bkgnd_grad_orient = $RvW.vvConfigObj.get_p_bkgnd_grad_orient();
  this.p_motion_bkgnd_index = $RvW.vvConfigObj.get_p_motion_bkgnd_index();
  this.p_bkgnd_type = $RvW.vvConfigObj.get_p_bkgnd_type();
  if (o == 1) {
    var v = $RvW.vvConfigObj.get_stageStyleVal();
    if (v != "3") {
      if (p_text_orientation == "2") {
        v = "2";
      }
    }
    var j = $("#thirdview_opacity").val();
    var r = $("#thirdview_height").val();
    var s = $("#thirdview_primary").prop("checked");
    var l = $("#thirdview_secondary").prop("checked");
    var g = $RvW.vvConfigObj.get_svBcolor();
    var p = $RvW.vvConfigObj.get_svPosition();
    var i = $RvW.vvConfigObj.get_svMaxFontSize();
    var d = $RvW.vvConfigObj.get_svTextOutline();
    var e = $RvW.vvConfigObj.get_svTextShadow();
    var c = $RvW.vvConfigObj.get_svGreenWindow();
    var n = $RvW.vvConfigObj.get_svAlignLeft();
    var k = $RvW.vvConfigObj.get_svAlignCenter();
    var q = $RvW.vvConfigObj.get_svAddTexture();
    var h = $RvW.vvConfigObj.get_svShowHorizontal();
    var m =
      v +
      "|" +
      j +
      "|" +
      r +
      "|" +
      s +
      "|" +
      $RvW.colorChart[g] +
      "|" +
      p +
      "|" +
      i +
      "|" +
      d +
      "|" +
      e +
      "|" +
      c;
    m = m + "|" + n + "|" + k + "|" + q + "|" + h + "|" + l;
    this.p_text_orientation = m;
  } else {
    this.p_text_orientation = p_text_orientation;
  }
  this.p_window_X = pWindowX;
  this.p_window_Y = pWindowY;
  if (o == 1) {
    this.p_window_X = stageViewWindowX;
    this.p_window_Y = stageViewWindowY;
  }
  this.p_topMargin = $RvW.vvConfigObj.get_p_topMargin();
  this.p_bottomMargin = $RvW.vvConfigObj.get_p_bottomMargin();
  this.p_leftMargin = $RvW.vvConfigObj.get_p_leftMargin();
  this.p_rightMargin = $RvW.vvConfigObj.get_p_rightMargin();
  this.p_maxFontSize = $RvW.vvConfigObj.get_p_maxFontSize();
  this.p_enableTransition = $RvW.vvConfigObj.get_p_enableTransition();
  this.p_showTitle = $RvW.vvConfigObj.get_p_showTitle();
  this.p_enableShadow = $RvW.vvConfigObj.get_p_enableShadow();
  this.p_align = $RvW.vvConfigObj.get_p_align();
  if ($RvW.vvConfigObj.get_showVVLogo()) {
    this.p_logo = "ReVerseVIEW<br>reverseview.github.io";
  } else {
    this.p_logo =
      $RvW.vvConfigObj.get_logoText1() + "<br>" + $RvW.vvConfigObj.get_logoText2();
  }
  if (o == 1) {
    this.p_showDate = $RvW.vvConfigObj.get_svShowDate();
  } else {
    this.p_showDate = $RvW.vvConfigObj.get_showDateTime();
  }
  this.p_showLogo =
    $RvW.vvConfigObj.get_showVVLogo() || $RvW.vvConfigObj.get_showCustomLogo();
  this.p_shadeBackground = $RvW.graphicsObj.getShadeFlag();
  this.p_transparentBackground = $RvW.graphicsObj.getTransparentFlag();
  this.p_ver1ScaleFactor = p_ver1ScaleFactor;
  this.p_ver2ScaleFactor = p_ver2ScaleFactor;
  this.p_isArabic1 = false;
  this.p_isArabic2 = false;
  var t = bibleVersionArray[$RvW.vvConfigObj.get_version1()][0];
  var u = t.indexOf("Arabic");
  if (u != -1) {
    this.p_isArabic1 = true;
  }
  var t = bibleVersionArray[$RvW.vvConfigObj.get_version2()][0];
  var u = t.indexOf("Arabic");
  if (u != -1) {
    this.p_isArabic2 = true;
  }
}
function updatePresentationContent(b) {
  var a = p_text1_arr.length;
  if (b) {
    index_for_presentationContent++;
    if (index_for_presentationContent >= a) {
      index_for_presentationContent = 0;
    }
  } else {
    index_for_presentationContent--;
    if (index_for_presentationContent < 0) {
      index_for_presentationContent = a - 1;
    }
  }
  presentationContent = presentationContentString(
    p_title,
    p_text1_font,
    p_text2_font,
    p_text1_arr[index_for_presentationContent],
    p_text2_arr[index_for_presentationContent]
  );
}
function call_nextSlide() {
  if (presentWindowOpen) {
    newWindow.window.nextSlide();
    if (stageView) {
      newStageWindow.window.nextSlide();
    }
  }
  updatePresentationContent(true);
}
function call_prevSlide() {
  if (presentWindowOpen) {
    newWindow.window.prevSlide();
    if (stageView) {
      newStageWindow.window.prevSlide();
    }
  }
  updatePresentationContent(false);
}
function call_showTheme() {
  if (newWindow != null) {
    newWindow.window.showThemeProcess();
  }
}
function call_closePresentation() {
  if (presentWindowOpen) {
    newWindow.window.clearPresenter();
    if (stageView) {
      newStageWindow.window.nativeWindow.close();
    }
  }
  presentationContent = "";
}