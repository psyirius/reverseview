function vvConfigClass() {
  this.load = d;
  this.save = s;
  var j = null;
  var r;
  var o;
  var aE;
  var M;
  var Y;
  var K;
  var Q;
  var v;
  var au;
  var i;
  var ah;
  var O;
  var z;
  var ad;
  var U;
  var u;
  var R;
  var an;
  var at;
  var ar;
  var F;
  var E;
  var b;
  var a;
  var ac;
  var D;
  var aB;
  var af;
  var ai;
  var l;
  var ae;
  var n;
  var y;
  var ag;
  var V;
  var aq;
  var m;
  var ao;
  var am;
  var av;
  var aF;
  var C;
  var ap;
  var ak;
  var ab;
  var H;
  var I;
  var g;
  var t;
  var N;
  var aG;
  var J;
  var al;
  var az;
  var A;
  var f;
  var aC;
  var aw;
  var G;
  var T;
  var e;
  var h;
  var w;
  var x;
  var ay;
  var B;
  var P = { mutipleLines: true };
  var Z = "localhost";
  var p;
  var L = null;
  var aa = true;
  var S = 1000;
  var aD = 0;
  function d() {
    W();
    var aJ;
    var aH = "./xml/config.xml";
    var aI = air.File.applicationStorageDirectory;
    aI = aI.resolvePath(aH);
    aJ = new XMLHttpRequest();
    aJ.onreadystatechange = function () {
      if (aJ.readyState == 4) {
        try {
          j = aJ.responseXML.documentElement;
        } catch (aK) {
          aJ.abort();
          s();
          vvConfigObj.load();
        }
        if (j != null) {
          c();
          vvinit_continue();
        } else {
          vvDialog(
            "VerseVIEW",
            "Error loading VerseVIEW database. Please restart VerseVIEW."
          );
        }
      }
    };
    aJ.open("GET", aI.url, true);
    aJ.send(null);
  }
  function W() {
    r = 1;
    o = 2;
    aE = 0;
    M = 50;
    Y = 50;
    K = 50;
    Q = 50;
    v = false;
    au = true;
    ah = 14;
    i = true;
    O = 0;
    z = 0;
    ad = false;
    U = 0;
    u = 100;
    R = true;
    an = true;
    at = true;
    ar = "#FFFFFF";
    F = "#FFFFFF";
    E = "#000000";
    b = "#000000";
    P_bkgnd_color2 = "#FFFFFF";
    ac = 0;
    D = 0;
    aB = 1;
    af = "0";
    ai = "center";
    l = 0;
    V = true;
    aq = true;
    P_showCustomLogo = false;
    ao = "";
    am = "";
    av = "";
    aF = "0";
    C = false;
    ap = 0.3;
    ak = 20;
    ab = 0;
    J = true;
    al = true;
    az = 0;
    A = 30;
    f = 0;
    H = false;
    I = false;
    g = true;
    t = false;
    N = true;
    aG = "";
    aC = false;
    aw = false;
    G = false;
    T = false;
    ae = 2;
    n = 2;
    y = 2;
    ag = 0;
    e = 1;
    h = true;
    w = true;
    x = false;
    ay = false;
    B = false;
    P.mutipleLines = true;
    p = "";
    Z = "localhost";
    L = null;
    aa = true;
    S = 1000;
    aD = 0;
  }
  function c() {
    r = j.getElementsByTagName("version1")[0].textContent;
    o = j.getElementsByTagName("version2")[0].textContent;
    aE = j.getElementsByTagName("bkgndIndex")[0].textContent;
    M = j.getElementsByTagName("topMargin")[0].textContent;
    Y = j.getElementsByTagName("bottomMargin")[0].textContent;
    K = j.getElementsByTagName("leftMargin")[0].textContent;
    Q = j.getElementsByTagName("rightMargin")[0].textContent;
    v = aA(j.getElementsByTagName("singleVersion")[0].textContent);
    au = aA(j.getElementsByTagName("navduallang")[0].textContent);
    ah = j.getElementsByTagName("navFontSize")[0].textContent;
    O = j.getElementsByTagName("screensel")[0].textContent;
    z = j.getElementsByTagName("stagescreensel")[0];
    if (z == null) {
      z = 0;
    } else {
      z = z.textContent;
    }
    stageScreenStyleValue = j.getElementsByTagName("stagescreenstyle")[0];
    if (stageScreenStyleValue == null) {
      U = 0;
    } else {
      U = stageScreenStyleValue.textContent;
    }
    var aZ = j.getElementsByTagName("mainScreenEnable")[0];
    if (aZ != null) {
      i = aA(aZ.textContent);
    } else {
      i = true;
    }
    var bj = j.getElementsByTagName("stageScreenEnable")[0];
    if (bj != null) {
      ad = aA(bj.textContent);
    } else {
      ad = false;
    }
    var bg = j.getElementsByTagName("maxFontSize")[0];
    if (bg != null) {
      u = bg.textContent;
    }
    var aH = j.getElementsByTagName("enableTransition")[0];
    if (aH != null) {
      R = aA(aH.textContent);
    } else {
      R = true;
    }
    var aU = j.getElementsByTagName("enableShadow")[0];
    if (aU != null) {
      an = aA(aU.textContent);
    } else {
      an = true;
    }
    var a1 = j.getElementsByTagName("enableTitle")[0];
    if (a1 != null) {
      at = aA(a1.textContent);
    } else {
      at = true;
    }
    var a5 = j.getElementsByTagName("textColor")[0];
    if (a5 != null) {
      ar = a5.textContent;
    } else {
      ar = "FFFFFF";
    }
    var a5 = j.getElementsByTagName("textColor2")[0];
    if (a5 != null) {
      F = a5.textContent;
    } else {
      F = "FFFFFF";
    }
    var aY = j.getElementsByTagName("solidBkgndColor")[0];
    if (aY != null) {
      E = aY.textContent;
    } else {
      E = "000000";
    }
    var a7 = j.getElementsByTagName("gradColor1")[0];
    if (a7 != null) {
      b = a7.textContent;
    } else {
      b = "000000";
    }
    var a9 = j.getElementsByTagName("gradColor2")[0];
    if (a9 != null) {
      a = a9.textContent;
    } else {
      a = "FFFFFF";
    }
    var bd = j.getElementsByTagName("gradOrient")[0];
    if (a9 != null) {
      ac = bd.textContent;
    } else {
      ac = 0;
    }
    var bf = j.getElementsByTagName("motionBkgndIndex")[0];
    if (a9 != null) {
      D = bf.textContent;
    } else {
      D = 0;
    }
    var aQ = j.getElementsByTagName("bkgndType")[0];
    if (a9 != null) {
      aB = aQ.textContent;
    } else {
      aB = 3;
    }
    var aS = j.getElementsByTagName("textOrient")[0];
    if (a9 != null) {
      af = aS.textContent;
    } else {
      af = "0";
    }
    var aT = j.getElementsByTagName("justification")[0];
    if (aT != null) {
      ai = aT.textContent;
    } else {
      ai = "center";
    }
    var aX = j.getElementsByTagName("version6")[0];
    if (aX != null) {
      l = aX.textContent;
    } else {
      l = 0;
    }
    var aK = j.getElementsByTagName("showdatetime")[0];
    if (aK != null) {
      if (aK.textContent == "false") {
        V = false;
      } else {
        V = true;
      }
    } else {
      V = true;
    }
    var ba = j.getElementsByTagName("showvvlogo")[0];
    if (ba != null) {
      if (ba.textContent == "false") {
        aq = false;
      } else {
        aq = true;
      }
    } else {
      aq = true;
    }
    var aO = j.getElementsByTagName("showcustomlogo")[0];
    if (aO != null) {
      if (aO.textContent == "false") {
        m = false;
      } else {
        m = true;
      }
    } else {
      m = true;
    }
    var bc = j.getElementsByTagName("logotext1")[0];
    if (bc != null) {
      ao = bc.textContent;
    } else {
      ao = "";
    }
    var aW = j.getElementsByTagName("logotext2")[0];
    if (aW != null) {
      am = aW.textContent;
    } else {
      am = "";
    }
    var aJ = j.getElementsByTagName("logoFilename")[0];
    if (aJ != null) {
      av = aJ.textContent;
    } else {
      av = "";
    }
    var a6 = j.getElementsByTagName("songtextorient")[0];
    if (a6 != null) {
      aF = a6.textContent;
    } else {
      aF = "0";
    }
    var aN = j.getElementsByTagName("showprimaryfont")[0];
    if (aN != null) {
      C = aN.textContent;
    } else {
      C = false;
    }
    var a0 = j.getElementsByTagName("svParameters")[0];
    if (a0 != null) {
      var a2 = a0.textContent;
      k(a2);
    } else {
      ap = 0.3;
      ak = 20;
      ab = 0;
      H = false;
      I = false;
      g = true;
      t = false;
      N = true;
      aG = "";
      J = false;
      al = true;
      az = 0;
      A = 30;
      f = 0;
      aC = false;
      aw = false;
      G = false;
      T = false;
    }
    var be = j.getElementsByTagName("svMessage")[0];
    if (be != null) {
      aG = be.textContent;
    } else {
      aG = "";
    }
    var aL = j.getElementsByTagName("songDBVersion")[0];
    if (aL != null) {
      ae = parseInt(aL.textContent);
    } else {
      ae = 1;
    }
    var bh = j.getElementsByTagName("bibleDBVersion")[0];
    if (bh != null) {
      n = parseInt(bh.textContent);
    } else {
      n = 1;
    }
    var aV = j.getElementsByTagName("chordsDBVersion")[0];
    if (aV != null) {
      y = parseInt(aV.textContent);
    } else {
      y = 1;
    }
    var aP = j.getElementsByTagName("versionNumber")[0];
    if (aP != null) {
      ag = parseInt(aP.textContent);
    } else {
      ag = 0;
    }
    var a3 = j.getElementsByTagName("booknamestyle")[0];
    if (a3 != null) {
      e = parseInt(a3.textContent);
    } else {
      e = 1;
    }
    var aM = j.getElementsByTagName("listinenglish")[0];
    if (aM != null) {
      var a4 = aM.textContent;
      if (a4 == "true") {
        h = true;
      } else {
        h = false;
      }
    } else {
      h = true;
    }
    var bk = j.getElementsByTagName("presentationOnTop")[0];
    if (bk != null) {
      var a8 = bk.textContent;
      if (a8 == "true") {
        w = true;
      } else {
        w = false;
      }
    } else {
      w = true;
    }
    var aR = j.getElementsByTagName("transparentEnable")[0];
    if (aR != null) {
      var a8 = aR.textContent;
      if (a8 == "true") {
        x = true;
      } else {
        x = false;
      }
    } else {
      x = false;
    }
    var bi = j.getElementsByTagName("show2lines")[0];
    if (bi != null) {
      var a8 = bi.textContent;
      if (a8 == "true") {
        ay = true;
      } else {
        ay = false;
      }
    } else {
      ay = false;
    }
    var aI = j.getElementsByTagName("hideStanzaNumber")[0];
    if (aI != null) {
      var a8 = aI.textContent;
      if (a8 == "true") {
        B = true;
      } else {
        B = false;
      }
    } else {
      B = false;
    }
    var bb = j.getElementsByTagName("taglist")[0];
    if (bb != null) {
      p = bb.textContent;
    } else {
      p = "";
    }
    var bb = j.getElementsByTagName("taglist")[0];
    if (bb != null) {
      p = bb.textContent;
    } else {
      p = "";
    }
    P.mutipleLines = q("p_format_multiplelines", true);
    Z = q("myhostname", "localhost");
    L = q("lastCheckForUpdateDate", null);
  }
  function q(aH, aJ) {
    var aI = j.getElementsByTagName(aH)[0];
    if (aI != null) {
      var aK = aI.textContent;
      if (aK == "true" || aK == "false") {
        aK = aA(aK);
      }
      if (aK == "null") {
        aK = aJ;
      }
      return aK;
    } else {
      return aJ;
    }
  }
  function aA(aH) {
    if (aH == "false") {
      return false;
    } else {
      return true;
    }
  }
  function X() {
    var aH = "";
    aH = aH + '<?xml version="1.0" encoding="UTF-8"?>\n';
    aH = aH + "<configuration>\n";
    aH = aH + "  <version1>" + r + "</version1>\n";
    aH = aH + "  <version2>" + o + "</version2>\n";
    aH = aH + "  <bkgndIndex>" + aE + "</bkgndIndex>\n";
    aH = aH + "  <topMargin>" + M + "</topMargin>\n";
    aH = aH + "  <bottomMargin>" + Y + "</bottomMargin>\n";
    aH = aH + "  <leftMargin>" + K + "</leftMargin>\n";
    aH = aH + "  <rightMargin>" + Q + "</rightMargin>\n";
    aH = aH + "  <singleVersion>" + v + "</singleVersion>\n";
    aH = aH + "  <navduallang>" + au + "</navduallang>\n";
    aH = aH + "  <navFontSize>" + ah + "</navFontSize>\n";
    aH = aH + "  <stageScreenEnable>" + ad + "</stageScreenEnable>\n";
    aH = aH + "  <mainScreenEnable>" + i + "</mainScreenEnable>\n";
    aH = aH + "  <stagescreenstyle>" + U + "</stagescreenstyle>\n";
    aH = aH + "  <screensel>" + O + "</screensel>\n";
    aH = aH + "  <stagescreensel>" + z + "</stagescreensel>\n";
    aH = aH + "  <maxFontSize>" + u + "</maxFontSize>\n";
    aH = aH + "  <enableTransition>" + R + "</enableTransition>\n";
    aH = aH + "  <enableShadow>" + an + "</enableShadow>\n";
    aH = aH + "  <enableTitle>" + at + "</enableTitle>\n";
    aH = aH + "  <textColor>" + ar + "</textColor>\n";
    aH = aH + "  <textColor2>" + F + "</textColor2>\n";
    aH = aH + "  <solidBkgndColor>" + E + "</solidBkgndColor>\n";
    aH = aH + "  <gradColor1>" + b + "</gradColor1>\n";
    aH = aH + "  <gradColor2>" + a + "</gradColor2>\n";
    aH = aH + "  <gradOrient>" + ac + "</gradOrient>\n";
    aH = aH + "  <motionBkgndIndex>" + D + "</motionBkgndIndex>\n";
    aH = aH + "  <bkgndType>" + aB + "</bkgndType>\n";
    aH = aH + "  <textOrient>" + af + "</textOrient>\n";
    aH = aH + "  <justification>" + ai + "</justification>\n";
    aH = aH + "  <version6>" + l + "</version6>\n";
    aH = aH + "  <showdatetime>" + V + "</showdatetime>\n";
    aH = aH + "  <showvvlogo>" + aq + "</showvvlogo>\n";
    aH = aH + "  <showcustomlogo>" + m + "</showcustomlogo>\n";
    aH = aH + "  <logotext1>" + ao + "</logotext1>\n";
    aH = aH + "  <logotext2>" + am + "</logotext2>\n";
    aH = aH + "  <logoFilename>" + av + "</logoFilename>\n";
    aH = aH + "  <songtextorient>" + aF + "</songtextorient>\n";
    aH = aH + "  <showprimaryfont>" + C + "</showprimaryfont>\n";
    aH = aH + "  <svParameters>" + ax() + "</svParameters>\n";
    aH = aH + "  <svMessage>" + aG + "</svMessage>\n";
    aH = aH + "  <songDBVersion>" + ae + "</songDBVersion>\n";
    aH = aH + "  <bibleDBVersion>" + n + "</bibleDBVersion>\n";
    aH = aH + "  <chordsDBVersion>" + y + "</chordsDBVersion>\n";
    aH = aH + "  <versionNumber>" + ag + "</versionNumber>\n";
    aH = aH + "  <booknamestyle>" + e + "</booknamestyle>\n";
    aH = aH + "  <listinenglish>" + h + "</listinenglish>\n";
    aH = aH + "  <presentationOnTop>" + w + "</presentationOnTop>\n";
    aH = aH + "  <transparentEnable>" + x + "</transparentEnable>\n";
    aH = aH + "  <show2lines>" + ay + "</show2lines>\n";
    aH = aH + "  <hideStanzaNumber>" + B + "</hideStanzaNumber>\n";
    aH =
      aH +
      "  <p_format_multiplelines>" +
      P.multiplelines +
      "</p_format_multiplelines>\n";
    aH = aH + "  <taglist>" + p + "</taglist>\n";
    aH = aH + "  <myhostname>" + Z + "</myhostname>\n";
    aH = aH + "  <lastCheckForUpdateDate>" + L + "</lastCheckForUpdateDate>\n";
    aH = aH + "</configuration>\n";
    return aH;
  }
  function s() {
    aD++;
    if (aa) {
      aa = false;
      setTimeout(function () {
        if (aD > 0) {
          aj();
          aD = 0;
        }
        aa = true;
      }, S);
      aj();
    }
  }
  function aj() {
    var aH = X();
    var aI = "./xml/config.xml";
    save2file(aH, aI, false);
    aD--;
  }
  this.get_version1 = function () {
    return r;
  };
  this.get_version2 = function () {
    return o;
  };
  this.get_bkgndIndex = function () {
    return aE;
  };
  this.get_p_topMargin = function () {
    return M;
  };
  this.get_p_bottomMargin = function () {
    return Y;
  };
  this.get_p_leftMargin = function () {
    return K;
  };
  this.get_p_rightMargin = function () {
    return Q;
  };
  this.get_singleVersion = function () {
    return v;
  };
  this.get_navDualLanguage = function () {
    return au;
  };
  this.get_mainConfigEnable = function () {
    return i;
  };
  this.get_navFontSize = function () {
    return ah;
  };
  this.get_selectedScreenIndex = function () {
    return O;
  };
  this.get_selectedStageScreenIndex = function () {
    return z;
  };
  this.get_stageConfigEnable = function () {
    return ad;
  };
  this.get_stageStyleVal = function () {
    return U;
  };
  this.get_p_maxFontSize = function () {
    return u;
  };
  this.get_p_enableTransition = function () {
    return R;
  };
  this.get_p_enableShadow = function () {
    return an;
  };
  this.get_p_showTitle = function () {
    return at;
  };
  this.get_p_textColor = function () {
    return ar;
  };
  this.get_p_textColor2 = function () {
    return F;
  };
  this.get_p_solidBkgndColor = function () {
    return E;
  };
  this.get_p_bkgnd_color1 = function () {
    return b;
  };
  this.get_p_bkgnd_color2 = function () {
    return a;
  };
  this.get_p_bkgnd_grad_orient = function () {
    return ac;
  };
  this.get_p_motion_bkgnd_index = function () {
    return D;
  };
  this.get_p_bkgnd_type = function () {
    return aB;
  };
  this.get_p_text_orientation = function () {
    return af;
  };
  this.get_p_align = function () {
    return ai;
  };
  this.get_version6 = function () {
    return l;
  };
  this.get_showDateTime = function () {
    return V;
  };
  this.get_showVVLogo = function () {
    return aq;
  };
  this.get_showCustomLogo = function () {
    return m;
  };
  this.get_logoText1 = function () {
    return ao;
  };
  this.get_logoText2 = function () {
    return am;
  };
  this.get_logoFilename = function () {
    return av;
  };
  this.get_song_text_orientation = function () {
    return aF;
  };
  this.get_song_primaryOnly = function () {
    return C;
  };
  this.get_svOpacity = function () {
    return ap;
  };
  this.get_svHeight = function () {
    return ak;
  };
  this.get_svWindow = function () {
    return J;
  };
  this.get_svGreenWindow = function () {
    return al;
  };
  this.get_svPosition = function () {
    return az;
  };
  this.get_svMaxFontSize = function () {
    return A;
  };
  this.get_svBcolor = function () {
    return f;
  };
  this.get_svFcolor = function () {
    return ab;
  };
  this.get_svShowPrimary = function () {
    return H;
  };
  this.get_svShowSecondary = function () {
    return I;
  };
  this.get_svTextOutline = function () {
    return g;
  };
  this.get_svTextShadow = function () {
    return t;
  };
  this.get_svShowDate = function () {
    return N;
  };
  this.get_svMessage = function () {
    return aG;
  };
  this.get_songDBVersion = function () {
    return ae;
  };
  this.get_bibleDBVersion = function () {
    return n;
  };
  this.get_chordsDBVersion = function () {
    return y;
  };
  this.get_versionNum = function () {
    return ag;
  };
  this.get_booknamestyle = function () {
    return e;
  };
  this.get_listinenglish = function () {
    return h;
  };
  this.get_presentationOnTop = function () {
    return w;
  };
  this.get_transparentEnable = function () {
    return x;
  };
  this.get_show2lines = function () {
    return ay;
  };
  this.get_hideStanzaNumber = function () {
    return B;
  };
  this.get_svAlignLeft = function () {
    return aC;
  };
  this.get_svAlignCenter = function () {
    return aw;
  };
  this.get_svAddTexture = function () {
    return G;
  };
  this.get_svShowHorizontal = function () {
    return T;
  };
  this.get_taglist = function () {
    return p;
  };
  this.get_pformat_multiplelines = function () {
    return P.mutipleLines;
  };
  this.get_myhostname = function () {
    return Z;
  };
  this.get_lastCheckForUpdateDate = function () {
    return L;
  };
  this.set_version1 = function (aH) {
    r = aH;
    return true;
  };
  this.set_version2 = function (aH) {
    o = aH;
    return true;
  };
  this.set_bkgndIndex = function (aH) {
    aE = aH;
    return true;
  };
  this.set_p_topMargin = function (aH) {
    M = aH;
    return true;
  };
  this.set_p_bottomMargin = function (aH) {
    Y = aH;
    return true;
  };
  this.set_p_leftMargin = function (aH) {
    K = aH;
    return true;
  };
  this.set_p_rightMargin = function (aH) {
    Q = aH;
    return true;
  };
  this.set_singleVersion = function (aH) {
    v = aH;
    return true;
  };
  this.set_navDualLanguage = function (aH) {
    au = aH;
    return true;
  };
  this.set_mainConfigEnable = function (aH) {
    i = aH;
    return true;
  };
  this.set_navFontSize = function (aH) {
    ah = aH;
    return true;
  };
  this.set_selectedScreenIndex = function (aH) {
    O = aH;
    return true;
  };
  this.set_selectedStageScreenIndex = function (aH) {
    z = aH;
    return true;
  };
  this.set_stageConfigEnable = function (aH) {
    ad = aH;
    return true;
  };
  this.set_stageStyleVal = function (aH) {
    U = aH;
    return true;
  };
  this.set_p_maxFontSize = function (aH) {
    u = aH;
    return true;
  };
  this.set_p_enableTransition = function (aH) {
    R = aH;
    return true;
  };
  this.set_p_enableShadow = function (aH) {
    an = aH;
    return true;
  };
  this.set_p_showTitle = function (aH) {
    at = aH;
    return true;
  };
  this.set_p_textColor = function (aH) {
    ar = aH;
    return true;
  };
  this.set_p_textColor2 = function (aH) {
    F = aH;
    return true;
  };
  this.set_p_solidBkgndColor = function (aH) {
    E = aH;
    return true;
  };
  this.set_p_bkgnd_color1 = function (aH) {
    b = aH;
    return true;
  };
  this.set_p_bkgnd_color2 = function (aH) {
    a = aH;
    return true;
  };
  this.set_p_bkgnd_grad_orient = function (aH) {
    ac = aH;
    return true;
  };
  this.set_p_motion_bkgnd_index = function (aH) {
    D = aH;
    return true;
  };
  this.set_p_bkgnd_type = function (aH) {
    aB = aH;
    return true;
  };
  this.set_p_text_orientation = function (aH) {
    af = aH;
    return true;
  };
  this.set_p_align = function (aH) {
    ai = aH;
    return true;
  };
  this.set_version6 = function (aH) {
    l = aH;
    return true;
  };
  this.set_showDateTime = function (aH) {
    V = aH;
    return true;
  };
  this.set_showVVLogo = function (aH) {
    aq = aH;
    return true;
  };
  this.set_showCustomLogo = function (aH) {
    m = aH;
    return true;
  };
  this.set_logoText1 = function (aH) {
    ao = aH;
    return true;
  };
  this.set_logoText2 = function (aH) {
    am = aH;
    return true;
  };
  this.set_logoFilename = function (aH) {
    av = aH;
    return true;
  };
  this.set_song_text_orientation = function (aH) {
    aF = aH;
    return true;
  };
  this.set_song_primaryOnly = function (aH) {
    C = aH;
    return true;
  };
  this.set_svOpacity = function (aH) {
    ap = aH;
    return true;
  };
  this.set_svHeight = function (aH) {
    ak = aH;
    return true;
  };
  this.set_svWindow = function (aH) {
    J = aH;
    return true;
  };
  this.set_svGreenWindow = function (aH) {
    al = aH;
    return true;
  };
  this.set_svPosition = function (aH) {
    az = aH;
    return true;
  };
  this.set_svMaxFontSize = function (aH) {
    A = aH;
    return true;
  };
  this.set_svBcolor = function (aH) {
    f = aH;
    return true;
  };
  this.set_svFcolor = function (aH) {
    ab = aH;
    return true;
  };
  this.set_svShowPrimary = function (aH) {
    H = aH;
    return true;
  };
  this.set_svShowSecondary = function (aH) {
    I = aH;
    return true;
  };
  this.set_svTextOutline = function (aH) {
    g = aH;
    return true;
  };
  this.set_svTextShadow = function (aH) {
    t = aH;
    return true;
  };
  this.set_svShowDate = function (aH) {
    N = aH;
    return true;
  };
  this.set_svMessage = function (aH) {
    aG = aH;
    return true;
  };
  this.set_songDBVersion = function (aH) {
    ae = aH;
    return true;
  };
  this.set_bibleDBVersion = function (aH) {
    n = aH;
    return true;
  };
  this.set_chordsDBVersion = function (aH) {
    y = aH;
    return true;
  };
  this.set_versionNum = function (aH) {
    ag = aH;
    return true;
  };
  this.set_booknamestyle = function (aH) {
    e = aH;
    return true;
  };
  this.set_listinenglish = function (aH) {
    h = aH;
    return true;
  };
  this.set_presentationOnTop = function (aH) {
    w = aH;
    return true;
  };
  this.set_transparentEnable = function (aH) {
    x = aH;
    return true;
  };
  this.set_show2lines = function (aH) {
    ay = aH;
    return true;
  };
  this.set_hideStanzaNumber = function (aH) {
    B = aH;
    return true;
  };
  this.set_svAlignLeft = function (aH) {
    aC = aH;
    return true;
  };
  this.set_svAlignCenter = function (aH) {
    aw = aH;
    return true;
  };
  this.set_svAddTexture = function (aH) {
    G = aH;
    return true;
  };
  this.set_svShowHorizontal = function (aH) {
    T = aH;
    return true;
  };
  this.set_pformat_multiplelines = function (aH) {
    P.mutipleLines = aH;
    return true;
  };
  this.set_myhostname = function (aH) {
    Z = aH;
    return true;
  };
  this.set_lastCheckForUpdateDate = function (aH) {
    L = aH;
    return true;
  };
  this.set_taglist = function (aH) {
    p = aH;
    return true;
  };
  function ax() {
    var aH = "";
    aH = aH + ap + "|" + ak + "|" + H + "|" + g + "|" + N + "|" + ab;
    aH = aH + "|" + J + "|" + az + "|" + A + "|" + f;
    aH = aH + "|" + al + "|" + t;
    aH = aH + "|" + aC + "|" + aw + "|" + G + "|" + T;
    aH = aH + "|" + I;
    return aH;
  }
  function k(aH) {
    var aI = aH.split("|");
    ap = aI[0];
    ak = aI[1];
    H = aI[2];
    g = aI[3];
    N = aI[4];
    ab = aI[5];
    if (aI[6] == null) {
      aI[6] = false;
    }
    if (aI[7] == null) {
      aI[7] = 0;
    }
    if (aI[8] == null) {
      aI[8] = 30;
    }
    if (aI[9] == null) {
      aI[9] = 0;
    }
    if (aI[10] == null) {
      aI[10] = true;
    }
    if (aI[11] == null) {
      aI[11] = false;
    }
    if (aI[12] == null) {
      aI[12] = false;
    }
    if (aI[13] == null) {
      aI[13] = false;
    }
    if (aI[14] == null) {
      aI[14] = false;
    }
    if (aI[15] == null) {
      aI[15] = false;
    }
    if (aI[16] == null) {
      aI[16] = false;
    }
    J = aI[6];
    az = aI[7];
    A = aI[8];
    f = aI[9];
    al = aI[10];
    t = aI[11];
    aC = aI[12];
    aw = aI[13];
    G = aI[14];
    T = aI[15];
    I = aI[16];
  }
}
function showLogoChangeEvent() {
  var a = document.getElementById("presentConfigShowCustomLogo").checked;
  if (a) {
    document.getElementById("presentConfigShowVVLogo").checked = false;
  }
}
function stageEnableChangeEvent() {
  var a = $("#stageConfigEnable").is(":checked");
  vvConfigObj.set_stageConfigEnable(a);
  vvConfigObj.save();
}
function mainEnableChangeEvent() {
  var a = $("#mainConfigEnable").is(":checked");
  vvConfigObj.set_mainConfigEnable(a);
  vvConfigObj.save();
}
function svParameterSaveEvent() {
  var e = $("#thirdview_opacity").val();
  var g = $("#thirdview_height").val();
  var l = $("#thirdview_fcolor").val();
  var f = $("#thirdview_primary").is(":checked");
  var q = $("#thirdview_secondary").is(":checked");
  var k = $("#stageviewWindow").is(":checked");
  var m = $("#stageviewGreenWindow").is(":checked");
  var j = $("#thirdview_position").val();
  var p = $("#thirdview_maxFontSize").val();
  var d = $("#thirdview_bcolor").val();
  var c = $("#thirdview_outline").is(":checked");
  var b = $("#thirdview_shadow").is(":checked");
  var a = $("#stageSettingShowTime").is(":checked");
  var o = $("#thirdview_alignLeft").is(":checked");
  var n = $("#thirdview_alignCenter").is(":checked");
  var i = $("#thirdview_showTexture").is(":checked");
  var h = $("#thirdview_alignHorizontal").is(":checked");
  vvConfigObj.set_svOpacity(e);
  vvConfigObj.set_svHeight(g);
  vvConfigObj.set_svFcolor(l);
  vvConfigObj.set_svShowPrimary(f);
  vvConfigObj.set_svShowSecondary(q);
  vvConfigObj.set_svWindow(k);
  vvConfigObj.set_svGreenWindow(m);
  vvConfigObj.set_svPosition(j);
  vvConfigObj.set_svMaxFontSize(p);
  vvConfigObj.set_svBcolor(d);
  vvConfigObj.set_svTextOutline(c);
  vvConfigObj.set_svTextShadow(b);
  vvConfigObj.set_svAlignLeft(o);
  vvConfigObj.set_svAlignCenter(n);
  vvConfigObj.set_svAddTexture(i);
  vvConfigObj.set_svShowHorizontal(h);
  vvConfigObj.set_svShowDate(a);
  vvConfigObj.save();
}
function svPassMessage() {
  var a = $("#stageConfigMessage").val();
  if (newStageWindow != null) {
    newStageWindow.window.postMessage(a);
  }
}
function svClearMessage() {
  var a = "";
  if (newStageWindow != null) {
    newStageWindow.window.postMessage(a);
  }
}
function stageStyleChangeEvent() {
  air.trace("stage Style change.. ");
  var a = $("#selectStageStyle").val();
  setupStageViewOptions();
  vvConfigObj.set_stageStyleVal(a);
  vvConfigObj.save();
}
function setupStageViewOptions() {
  $("#stageviewOpacityDiv").hide();
  $("#stageviewHeightDiv").hide();
  $("#stageviewPrimaryDiv").show();
  $("#stageviewSecondaryDiv").hide();
  $("#stageviewOutlineDiv").hide();
  $("#stageviewTimeDiv").hide();
  $("#stageMessageDivID").hide();
  $("#stageviewAlignCenterDiv").hide();
  $("#stageviewShowTextureDiv").hide();
  $("#stageviewAlignHorizontalDiv").hide();
  $("#stageviewBackgroundColorDiv").hide();
  $("#stageviewPositionDiv").hide();
  switch ($("#selectStageStyle").val()) {
    case "0":
    case "1":
    default:
      $("#stageviewTimeDiv").show();
      $("#stageMessageDivID").show();
      break;
    case "3":
      $("#stageviewOpacityDiv").show();
      $("#stageviewHeightDiv").show();
      $("#stageviewOutlineDiv").show();
      $("#stageviewAsWindowDiv").show();
      $("#stageviewBackgroundColorDiv").show();
      $("#stageviewAlignCenterDiv").show();
      $("#stageviewSecondaryDiv").show();
      $("#stageviewAlignHorizontalDiv").show();
      break;
  }
}
function stageShowTimeChangeEvent() {}
var portNumber = 50000;
var IPList = null;
function configInit() {
  document
    .getElementById("navDualLanguageID")
    .addEventListener("click", updateVerseContainer);
  document
    .getElementById("singleVersionBoxID")
    .addEventListener("click", processSingleVersion);
  document
    .getElementById("presentConfigSaveButton")
    .addEventListener("click", savePresentationMargin);
  document
    .getElementById("presentConfigShowVVLogo")
    .addEventListener("change", showLogoChangeEvent);
  document
    .getElementById("presentConfigShowCustomLogo")
    .addEventListener("change", showLogoChangeEvent);
  $("#mainConfigEnable").change(mainEnableChangeEvent);
  $("#stageConfigEnable").change(stageEnableChangeEvent);
  $("#selectStageStyle").change(stageStyleChangeEvent);
  $("#stageSettingShowTime").change(stageShowTimeChangeEvent);
  document.getElementById("presentConfigMarginTop").value =
    vvConfigObj.get_p_topMargin();
  document.getElementById("presentConfigMarginBottom").value =
    vvConfigObj.get_p_bottomMargin();
  document.getElementById("presentConfigMarginLeft").value =
    vvConfigObj.get_p_leftMargin();
  document.getElementById("presentConfigMarginRight").value =
    vvConfigObj.get_p_rightMargin();
  document.getElementById("presentConfigMaxFontSize").value =
    vvConfigObj.get_p_maxFontSize();
  if (vvConfigObj.get_stageConfigEnable()) {
    document.getElementById("stageConfigEnable").checked = true;
  } else {
    document.getElementById("stageConfigEnable").checked = false;
  }
  if (vvConfigObj.get_mainConfigEnable()) {
    document.getElementById("mainConfigEnable").checked = true;
  } else {
    document.getElementById("mainConfigEnable").checked = false;
  }
  if (vvConfigObj.get_stageStyleVal() != null) {
    $("#selectStageStyle").val(vvConfigObj.get_stageStyleVal());
  } else {
    $("#selectStageStyle").val(0);
  }
  setupStageViewOptions();
  if (vvConfigObj.get_p_enableTransition()) {
    document.getElementById("presentConfigEnableTransition").checked = true;
  } else {
    document.getElementById("presentConfigEnableTransition").checked = false;
  }
  if (vvConfigObj.get_presentationOnTop()) {
    document.getElementById("presentConfigOntop").checked = true;
  } else {
    document.getElementById("presentConfigOntop").checked = false;
  }
  if (vvConfigObj.get_p_showTitle()) {
    document.getElementById("presentConfigEnableSongTitle").checked = true;
  } else {
    document.getElementById("presentConfigEnableSongTitle").checked = false;
  }
  if (vvConfigObj.get_p_enableShadow()) {
    document.getElementById("presentConfigEnableShadow").checked = true;
  } else {
    document.getElementById("presentConfigEnableShadow").checked = false;
  }
  if (vvConfigObj.get_singleVersion()) {
    document.getElementById("singleVersionBoxID").checked = true;
    document.getElementById("version2Menu").disabled = true;
  }
  if (vvConfigObj.get_navDualLanguage()) {
    document.getElementById("navDualLanguageID").checked = true;
  } else {
    document.getElementById("navDualLanguageID").checked = false;
  }
  var a = vvConfigObj.get_p_align();
  document.getElementById("justify_left").checked = false;
  document.getElementById("justify_center").checked = false;
  document.getElementById("justify_right").checked = false;
  if (a == "left") {
    document.getElementById("justify_left").checked = true;
  }
  if (a == "center") {
    document.getElementById("justify_center").checked = true;
  }
  if (a == "right") {
    document.getElementById("justify_right").checked = true;
  }
  var j = vvConfigObj.get_p_text_orientation();
  document.getElementById("porient_hori").checked = false;
  document.getElementById("porient_vert").checked = false;
  if (j == 0) {
    document.getElementById("porient_hori").checked = true;
  }
  if (j == 1) {
    document.getElementById("porient_vert").checked = true;
  }
  var f = vvConfigObj.get_song_text_orientation();
  document.getElementById("porient_song_hori").checked = false;
  document.getElementById("porient_song_vert").checked = false;
  if (f == 0) {
    document.getElementById("porient_song_hori").checked = true;
  }
  if (f == 1) {
    document.getElementById("porient_song_vert").checked = true;
  }
  var h = vvConfigObj.get_song_primaryOnly();
  if (h == "true") {
    document.getElementById("showPrimaryFont").checked = true;
  } else {
    document.getElementById("showPrimaryFont").checked = false;
  }
  if (vvConfigObj.get_show2lines()) {
    document.getElementById("show2LinesSlides").checked = true;
  } else {
    document.getElementById("show2LinesSlides").checked = false;
  }
  if (vvConfigObj.get_hideStanzaNumber()) {
    document.getElementById("hideStanzaNumber").checked = true;
  } else {
    document.getElementById("hideStanzaNumber").checked = false;
  }
  if (vvConfigObj.get_pformat_multiplelines()) {
    document.getElementById("fitLineSetup").checked = true;
  } else {
    document.getElementById("fitLineSetup").checked = false;
  }
  var d = vvConfigObj.get_logoText1();
  document.getElementById("customLogoText1").value = d;
  var c = vvConfigObj.get_logoText2();
  document.getElementById("customLogoText2").value = c;
  var k = vvConfigObj.get_showDateTime();
  var g = vvConfigObj.get_showVVLogo();
  var b = vvConfigObj.get_showCustomLogo();
  if (k == true) {
    document.getElementById("presentConfigShowDateTime").checked = true;
  } else {
    document.getElementById("presentConfigShowDateTime").checked = false;
  }
  if (g) {
    document.getElementById("presentConfigShowVVLogo").checked = true;
  } else {
    document.getElementById("presentConfigShowVVLogo").checked = false;
  }
  if (b) {
    document.getElementById("presentConfigShowCustomLogo").checked = true;
  } else {
    document.getElementById("presentConfigShowCustomLogo").checked = false;
  }
  remoteVV_UI_Obj.configure();
  getScreenList();
  fillScreenList();
  addScreenSelectionEvent();
  var e = new fontSizeSlider();
  e.init();
  var i = new vvupdate();
  i.init();
  document.getElementById("thirdview_opacity").value =
    vvConfigObj.get_svOpacity();
  document.getElementById("thirdview_height").value =
    vvConfigObj.get_svHeight();
  document.getElementById("thirdview_fcolor").value =
    vvConfigObj.get_svFcolor();
  document.getElementById("thirdview_position").value =
    vvConfigObj.get_svPosition();
  document.getElementById("thirdview_maxFontSize").value =
    vvConfigObj.get_svMaxFontSize();
  document.getElementById("thirdview_bcolor").value =
    vvConfigObj.get_svBcolor();
  document.getElementById("thirdview_primary").checked =
    vvConfigObj.get_svShowPrimary();
  document.getElementById("thirdview_secondary").checked =
    vvConfigObj.get_svShowSecondary();
  document.getElementById("stageSettingShowTime").checked =
    vvConfigObj.get_svShowDate();
  document.getElementById("stageConfigMessage").value =
    vvConfigObj.get_svMessage();
  $("#thirdview_opacity").change(svParameterSaveEvent);
  $("#thirdview_height").change(svParameterSaveEvent);
  $("#thirdview_fcolor").change(svParameterSaveEvent);
  $("#thirdview_primary").change(function () {
    if (!vvConfigObj.get_svShowPrimary()) {
      document.getElementById("thirdview_secondary").checked = false;
    }
    svParameterSaveEvent();
  });
  $("#thirdview_secondary").change(function () {
    if (!vvConfigObj.get_svShowSecondary()) {
      document.getElementById("thirdview_primary").checked = false;
    }
    svParameterSaveEvent();
  });
  $("#stageviewWindow").change(svParameterSaveEvent);
  $("#stageviewGreenWindow").change(svParameterSaveEvent);
  $("#thirdview_position").change(svParameterSaveEvent);
  $("#thirdview_maxFontSize").change(svParameterSaveEvent);
  $("#thirdview_bcolor").change(svParameterSaveEvent);
  $("#thirdview_shadow").change(svParameterSaveEvent);
  $("#thirdview_outline").change(svParameterSaveEvent);
  $("#stageSettingShowTime").change(svParameterSaveEvent);
  $("#stageMessageShow").click(svPassMessage);
  $("#stageMessageHide").click(svClearMessage);
  $("#thirdview_alignLeft").change(svParameterSaveEvent);
  $("#thirdview_alignCenter").change(svParameterSaveEvent);
  $("#thirdview_showTexture").change(svParameterSaveEvent);
  $("#thirdview_alignHorizontal").change(svParameterSaveEvent);
  getTags2Array();
  fillTagList();
}