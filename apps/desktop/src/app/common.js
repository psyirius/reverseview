function save2file(c, d, a) {
  var b = air.File.applicationStorageDirectory.resolvePath(d);
  var e = new air.FileStream();
  e.open(b, air.FileMode.WRITE);
  e.writeMultiByte(c, "utf-8");
  e.close();
}
function filesave2vvexport(c, a) {
  var d = "./vvexport/" + a + ".html";
  var b = air.File.desktopDirectory.resolvePath(d);
  var e = new air.FileStream();
  e.open(b, air.FileMode.WRITE);
  e.writeMultiByte(c, "utf-8");
  e.close();
}
function fileExist(b, a) {
  if (a == 1) {
    var c = air.File.applicationStorageDirectory;
  } else {
    var c = air.File.applicationDirectory;
  }
  c = c.resolvePath(b);
  var d = c.exists;
  return d;
}
function createFolder(b) {
  var a = air.File.applicationStorageDirectory.resolvePath(b);
  if (!a.exists) {
    a.createDirectory();
    air.trace("Directory Created..");
  } else {
    air.trace("directory already exists...");
  }
}
function clearSelectList(a) {
  if (document.getElementById(a) != null) {
    document.getElementById(a).innerHTML = "";
    return true;
  } else {
    return false;
  }
}
function copyFile2AppStorage(d, c) {
    let b = air.File.applicationDirectory.resolvePath(d);
    let a = air.File.applicationStorageDirectory.resolvePath(c);
    b.copyTo(a, true);
    return a.exists;
}
function backupWebroot() {
    air.trace("Came to backup Webroot...");
    const c = air.File.applicationStorageDirectory.resolvePath("webroot");
    if (c.exists) {
        const a = air.File.applicationStorageDirectory.resolvePath("webroot_backup6");
        if (!a.exists) {
            try {
                c.moveTo(a, true);
                return true;
            } catch (b) {
                rvw.ui.Toast.show(
                    "Creating Webroot Backup",
                    b.message + " Files in use by another application"
                );
                return false;
            }
        } else {
            rvw.ui.Toast.show("Creating Webroot Backup", "Backup already exists.");
            return true;
        }
    } else {
        return true;
    }
}
function extractFileName(d) {
  var c = air.Capabilities.manufacturer;
  if (c == "Adobe Windows") {
    var b = d.split("\\");
  } else {
    var b = d.split("/");
  }
  var a = b.length;
  return b[a - 1];
}
function withinRange(b, c, a) {
  if (a >= b && a <= c) {
    return true;
  } else {
    return false;
  }
}
function IsNumeric(b) {
  var d = "0123456789";
  var c = true;
  var a;
  for (i = 0; i < b.length && c == true; i++) {
    a = b.charAt(i);
    if (d.indexOf(a) == -1) {
      c = false;
    }
  }
  return c;
}
function unzip(u, d) {
  this.init = q;
  this.close = l;
  var u = u;
  var d = d;
  var m = new air.ByteArray();
  var v = '';
  var s;
  var p;
  var e;
  var a;
  var j;
  var c;
  var n;
  var k = "";
  var r = u + d;
  air.trace(r);
  var b = air.File.applicationStorageDirectory.resolvePath(r);
  var h = new air.FileStream();
  var o = null;
  this.get_nPath = g;
  function q() {
    h.open(b, air.FileMode.READ);
    m.endian = air.Endian.LITTLE_ENDIAN;
    air.trace("unzip init function*****");
    air.trace("zstream....." + h + "   " + h.position);
    while (h.position < b.size) {
      air.trace("unzip init function in while loop *****");
      h.readBytes(m, 0, 30);
      air.trace("Byte positon...." + m.position);
      m.position = 0;
      n = m.readInt();
      if (n != 67324752) {
        break;
      }
      m.position = 8;
      c = m.readByte();
      e = 0;
      m.position = 26;
      s = m.readShort();
      e += s;
      m.position = 28;
      p = m.readShort();
      e += p;
      h.readBytes(m, 30, e);
      m.position = 30;
      v = m.readUTFBytes(s);
      k += v + "\n";
      m.position = 18;
      a = m.readUnsignedInt();
      k += "\tCompressed size is: " + a + "\n";
      m.position = 22;
      j = m.readUnsignedInt();
      k += "\tUncompressed size is: " + j + "\n";
      h.readBytes(m, 0, a);
      air.trace("Byte positon...." + m.position);
      if (c == 8) {
        air.trace("Byte positon...." + m.position);
        m.uncompress(air.CompressionAlgorithm.DEFLATE);
      }
      air.trace("Byte positon...." + m.position);
      t(v, m);
    }
  }
  function t(y, x) {
    var f = air.File.applicationStorageDirectory;
    f = f.resolvePath(y);
    o = f.nativePath;
    var w = new air.FileStream();
    w.open(f, air.FileMode.WRITE);
    w.writeBytes(x, 0, x.length);
    w.close();
  }
  function l() {
    h.close();
  }
  function g() {
    return o;
  }
}
function stopWatch() {
  this.start = h;
  this.stop = d;
  this.reset = f;
  this.delta = g;
  var e = 0;
  var b = 0;
  var a = 0;
  var c = "";
  function h() {
    var j = new Date();
    e = j.getTime();
  }
  function d() {
    var j = new Date();
    b = j.getTime();
  }
  function f() {
    e = 0;
    b = 0;
  }
  function g(j) {
    d();
    a = b - e;
    air.trace(j + " " + a);
    return a;
  }
}
function fontSizeSlider() {
  this.init = g;
  this.getFontSize = a;
  var d = null;
  var e = 14;
  function g() {
    d = YAHOO.widget.Slider.getHorizSlider(
      "sliderbg",
      "sliderthumb",
      0,
      200,
      20
    );
    var h = ($RvW.vvConfigObj.get_navFontSize() - 8) * 10;
    d.setValue(h, true);
    c();
  }
  function c() {
    d.subscribe("change", f);
  }
  function f() {
    var h = Math.round(d.getValue());
    var j = h / 10 + 8;
    $RvW.vvConfigObj.set_navFontSize(j);
    processFontSizeChange();
  }
  function a() {
    return e;
  }
  function b() {}
}

