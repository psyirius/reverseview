function chordsVirtualKeyboard() {
  this.init = M;
  this.show = F;
  this.hide = L;
  this.edit = q;
  this.get_txt = K;
  this.clearRecent = c;
  var B = "";
  var P = "";
  var l = "";
  var z = "";
  var H = new Array();
  var s = new Array();
  var Q = "";
  var n = 0;
  var i = false;
  var w = false;
  var x = false;
  var b = false;
  var k = false;
  var f = 0;
  var C = 0;
  var d = false;
  var y = null;
  var r = false;
  function M(R) {
    P = R;
    a();
    h();
    g();
    l = $("#newChord");
    l.html("");
  }
  function F() {
    y.show();
    h();
    i = true;
    k = true;
  }
  function L() {
    y.hide();
  }
  function g() {
    $("#ch_key_m1").on("click", function () {
      if ($("#ch_key_m1").text() == "") {
        return;
      }
      H.push($("#ch_key_m1").text());
      j();
      h();
    });
    $("#ch_key_m2").on("click", function () {
      if ($("#ch_key_m2").text() == "") {
        return;
      }
      H.push($("#ch_key_m2").text());
      j();
      h();
    });
    $("#ch_key_m3").on("click", function () {
      if ($("#ch_key_m3").text() == "") {
        return;
      }
      H.push($("#ch_key_m3").text());
      j();
      h();
    });
    $("#ch_key_m4").on("click", function () {
      if ($("#ch_key_m4").text() == "") {
        return;
      }
      H.push($("#ch_key_m4").text());
      j();
      h();
    });
    $("#ch_key_m5").on("click", function () {
      if ($("#ch_key_m5").text() == "") {
        return;
      }
      H.push($("#ch_key_m5").text());
      j();
      h();
    });
    $("#ch_key_C").on("click", function () {
      N("C");
    });
    $("#ch_key_D").on("click", function () {
      N("D");
    });
    $("#ch_key_E").on("click", function () {
      N("E");
    });
    $("#ch_key_F").on("click", function () {
      N("F");
    });
    $("#ch_key_G").on("click", function () {
      N("G");
    });
    $("#ch_key_A").on("click", function () {
      N("A");
    });
    $("#ch_key_B").on("click", function () {
      N("B");
    });
    $("#ch_key_minor").on("click", function () {
      o("m");
    });
    $("#ch_key_flat").on("click", function () {
      p("b");
    });
    $("#ch_key_sharp").on("click", function () {
      p("#");
    });
    $("#ch_key_slash").on("click", function () {
      D("/");
    });
    $("#ch_key_sus2").on("click", function () {
      o("sus2");
    });
    $("#ch_key_sus4").on("click", function () {
      o("sus4");
    });
    $("#ch_key_7").on("click", function () {
      o("7");
    });
    $("#ch_key_9").on("click", function () {
      o("9");
    });
    $("#ch_key_dim").on("click", function () {
      o("dim");
    });
    $("#ch_key_clear").on("click", function () {
      H = new Array();
      j();
      h();
      i = true;
      k = true;
    });
    $("#ch_key_cancel").on("click", function () {
      H = new Array();
      j();
      L();
    });
    $("#ch_key_add").on("click", function () {
      O();
    });
    $("#ch_key_space").on("click", function () {
      if (!d) {
        e();
      }
    });
    $("#ch_key_delspace").on("click", function () {
      u();
    });
    $("#ch_key_newline").on("click", function () {
      I();
    });
    $("#ch_key_delete").on("click", function () {
      v();
      L();
    });
  }
  function j() {
    var S = H.length;
    z = "";
    for (var R = 0; R < S; R++) {
      z = z + H[R];
    }
    l.html(z);
  }
  function J(R) {
    H.push(R);
    j();
  }
  function N(R) {
    if (i) {
      H.push(R);
      j();
      i = false;
      k = false;
      w = true;
      x = true;
      b = true;
    }
  }
  function p(R) {
    if (w) {
      H.push(R);
      j();
      w = false;
      x = true;
      b = true;
    }
  }
  function D(R) {
    if (b) {
      H.push(R);
      j();
      h();
      i = true;
      k = true;
    }
  }
  function o(R) {
    if (x) {
      H.push(R);
      j();
      h();
      b = true;
    }
  }
  function h() {
    i = false;
    w = false;
    x = false;
    b = false;
    k = false;
  }
  function a() {
    t("Generating Chords Keyboard Panel");
    y = new YAHOO.widget.Panel("chordsKeyPanelObj", {
      width: "600px",
      fixedcenter: true,
      modal: true,
      visible: false,
      close: false,
      constraintoviewport: true,
    });
    y.render(document.body);
    y.setHeader("CHORDS KEYBOARD");
    y.setBody(P);
    y.hide();
  }
  function q(R, S) {
    Q = R;
    n = S;
    E();
    F();
    d = m();
    if (d) {
      air.trace("Is a chord... Activate Delete and hide others");
      $("#ch_key_delete").show();
    } else {
      $("#ch_key_delete").hide();
    }
  }
  function O() {
    if (l.html() == "") {
      return false;
    }
    if (d) {
      v();
    }
    var R = l.html();
    var U = "[" + R + "]";
    A(R);
    var T = Q.substring(0, n);
    var S = Q.substring(n);
    Q = T + "" + U + S;
    chordsEditObj.chordUpdateReady();
    H = new Array();
    j();
    L();
  }
  function e() {
    var S = Q.substring(0, n);
    var R = Q.substring(n);
    Q = S + " " + R;
    n++;
    chordsEditObj.chordUpdateReady();
  }
  function u() {
    air.trace("Del space caret.." + n);
    if (Q.length == n) {
      return false;
    }
    if (Q[n] == " " || Q[n].charCodeAt(0) == 160) {
      air.trace("space on right");
      var S = Q.substring(0, n);
      var R = Q.substring(n + 1);
      Q = S + R;
      chordsEditObj.chordUpdateReady();
    } else {
      if (n != 0) {
        if (Q[n - 1] == " " || Q[n - 1].charCodeAt(0) == 160) {
          air.trace("space on left");
          var S = Q.substring(0, n - 1);
          var R = Q.substring(n);
          Q = S + R;
          chordsEditObj.chordUpdateReady();
        } else {
          air.trace("no space left or right");
          air.trace("X" + Q[n] + "X" + Q[n - 1] + "X");
          air.trace(Q[n].charCodeAt(0));
          air.trace(Q[n].charCodeAt(1));
        }
      }
    }
  }
  function v() {
    if (d) {
      var S = Q.substring(0, f);
      var R = Q.substring(C + 1);
      Q = S + R;
      n = f;
      chordsEditObj.chordUpdateReady();
    }
  }
  function m() {
    var R = n;
    var S = n;
    f = 0;
    C = 0;
    if (R == 0 && Q[R] == "[") {
      return true;
    }
    if (S == Q.length) {
      return false;
    }
    while (true) {
      if (Q[R] == "\n" || R == 0) {
        if (R == 0 && Q[R] == "[") {
          f = R;
          break;
        } else {
          return false;
        }
      } else {
        if (Q[R] == "]" && R != n) {
          return false;
        } else {
          if (Q[R] == "[") {
            f = R;
            break;
          } else {
            R--;
          }
        }
      }
    }
    while (true) {
      if (Q[S] == "\n" || S == Q.length) {
        return false;
      } else {
        if (Q[S] == "[") {
          return false;
        } else {
          if (Q[S] == "]") {
            C = S;
            break;
          } else {
            S++;
          }
        }
      }
    }
    air.trace(f + "|" + C);
    return true;
  }
  function I() {
    var U = n;
    while (U != 0) {
      if (Q[U] == "\n") {
        var T = Q.substring(0, U);
        var S = Q.substring(U);
        var R = "\n                              ";
        Q = T + R + S;
        n = n + R.length;
        break;
      }
      U--;
    }
    if (U == 0) {
      var T = Q.substring(0, U);
      var S = Q.substring(U);
      var R = "                              \n";
      Q = T + R + S;
      n = n + R.length;
    }
    chordsEditObj.chordUpdateReady();
  }
  function E() {
    var S = s.length;
    if (S > 5) {
      S = 5;
    }
    for (var R = S - 1; R >= 0; R--) {
      var T = "#ch_key_m" + (R + 1);
      var U = $(T);
      U.html(s[R]);
    }
  }
  function A(T) {
    var S = s.length;
    if (S > 5) {
      S = 5;
    }
    var U = true;
    for (var R = 0; R < S; R++) {
      if (s[R] == T) {
        U = false;
        break;
      }
    }
    if (U) {
      s.push(T);
    }
  }
  function K() {
    return Q;
  }
  function c() {
    var S = s.length;
    for (var R = 0; R < S; R++) {
      s.pop();
    }
    for (var R = 0; R < 5; R++) {
      var T = "#ch_key_m" + (R + 1);
      var U = $(T);
      U.empty();
    }
  }
  function G() {
    for (var R = 0; R < 5; R++) {
      var S = "#ch_key_m" + (R + 1);
      var T = $(S);
      T.empty();
    }
  }
  function t(R) {
    if (r) {
      air.trace("[Chords Keyboard]...." + R);
    }
  }
}