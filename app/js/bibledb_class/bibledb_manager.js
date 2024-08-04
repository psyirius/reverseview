var bibledbObj = new Array();
var queryCheckInterval = 100;
function loadSQLBible(c, b) {
  bibledbObj[b] = new bibledb();
  var a = null;
  if (bibleVersionArray[c] == null) {
    c = 1;
    vvDialog("Bible Database", "Please select the Bible translation of choice");
    if (b == 1) {
      vvConfigObj.set_version1(1);
    } else {
      vvConfigObj.set_version2(1);
    }
  }
  a = "./bible/" + bibleVersionArray[c][1];
  bibledbObj[b].init(a);
}
function getdata(j) {
  var g = new Array();
  var f = new Array();
  var e = bookIndex * 1 + 1;
  var a = chapterIndex * 1 + 1;
  vx = 1;
  var d = getVerseFromArray(e, a, vx);
  var c = numofch[e][a];
  if (j) {
    for (var b = 0; b < c; b++) {
      g.push(bibledbObj[1].getSingleVerseFromBuffer(d - 1));
      f.push(bibledbObj[2].getSingleVerseFromBuffer(d - 1));
      d++;
    }
    content1 = g;
    content2 = f;
    updateVerseContainer_continue();
  } else {
    var h = null;
    h = setInterval(function () {
      if (bibledbObj[1].isFullDataReady() && bibledbObj[2].isFullDataReady()) {
        clearTimeout(h);
        for (var k = 0; k < c; k++) {
          g.push(bibledbObj[1].getSingleVerseFromBuffer(d - 1));
          f.push(bibledbObj[2].getSingleVerseFromBuffer(d - 1));
          d++;
        }
        content1 = g;
        content2 = f;
        updateVerseContainer_continue();
      } else {
      }
    }, queryCheckInterval);
  }
}
function getdataONLY() {
  var f = new Array();
  var d = new Array();
  var g = bookIndex * 1 + 1;
  var a = chapterIndex * 1 + 1;
  vx = 1;
  var c = getVerseFromArray(g, a, vx);
  var b = numofch[g][a];
  for (var e = 0; e < b; e++) {
    f.push(bibledbObj[1].getSingleVerseFromBuffer(c - 1));
    d.push(bibledbObj[2].getSingleVerseFromBuffer(c - 1));
    c++;
  }
  content1 = f;
  content2 = d;
}
function getAllVersesFromChapter(d, k) {
  var h = new Array();
  var j = d * 1 + 1;
  var a = k * 1 + 1;
  vx = 1;
  var f = getVerseFromArray(j, a, vx);
  var e = numofch[j][a];
  for (var g = 0; g < e; g++) {
    h.push(bibledbObj[1].getSingleVerseFromBuffer(f - 1));
    f++;
  }
  return h;
}
function getdata_sql() {
  var b = new Array();
  var a = new Array();
  air.trace(
    "getdata_sql: Index in getdata  " +
      bookIndex +
      " " +
      chapterIndex +
      " " +
      verseIndex
  );
  bibledbObj[1].setBookNumber(bookIndex);
  bibledbObj[1].setChapterNumber(chapterIndex);
  bibledbObj[1].setVerseNumber(verseIndex);
  bibledbObj[2].setBookNumber(bookIndex);
  bibledbObj[2].setChapterNumber(chapterIndex);
  bibledbObj[2].setVerseNumber(verseIndex);
  bibledbObj[1].getChapter();
  bibledbObj[2].getChapter();
  var c = null;
  c = setInterval(function () {
    if (bibledbObj[1].isDataReady() && bibledbObj[2].isDataReady()) {
      clearTimeout(c);
      content1 = bibledbObj[1].getResultArray();
      content2 = bibledbObj[2].getResultArray();
      p_last_index = content1.length;
      updateVerseContainer_continue();
    } else {
    }
  }, queryCheckInterval);
}
function verseClass() {
  this.init = k;
  var i = "";
  var l = null;
  var b = null;
  var j = null;
  var a = null;
  var c = null;
  var e = false;
  function k(n, p, m, u, o, r, s) {
    a = n;
    i = p;
    l = m;
    b = u;
    j = o;
    c = r;
    if (s == false) {
      e = false;
    } else {
      e = true;
    }
    var q = vvConfigObj.get_navFontSize() + "px";
    document.getElementById(a).style.fontSize = q;
    document.getElementById(a).style.fontFamily = r;
    document.getElementById(a).innerHTML = '<a href="#">' + i + "</a>";
    d();
  }
  function d() {
    document.getElementById(a).addEventListener("click", h, false);
  }
  function h() {
    var n = bookIndex;
    var m = chapterIndex;
    var o = verseIndex;
    bookIndex = l - 1;
    chapterIndex = b - 1;
    verseIndex = j - 1;
    recent.addSelection(bookIndex, chapterIndex, verseIndex);
    getdata(true);
    p_footer = getFooter();
    p_title = booknames[bookIndex] + " " + (chapterIndex + 1);
    launch(verseIndex);
    document.getElementById("verseList").selectedIndex = verseIndex;
    if (e) {
      scroll_to_view = false;
      highlightVerse(verseIndex);
    }
    disableNavButtons(false);
    bookIndex = n;
    chapterIndex = m;
    verseIndex = o;
    getdata(true);
  }
  function f() {
    air.trace("Mouse Over");
  }
  function g() {
    air.trace("Mouse Out");
  }
}
function getVerseFromArray(d, p, f) {
  var h = 0;
  var n = d;
  var l = p;
  var o = f;
  for (var g = 1; g < n; g++) {
    var m = numofch[g][0];
    for (var e = 1; e <= m; e++) {
      h += numofch[g][e];
    }
  }
  var m = numofch[n][0];
  for (var a = 1; a < l; a++) {
    h += numofch[n][a];
  }
  h += o;
  return h;
}