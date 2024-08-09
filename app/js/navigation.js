function getNumofVerses() {
  return $RvW.numofch[$RvW.bookIndex + 1][$RvW.chapterIndex + 1];
}
function processNextButton() {
  air.trace("navigation.js: processNextButton()");
  var a;
  var b = getNumofVerses();
  if ($RvW.verseIndex + 1 == b) {
    a = 0;
  } else {
    a = $RvW.verseIndex + 1;
  }
  $RvW.verseIndex = a;
  launch($RvW.verseIndex);
}
function processPrevButton() {
  var a;
  var b = getNumofVerses();
  if ($RvW.verseIndex + 1 == 1) {
    a = b - 1;
  } else {
    a = $RvW.verseIndex - 1;
  }
  $RvW.verseIndex = a;
  launch($RvW.verseIndex);
}
function disableNavButtons(a) {}
function processNavBibleRef() {
  var d = document.getElementById("nav_bibleRefID").value;
  var e = $RvW.bibleRefObj.init(d);
  if (e) {
    var c = $RvW.bibleRefObj.getBook();
    var b = $RvW.bibleRefObj.getChapter();
    var a = $RvW.bibleRefObj.getVerse();
    document.getElementById("bookList").selectedIndex = c;
    putch(b - 1, true);
    putver(a - 1);
    var f = null;
    f = setInterval(function () {
      if (bibledbObj[1].isFullDataReady() && bibledbObj[2].isFullDataReady()) {
        clearTimeout(f);
        $RvW.bibleRefObj.present();
        $RvW.scroll_to_view = true;
        highlightVerse(a - 1);
      } else {
      }
    }, queryCheckInterval);
  } else {
    rvw.ui.Toast.show("Bible Reference", $RvW.bibleRefObj.getErrorMessage());
  }
}
function processNavBibleRefFind() {
  var d = document.getElementById("nav_bibleRefID").value;
  var e = $RvW.bibleRefObj.init(d);
  if (e) {
    var c = $RvW.bibleRefObj.getBook();
    var b = $RvW.bibleRefObj.getChapter();
    var a = $RvW.bibleRefObj.getVerse();
    setBookChVer(c, b, a);
    $RvW.scroll_to_view = true;
    highlightVerse(a - 1);
  } else {
    rvw.ui.Toast.show("Bible Reference", $RvW.bibleRefObj.getErrorMessage());
  }
}
function setBookChVer(a, e, d) {
  document.getElementById("bookList").selectedIndex = a;
  putch(e - 1, true);
  putver(d - 1);
}
function bibleRefBlur() {
  $RvW.enterForBibleRef = false;
}
function bibleRefFocus() {
  $RvW.enterForBibleRef = true;
}
function nav_addVerse2Schedule() {
  var b = getBookValue();
  var a = getChapterValue();
  var c = getVerseValue();
  $RvW.scheduleObj.processAddVerse(b, a, c);
}