function processFontSizeChange() {
    $RvW.updateVerseContainer();
    $RvW.searchObj.setFontSize($RvW.vvConfigObj.get_navFontSize());
    $RvW.scheduleObj.changeFontsizeScheduleTab();
}
function BibleReference() {
  this.init = o;
  this.present = b;
  this.getErrorMessage = l;
  this.getVerseText = q;
  this.getVerseFont = r;
  this.getBook = a;
  this.getChapter = n;
  this.getVerse = g;
  var f = null;
  var m = null;
  var c = null;
  var s = null;
  var p = null;
  var e = null;
  var k = "";
  var j = false;
  function o(u) {
    f = u;
    k = "";
    var t = h();
    return t;
  }
  function h() {
    var D = true;
    var B = f;
    d("Processing ...: " + B);
    p = 1;
    e = 1;
    B = B.replace(/^\s+|\s+$/g, "");
    B = B.replace(/\s\s+/g, " ");
    var E = B.split(" ");
    var t = E.length;
    var C = IsNumeric(E[0]);
    if (C && E[1] != null) {
      m = E[0] + " " + E[1].toLowerCase();
      if (E[2] != null) {
        var y = E[2].indexOf(":");
        if (y != -1) {
          E = E[2].split(":");
          p = E[0];
          e = E[1];
        } else {
          p = E[2];
          if (E[3] != null) {
            e = E[3];
          }
        }
      }
    } else {
      m = E[0].toLowerCase();
      if (E[1] != null) {
        var y = E[1].indexOf(":");
        if (y != -1) {
          E = E[1].split(":");
          p = E[0];
          e = E[1];
        } else {
          p = E[1];
          if (E[2] != null) {
            e = E[2];
          }
        }
      }
    }
    d(m);
    d(p);
    d(e);
    var x = $RvW.booknames.length;
    s = -1;
    for (var z = 0; z < x; z++) {
      var w = $RvW.booknames[z].toLowerCase();
      var A = new RegExp("^ " + m);
      var F = A.test(w);
      if (F) {
        d($RvW.booknames[z]);
        c = $RvW.booknames[z];
        s = z;
        break;
      }
    }
    if (s == -1) {
      d(
        "Failed finding in version 1 language, so finding in default language..."
      );
      for (var z = 0; z < x; z++) {
        var w = $RvW.default_booknames[z].toLowerCase();
        var A = new RegExp("^" + m);
        var F = A.test(w);
        if (F) {
          d($RvW.default_booknames[z]);
          c = $RvW.booknames[z];
          s = z;
          break;
        }
      }
    }
    if (!IsNumeric(p)) {
      k = "Invalid chapter number.";
      D = false;
    } else {
      if (!IsNumeric(e)) {
        k = "Invalid verse number.";
        D = false;
      } else {
        if (s == -1) {
          k = "Did not find matching book name to " + m;
          D = false;
        } else {
          var v = $RvW.numofch[s + 1][0];
          d("Last Chapter number: " + v);
          if (p < 1 || p > v) {
            k = "Invalid chapter number for the book " + c;
            D = false;
          } else {
            var u = $RvW.numofch[s + 1][p];
            d("Last Verse number: " + u);
            if (e < 1 || e > u) {
              k = "Invalid verse number for " + c + " " + p;
              D = false;
            }
          }
        }
      }
    }
    return D;
  }
  function b() {
    var t = s;
    var w = p - 1;
    var u = e - 1;
    $RvW.present_external(t, w, u);
    return true;
    $RvW.bookIndex = s;
    $RvW.chapterIndex = p - 1;
    $RvW.verseIndex = e - 1;
    recent.addSelection($RvW.bookIndex, $RvW.chapterIndex, $RvW.verseIndex);
    $RvW.p_footer = $RvW.getFooter();
    p_title = c + " " + ($RvW.chapterIndex + 1);
    $RvW.launch($RvW.verseIndex);
  }
  function q() {
    var t = $RvW.bible[$RvW.vvConfigObj.get_version1()]
      .getElementsByTagName("b")
      [s].getElementsByTagName("c")
      [p - 1].getElementsByTagName("v");
    return t;
  }
  function r() {
    var t = $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
    return t;
  }
  function l() {
    d(k);
    return k;
  }
  function a() {
    return s;
  }
  function n() {
    return p;
  }
  function g() {
    return e;
  }
  function d(t) {
    if (j) {
      air.trace("[BIBLE REF]: " + t);
    }
  }
}
class ImageIcon {
  constructor(a, n, e, d, b) {
    this.disableIcon = disableIcon;
    this.enableIcon = enableIcon;

    const m_sel = a;
    const m_text = n;
    const m_src = e;
    const m_srcActive = d;
    const m_srcDisabled = b;

    this.m_tooltip = new YAHOO.widget.Tooltip("ttip", { context: m_sel, text: m_text });

    document.getElementById(m_sel).src = m_src;
    document.getElementById(m_sel).addEventListener("mouseover", _on_mouseOver, false);
    document.getElementById(m_sel).addEventListener("mouseout", _on_mouseOut, false);
    document.getElementById(m_sel).style.border = "1px solid #ffffff";

    function disableIcon() {
      document.getElementById(m_sel).src = m_srcDisabled;
      document.getElementById(m_sel).removeEventListener("mouseover", _on_mouseOver, false);
      document.getElementById(m_sel).removeEventListener("mouseout", _on_mouseOut, false);
    }
    function enableIcon() {
      document.getElementById(m_sel).src = m_src;
      document.getElementById(m_sel).addEventListener("mouseover", _on_mouseOver, false);
      document.getElementById(m_sel).addEventListener("mouseout", _on_mouseOut, false);
    }
    function _on_mouseOver() {
      document.getElementById(m_sel).src = m_srcActive;
      document.getElementById(m_sel).style.border = "1px solid #87AFC7";
    }
    function _on_mouseOut() {
      document.getElementById(m_sel).src = m_src;
      document.getElementById(m_sel).style.border = "1px solid #ffffff";
    }
  }
}
function invert_hex_color(d) {
  const e = "0123456789ABCDEF";

  function c(f) {
    return e.charAt((f >> 4) & 15) + e.charAt(f & 15);
  }
  function b(f) {
    f = f.toUpperCase();
    return parseInt(f, 16);
  }
  function a(f) {
    if (f.length < 6 || f.length > 6) {
      window.alert("You Must Enter a six digit color code");
      return false;
    }
    let hex1 = f.slice(0, 2);
    let hexb1 = f.slice(2, 4);
    let hexc1 = f.slice(4, 6);
    let hex2 = 16 * b(hex1.slice(0, 1));
    let hex3 = b(hex1.slice(1, 2));
    hex1 = hex1 + hex2;
    let hexb2 = 16 * b(hexb1.slice(0, 1));
    let hexb3 = b(hexb1.slice(1, 2));
    hexb1 = hexb2 + hexb3;
    let hexc2 = 16 * b(hexc1.slice(0, 1));
    let hexc3 = b(hexc1.slice(1, 2));
    hexc1 = hexc2 + hexc3;
    return c(255 - hex1) + "" + c(255 - hexb1) + "" + c(255 - hexc1);
  }
  return a(d);
}
function promoteVV(a) {
  p_text1_arr = [];
  p_text2_arr = [];
  p_text1_font = "";
  p_text2_font = "";
  p_title = "";
  p_footnote = "";
  p_current_index = 0;
  p_last_index = 0;
  p_bkgnd_filename = $RvW.graphicsObj.getLogoFilename();
  if (a == 2) {
    p_bkgnd_filename = "./background/promote2.jpg";
  }
  p_bkgnd_color = "black";
  p_font_color = $RvW.vvConfigObj.get_p_textColor();
  p_font_color2 = $RvW.vvConfigObj.get_p_textColor2();
  presentation();
}
function showLogoSlide() {
  p_text1_arr = new Array();
  p_text2_arr = new Array();
  p_text1_arr[0] = "";
  p_text2_arr[0] = "";
  p_text1_font = "";
  p_text2_font = "";
  p_title = "";
  p_footnote = "";
  p_current_index = 0;
  p_last_index = 0;
  p_bkgnd_filename = $RvW.graphicsObj.getLogoFilename();
  p_bkgnd_color = "black";
  p_font_color = $RvW.vvConfigObj.get_p_textColor();
  p_font_color2 = $RvW.vvConfigObj.get_p_textColor2();
  presentation();
}
function blankSlide() {
  if ($RvW.presentWindowOpen) {
    $RvW.newWindow.window.showBlankProcess();
    if ($RvW.stageView && $RvW.newStageWindow != null) {
      $RvW.newStageWindow.window.showBlankProcess();
    }
  }
  $RvW.presentationContent = "";
}
function roundSearchBox(a) {
  a.style.borderRadius = "4px";
  a.style.padding = "0px 0px 0px 5px";
  a.style.height = "30px";
}
function showNotification(a) {
  $("#notificationMenu").text(a);
  clearNotification();
}
function clearNotification() {
  setTimeout(function () {
    $("#notificationMenu").text("");
  }, 3000);
}
function getDate() {
  var e = new Date();
  var c = e.getMonth() + 1;
  var b = e.getDate();
  var a =
    e.getFullYear() +
    "/" +
    (("" + c).length < 2 ? "0" : "") +
    c +
    "/" +
    (("" + b).length < 2 ? "0" : "") +
    b;
  return a;
}
function specialCategory(d) {
  if (apple) {
    return false;
  }
  var b = d.toLowerCase();
  b = b.split(" ");
  if (b[0] == "vv") {
    return true;
  } else {
    return false;
  }
}
var apple = false;
function pluckapple() {
    const a = $("#nav_bibleRefID").val();
    if (a === "admin") {
    apple = true;
    $("#nav_bibleRefID").val("");
  }
}
function presentationContentString(d, b, f, c, a) {
    if (c === "" && a === "") {
        return "";
    }
    return `${d}<newelement>${b}<newelement>${f}<newelement>${c}<newelement>${a}`;
}
function fixHTTPS_Link(a) {
  return a.replace("http:", "https:");
}
function isBlank(b) {
  var a = b.replace(/\s/g, "").replace(/<BR>/g, "");
  return a.length <= 0;
}
