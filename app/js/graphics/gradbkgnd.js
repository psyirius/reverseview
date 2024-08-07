function gradBkgndColorClass() {
  this.init = q;
  this.assignGradColor1 = l;
  this.assignGradColor2 = j;
  var p;
  var n;
  var f;
  var c = false;
  function q() {
    e();
    m();
  }
  function e() {
    var r = vvConfigObj.get_p_bkgnd_color1();
    d("Color 1 from config file... " + r);
    if (r != null) {
      p = r;
    } else {
      p = "#000000";
    }
    var r = vvConfigObj.get_p_bkgnd_color2();
    d("Color 2 from config file... " + r);
    if (r != null) {
      n = r;
    } else {
      n = "#FFFFFF";
    }
    var s = vvConfigObj.get_p_bkgnd_grad_orient();
    d("Orientation of gradient... " + s);
    if (s != null) {
      f = s;
    } else {
      f = 0;
    }
    o(f);
    k();
  }
  function m() {
    document
      .getElementById("changeGradColor1Button")
      .addEventListener("click", h, false);
    document
      .getElementById("changeGradColor2Button")
      .addEventListener("click", g, false);
    document
      .getElementById("resetGradColorButton")
      .addEventListener("click", i, false);
    document
      .getElementById("orientGradListID")
      .addEventListener("change", a, false);
  }
  function h() {
    var r = new colorPickerPanel();
    r.init(p, 2);
  }
  function g() {
    var r = new colorPickerPanel();
    r.init(n, 3);
  }
  function a() {
    f = document.getElementById("orientGradListID").selectedIndex;
    k();
    b();
  }
  function l(r) {
    d("assigning color 1 for gradient: " + r);
    p = r;
    k();
    b();
  }
  function j(r) {
    n = r;
    k();
    b();
  }
  function i() {
    p = "000000";
    n = "FFFFFF";
    f = 0;
    o(f);
    k();
    b();
  }
  function o(r) {
    document.getElementById("orientGradListID").selectedIndex = r;
  }
  function k() {
    d("change box color 1: " + p);
    d("change box color 2: " + n);
    d("change box Orientation: " + f);
    var r = "";
    switch (f * 1) {
      case 3:
        r = r + "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#";
        break;
      case 1:
        r = r + "-webkit-gradient(linear, 0% 0%, 100% 0%, from(#";
        break;
      case 2:
        r = r + "-webkit-gradient(linear, 0% 100%, 0% 0%, from(#";
        break;
      case 0:
        r = r + "-webkit-gradient(linear, 100% 0%, 0% 0%, from(#";
        break;
      default:
        r = r + "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#";
    }
    r = r + p + "), to(#" + n + "))";
    document.getElementById("graphics_grad_color_id").style.backgroundImage =
      "url()";
    document.getElementById("graphics_grad_color_id").style.backgroundImage = r;
  }
  function b() {
    vvConfigObj.set_p_bkgnd_color1(p);
    vvConfigObj.set_p_bkgnd_color2(n);
    vvConfigObj.set_p_bkgnd_grad_orient(f);
    vvConfigObj.save();
  }
  function d(r) {
    if (c) {
      air.trace("[Graphics Gradient Bkgnd]: " + r);
    }
  }
}