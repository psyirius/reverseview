recent = {
  maxNumofElements: 30,
  numofElements: 0,
  startIndex: 0,
  nextIndex: 0,
  bArray: [],
  cArray: [],
  vArray: [],
  init: function () {
    recent.numofElements = 0;
    recent.startIndex = 0;
    recent.nextIndex = 0;
    recent.bArray = new Array();
    recent.cArray = new Array();
    recent.vArray = new Array();
    air.trace("Initialzied Recent Selection");
    recent.dispSelection();
  },
  addSelection: function (d, h, f) {
    if (recent.nextIndex != 0) {
      var a = recent.bArray[recent.nextIndex - 1];
      var g = recent.cArray[recent.nextIndex - 1];
      var e = recent.vArray[recent.nextIndex - 1];
      if (a != d || g != h || e != f) {
        recent.bArray[recent.nextIndex] = d;
        recent.cArray[recent.nextIndex] = h;
        recent.vArray[recent.nextIndex] = f;
        recent.updateIndex();
        recent.dispSelection();
      }
    } else {
      recent.bArray[recent.nextIndex] = d;
      recent.cArray[recent.nextIndex] = h;
      recent.vArray[recent.nextIndex] = f;
      recent.updateIndex();
      recent.dispSelection();
    }
  },
  updateIndex: function () {
    recent.nextIndex++;
    recent.numofElements++;
  },
  dispSelection: function () {
    var a = new Array();
    for (i = 0; i < recent.numofElements; i++) {
      a[i] =
        booknames[recent.bArray[i]] +
        " " +
        (recent.cArray[i] + 1) +
        ":" +
        (recent.vArray[i] + 1);
    }
    clearSelectList("recentSel");
    var b = recent.numofElements - 1;
    for (i = 0; i < recent.numofElements; i++) {
      document.getElementById("recentSel").options[i] = new Option(a[b], b);
      b--;
    }
    document.getElementById("recentSel").selectedIndex = 0;
    document
      .getElementById("recentSel")
      .addEventListener("click", recent.presentFromRecent, false);
  },
  presentFromRecent: function (c) {
    var a = document.getElementById("recentSel").selectedIndex;
    if (a != -1) {
      var b =
        document.getElementById("recentSel").options[
          document.getElementById("recentSel").selectedIndex
        ].value;
      bookIndex = recent.bArray[b];
      chapterIndex = recent.cArray[b];
      verseIndex = recent.vArray[b];
      setBookChVer(bookIndex, chapterIndex * 1 + 1, verseIndex * 1 + 1);
      getdata(true);
      p_footer =
        bibleVersionArray[vvConfigObj.get_version1()][3] +
        " / " +
        bibleVersionArray[vvConfigObj.get_version2()][3];
      p_title = booknames[bookIndex] + " " + (chapterIndex + 1);
      launch(verseIndex);
    }
  },
  data2string: function () {
    var a = "";
    for (i = 0; i < recent.numofElements; i++) {
      a =
        a +
        booknames[recent.bArray[i]] +
        " " +
        (recent.cArray[i] + 1) +
        ":" +
        (recent.vArray[i] + 1) +
        "|";
    }
    air.trace("Recent list: " + a);
    return a;
  },
};
