function solidBkgndColorClass() {
  this.init = k;
  this.assignSolidColor = j;
  var e;
  var a = true;
  function k() {
    c();
    g();
  }
  function c() {
    var l = $RvW.vvConfigObj.get_p_solidBkgndColor();
    b("Color from config file... " + l);
    if (l != null) {
      e = l;
    } else {
      e = "#000000";
    }
    f();
  }
  function g() {
    document
      .getElementById("changeBkgndColorButton")
      .addEventListener("click", h, false);
    document
      .getElementById("resetBkgndColorButton")
      .addEventListener("click", i, false);
  }
  function h() {
    var l = new colorPickerPanel();
    l.init(e, 1);
  }
  function j(l) {
    e = l;
    f();
    d();
  }
  function i() {
    e = "#000000";
    f();
    d();
  }
  function f() {
    b("change box color: " + e);
    document.getElementById("graphics_solid_color_id").style.background = e;
  }
  function d() {
    $RvW.vvConfigObj.set_p_solidBkgndColor(e);
    $RvW.vvConfigObj.save();
  }
  function b(l) {
    if (a) {
      air.trace("[Graphics Solid Bkgnd]: " + l);
    }
  }
}