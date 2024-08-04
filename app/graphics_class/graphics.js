function graphicsClass() {
  this.init = r;
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
  function r(x) {
    document.getElementById("graphicsTab").innerHTML = x;
    $("#bkgnd_motion").hide();
    $("#motion_bkgnddiv").hide();
    n = new textColorClass();
    n.init();
    p = new solidBkgndColorClass();
    p.init();
    e = new gradBkgndColorClass();
    e.init();
    f = new bkgndClass();
    f.init();
    d();
    k();
    s();
  }
  function d() {
    var x = vvConfigObj.get_p_bkgnd_type();
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
  function k() {}
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
      vvConfigObj.set_p_bkgnd_type(1);
      vvConfigObj.save();
    }
    if (A) {
      document.getElementById("solid_bkgnddiv").style.visibility = "hidden";
      document.getElementById("graident_bkgnddiv").style.visibility = "visible";
      document.getElementById("still_bkgnddiv").style.visibility = "hidden";
      document.getElementById("motion_bkgnddiv").style.visibility = "hidden";
      vvConfigObj.set_p_bkgnd_type(2);
      vvConfigObj.save();
    }
    if (x) {
      document.getElementById("solid_bkgnddiv").style.visibility = "hidden";
      document.getElementById("graident_bkgnddiv").style.visibility = "hidden";
      document.getElementById("still_bkgnddiv").style.visibility = "visible";
      document.getElementById("motion_bkgnddiv").style.visibility = "hidden";
      vvConfigObj.set_p_bkgnd_type(3);
      vvConfigObj.save();
    }
    if (z) {
      document.getElementById("solid_bkgnddiv").style.visibility = "hidden";
      document.getElementById("graident_bkgnddiv").style.visibility = "hidden";
      document.getElementById("still_bkgnddiv").style.visibility = "hidden";
      document.getElementById("motion_bkgnddiv").style.visibility = "visible";
      vvConfigObj.set_p_bkgnd_type(4);
      vvConfigObj.save();
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
    var x = new colorPickerPanel();
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
