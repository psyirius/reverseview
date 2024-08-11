class valsonachanTransliteration {
  constructor() {
    this.init = j;
    this.munglishWord = i;
    this.munglishLine = f;
    var k = new Array(
      "ക",
      "ഖ",
      "ഗ",
      "ഘ",
      "ങ",
      "ച",
      "ച്ച",
      "ജ",
      "ഝ",
      "ഞ",
      "ട",
      "ഠ",
      "ഡ",
      "ഢ",
      "ണ",
      "ത",
      "ഥ",
      "ദ",
      "ധ",
      "ന",
      "പ",
      "ഫ",
      "ബ",
      "ഭ",
      "മ",
      "യ",
      "ര",
      "ല",
      "വ",
      "ശ",
      "ഷ",
      "ഹ",
      "ള",
      "റ",
      "ഴ",
      "ൽ",
      "ച്ച",
      "സ",
      "ൻ",
      "ൺ",
      "അ",
      "ആ",
      "ൾ",
      "ഛ"
    );
    var c = new Array(
      "്",
      "ാ",
      "ി",
      "ീ",
      "ു",
      "ൂ",
      "്ര",
      "െ",
      "േ",
      "ൈ",
      "ൊ",
      "ോ",
      "ൗ",
      "ം",
      "ഃ",
      "ൃ",
      "എ",
      "ർ",
      "ഇ",
      "ഒ",
      "ഉ",
      "ഏ",
      "ഓ",
      "ഔ",
      "ഐ",
      "ഊ",
      "ഈ",
      "ൌ",
      "ഋ"
    );
    var g = new Array(
      "k",
      "kh",
      "g",
      "gh",
      "ng",
      "ch",
      "cch",
      "j",
      "jh",
      "nj",
      "d",
      "dt",
      "d",
      "dh",
      "n",
      "th",
      "thh",
      "d",
      "dh",
      "n",
      "p",
      "ph",
      "b",
      "bh",
      "m",
      "y",
      "r",
      "l",
      "v",
      "sh",
      "sh",
      "h",
      "l",
      "r",
      "zh",
      "l",
      "cch",
      "s",
      "n",
      "n",
      "",
      "a",
      "l",
      "chh"
    );
    var h = new Array(
      "",
      "aa",
      "i",
      "ee",
      "u",
      "oo",
      "ra",
      "e",
      "e",
      "ai",
      "o",
      "o",
      "au",
      "m",
      "",
      "ri",
      "e",
      "r",
      "e",
      "o",
      "u",
      "e",
      "or",
      "ou",
      "ai",
      "uu",
      "ee",
      "ou",
      "ri"
    );
    var b = true;
    function j() { }
    function f(p) {
      var o = p.split(" ");
      var l = o.length;
      var n = "";
      for (var m = 0; m < l; m++) {
        if (o[m] != "") {
          n += i(o[m]) + " ";
        } else {
          n += "";
        }
      }
      return n;
    }
    function i(o) {
      var v = "";
      var u = e(o);
      var m = u.split("");
      var r = m.length;
      var n = false;
      var q = "";
      var l = false;
      for (var p = 0; p < r; p++) {
        var t = k.indexOf(m[p]);
        if (t != -1) {
          if (n) {
            v += "a";
          }
          n = true;
          v += g[t];
          if (m[p] == "ൽ") {
            n = false;
          }
          if (m[p] == "ൾ") {
            n = false;
          }
        } else {
          if (n && (m[p] == "ം" || m[p] == "ർ")) {
            v += "a";
          }
          var s = c.indexOf(m[p]);
          if (s != -1) {
            n = false;
            v += h[s];
          } else {
            v += m[p];
            l = true;
          }
        }
        q = m[p];
      }
      if (n) {
        if (q != "ൻ" && q != "ൺ") {
          if (!d(q)) {
            v += "a";
          }
        }
      }
      v = v.replace("chch", "cch");
      v = v.replace("ria", "ri");
      v = v.replace("thth", "tth");
      if (l) {
        a("Found unknow character: " + v);
      }
      return v;
    }
    function e(l) {
      var m = l.replace("റ്റ", "tt");
      m = m.replace("ട്ട", "tt");
      m = m.replace("ങ്ങ", "ng");
      m = m.replace("ട്ന്റ", "nt");
      m = m.replace("റെ", "te");
      m = m.replace("സ്വർ", "swar");
      return m;
    }
    function d(n) {
      var l = k.indexOf(n);
      var m = c.indexOf(n);
      if (l == -1 && m == -1) {
        return true;
      }
      return false;
    }
    function a(l) {
      if (b) {
        air.trace("[Transliteraton Engine]...." + l);
      }
    }
  }
}