function textColorClass() {
  this.init = l;
  this.assignTextColor = e;
  this.assignTextColor2 = k;
  var i;
  var f;
  function l() {
    b();
    d();
    g();
    h();
  }
  function b() {
    var m = vvConfigObj.get_p_textColor();
    if (m != null) {
      i = m;
    } else {
      i = "#FFFFFF";
    }
  }
  function d() {
    var m = vvConfigObj.get_p_textColor2();
    if (m != null) {
      f = m;
    } else {
      f = "#FFFFFF";
    }
  }
  function h() {
    document
      .getElementById("changeTextColorButton")
      .addEventListener("click", a, false);
    document
      .getElementById("resetTextColorButton")
      .addEventListener("click", j, false);
  }
  function a() {
    var m = new colorPickerPanel();
    m.init(i, 0);
  }
  function e(m) {
    i = m;
    g();
    c();
  }
  function k(m) {
    f = m;
    c();
  }
  function j() {
    i = "#FFFFFF";
    f = "#FFFFFF";
    g();
    c();
  }
  function g() {
    document.getElementById("graphics_text_color_id").style.background = i;
  }
  function c() {
    vvConfigObj.set_p_textColor(i);
    vvConfigObj.set_p_textColor2(f);
    vvConfigObj.save();
  }
}