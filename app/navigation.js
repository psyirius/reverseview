var prevIcon;
var nextIcon;
var closeIcon;
function getNumofVerses() {
  return numofch[bookIndex + 1][chapterIndex + 1];
}
function processNextButton() {
  air.trace("navigation.js: processNextButton()");
  var a;
  var b = getNumofVerses();
  if (verseIndex + 1 == b) {
    a = 0;
  } else {
    a = verseIndex + 1;
  }
  verseIndex = a;
  launch(verseIndex);
}
function processPrevButton() {
  var a;
  var b = getNumofVerses();
  if (verseIndex + 1 == 1) {
    a = b - 1;
  } else {
    a = verseIndex - 1;
  }
  verseIndex = a;
  launch(verseIndex);
}
function disableNavButtons(a) {}
function processNavBibleRef() {
  var d = document.getElementById("nav_bibleRefID").value;
  var e = bibleRefObj.init(d);
  if (e) {
    var c = bibleRefObj.getBook();
    var b = bibleRefObj.getChapter();
    var a = bibleRefObj.getVerse();
    document.getElementById("bookList").selectedIndex = c;
    putch(b - 1, true);
    putver(a - 1);
    var f = null;
    f = setInterval(function () {
      if (bibledbObj[1].isFullDataReady() && bibledbObj[2].isFullDataReady()) {
        clearTimeout(f);
        bibleRefObj.present();
        scroll_to_view = true;
        highlightVerse(a - 1);
      } else {
      }
    }, queryCheckInterval);
  } else {
    vvDialog("Bible Reference", bibleRefObj.getErrorMessage());
  }
}
function processNavBibleRefFind() {
  var d = document.getElementById("nav_bibleRefID").value;
  var e = bibleRefObj.init(d);
  if (e) {
    var c = bibleRefObj.getBook();
    var b = bibleRefObj.getChapter();
    var a = bibleRefObj.getVerse();
    setBookChVer(c, b, a);
    scroll_to_view = true;
    highlightVerse(a - 1);
  } else {
    vvDialog("Bible Reference", bibleRefObj.getErrorMessage());
  }
}
function setBookChVer(a, e, d) {
  document.getElementById("bookList").selectedIndex = a;
  putch(e - 1, true);
  putver(d - 1);
}
function bibleRefBlur() {
  enterForBibleRef = false;
}
function bibleRefFocus() {
  enterForBibleRef = true;
}
function nav_addVerse2Schedule() {
  var b = getBookValue();
  var a = getChapterValue();
  var c = getVerseValue();
  scheduleObj.processAddVerse(b, a, c);
}
function testxxx(a) {
  air.trace("X : " + a);
}
