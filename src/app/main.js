// import SongEdit from './song.edit.js';

// TODO:
// - Export global functions to be used in other files

$RvW.bookIndex = 0;
$RvW.chapterIndex = 0;
$RvW.verseIndex = 0;

$RvW.bible = [];
$RvW.content1 = [];
$RvW.content2 = [];

/* Bible chapter count mapping */
$RvW.numofch = [
  [0],
  [
    50, 31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33,
    38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36,
    30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26,
  ],
  [
    40, 22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27,
    25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29,
    31, 43, 38,
  ],
  [
    27, 17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30,
    37, 27, 24, 33, 44, 23, 55, 46, 34,
  ],
  [
    36, 54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32,
    22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29, 34, 13,
  ],
  [
    34, 46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22,
    21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12,
  ],
  [
    24, 18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28,
    51, 9, 45, 34, 16, 33,
  ],
  [
    21, 36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31,
    30, 48, 25,
  ],
  [4, 22, 23, 18, 22],
  [
    31, 28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30,
    24, 42, 15, 23, 29, 22, 44, 25, 12, 25, 11, 31, 13,
  ],
  [
    24, 27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 33,
    43, 26, 22, 51, 39, 25,
  ],
  [
    22, 53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46,
    21, 43, 29, 53,
  ],
  [
    25, 18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41, 37,
    37, 21, 26, 20, 37, 20, 30,
  ],
  [
    29, 54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27, 17,
    19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30,
  ],
  [
    36, 17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 14, 19, 34,
    11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 27, 23,
  ],
  [10, 11, 70, 13, 24, 17, 22, 28, 36, 15, 44],
  [13, 11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31],
  [10, 22, 23, 15, 17, 14, 14, 10, 17, 32, 3],
  [
    42, 22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21,
    29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24,
    41, 30, 24, 34, 17,
  ],
  [
    150, 6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9,
    13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22, 13,
    17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17,
    12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10, 12, 20, 72, 13,
    19, 16, 8, 18, 12, 13, 17, 7, 18, 52, 17, 16, 15, 5, 23, 11, 13, 12, 9, 9,
    5, 8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176,
    7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 13, 10, 7,
    12, 15, 21, 10, 20, 14, 9, 6,
  ],
  [
    31, 33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24,
    29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31,
  ],
  [12, 18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14],
  [8, 17, 17, 11, 16, 16, 13, 13, 14],
  [
    66, 31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25,
    6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8,
    31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14,
    21, 22, 11, 12, 19, 12, 25, 24,
  ],
  [
    52, 19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23,
    15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21,
    28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34,
  ],
  [5, 22, 22, 66, 22, 22],
  [
    48, 28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32,
    14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28,
    23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35,
  ],
  [12, 21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13],
  [14, 11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9],
  [3, 20, 32, 21],
  [9, 15, 16, 15, 13, 27, 14, 17, 14, 15],
  [1, 21],
  [4, 17, 10, 10, 11],
  [7, 16, 13, 12, 13, 15, 16, 20],
  [3, 15, 13, 19],
  [3, 17, 20, 19],
  [3, 18, 15, 20],
  [2, 15, 23],
  [14, 21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21],
  [4, 14, 17, 18, 6],
  [
    28, 25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35,
    30, 34, 46, 46, 39, 51, 46, 75, 66, 20,
  ],
  [16, 45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20],
  [
    24, 80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43,
    48, 47, 38, 71, 56, 53,
  ],
  [
    21, 51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40,
    42, 31, 25,
  ],
  [
    28, 26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28,
    41, 38, 40, 30, 35, 27, 27, 32, 44, 31,
  ],
  [16, 32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27],
  [16, 31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24],
  [13, 24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14],
  [6, 24, 21, 29, 31, 26, 18],
  [6, 23, 22, 21, 32, 33, 24],
  [4, 30, 30, 21, 23],
  [4, 29, 23, 25, 18],
  [5, 10, 20, 13, 18, 28],
  [3, 12, 17, 18],
  [6, 20, 15, 16, 16, 25, 21],
  [4, 18, 26, 17, 22],
  [3, 16, 15, 15],
  [1, 25],
  [13, 14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25],
  [5, 27, 26, 18, 17, 20],
  [5, 25, 25, 22, 19, 14],
  [3, 21, 22, 18],
  [5, 10, 29, 24, 21, 21],
  [1, 13],
  [1, 14],
  [1, 25],
  [
    22, 20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24,
    21, 15, 27, 21,
  ]];
$RvW.colorChart = [
  "FFFFFF",
  "800000",
  "A52A2A",
  "DC143C",
  "FF0000",
  "FF6347",
  "FF7F50",
  "CD5C5C",
  "FA8072",
  "FFA07A",
  "FF4500",
  "FF8C00",
  "FFD700",
  "B8860B",
  "DAA520",
  "BDB76B",
  "F0E68C",
  "808000",
  "FFFF00",
  "9ACD32",
  "7CFC00",
  "ADFF2F",
  "006400",
  "228B22",
  "00FF00",
  "32CD32",
  "98FB98",
  "8FBC8F",
  "00FA9A",
  "00FF7F",
  "2E8B57",
  "3CB371",
  "20B2AA",
  "2F4F4F",
  "008080",
  "00FFFF",
  "E0FFFF",
  "AFEEEE",
  "B0E0E6",
  "5F9EA0",
  "6495ED",
  "00BFFF",
  "1E90FF",
  "000080",
  "0000FF",
  "4169E1",
  "8A2BE2",
  "4B0082",
  "483D8B",
  "7B68EE",
  "8B008B",
  "9400D3",
  "BA55D3",
  "D8BFD8",
  "DDA0DD",
  "EE82EE",
  "FF00FF",
  "C71585",
  "DB7093",
  "FF1493",
  "FFC0CB",
  "FAEBD7",
  "FFE4C4",
  "F5DEB3",
  "8B4513",
  "A0522D",
  "D2691E",
  "CD853F",
  "F4A460",
  "DEB887",
  "FFE4B5",
  "FFF0F5",
  "F5FFFA",
  "778899",
  "B0C4DE",
  "F0F8FF",
  "000000",
  "696969",
  "A9A9A9",
  "D3D3D3",
  "FFFFFF",
  "26FF2A",
];

$RvW.systemFontList = [
  "Impact",
  "Tahoma",
  "Helvetica",
  "Garamond",
  "Montserrat",
  "Futura",
  "Gill Sans",
  "Rockwell",
  "Palatino",
  "Verdana",
  "Cabin",
  "Patua One",
  "Rancho",
  "Roboto Slab",
  "Alegreya Sans",
  "Bitter",
  "Calibri",
  "Myriad Pro",
  "Optima",
  "Baloo Tammudu",
  "Baloo Thambi",
  "Baloo Chettan",
  "Chilanka Malayalam",
  "Gayathri Malayalam",
  "Manjari Malayalam",
  "MeeraInimai Tamil",
  "NotoSans Hindi",
  "Ramabhadra Telugu",
  "Suranna Telugu",
  "AnjaliOldLipi",
  "Aruna",
  "Jomhuria Arabic",
  "Lalezra Arabic",
  "Kambar",
  "Lohit Malayalam",
  "Meera Malayalam",
  "Tenali Telugu"
];
$RvW.specialFontList = [
  "JC_Malayalam",
  "JC_Hindi",
  "Malayalam",
  "ML-TTKarthika",
  "Thiruvachanam",
  "Kerala",
  "ML-TTRevathi",
  "Tamil Bible",
  "ML-Keraleeyam1",
  "",
  "Shusha",
  "kambar",
  "tamil",
  "Kerala"
];

$RvW.leftTabView = null;
$RvW.rightTabView = null;

$RvW.searchObj = null;
$RvW.notesObj = null;
$RvW.notesManageObj = null;
$RvW.scheduleObj = null;
$RvW.webServerObj = null;
$RvW.vvchatQObj = null;
$RvW.webEngineObj = null;
$RvW.bibleRefObj = null;
$RvW.songEditObj = null;
$RvW.songManagerObj = null;
$RvW.songNumberObj = null;
$RvW.chordsNavObj = null;
$RvW.chordsEditObj = null;
$RvW.chordsKeyboard = null;
$RvW.chordsManagerObj = null;
$RvW.chordsDatabaseObj = null;
$RvW.chordsImportExportObj = null;
$RvW.songNavObj = null;
$RvW.helpObj = null;
$RvW.bibleVersionSelObj = null;
$RvW.remoteVV_UI_Obj = null;
$RvW.updateVV_UI_Obj = null;
$RvW.editVerse_UI_Obj = null;
$RvW.newUpdateObj = null;
$RvW.enterForSearchActive = true;
$RvW.enterForBibleRef = false;
$RvW.vvConfigObj = null;
$RvW.highlightColor = "#BAD0EF";
$RvW.scroll_to_view = false;

$RvW.learner = null;
$RvW.wordbrain = null;

let firstTimeFlag = false;
let navWindowHeight = 1000;
let navWindowWidth = 1000;
let previousSelVerse = 0;
let themeState = false;
let rvwPreferences = null;

$RvW.getBookValue = function() {
  return document.getElementById("bookList").selectedIndex;
}
$RvW.getChapterValue = function() {
  return document.getElementById("chapterList").selectedIndex;
}
$RvW.getVerseValue = function() {
  return document.getElementById("verseList").selectedIndex;
}
$RvW.launch = function(g) {
  var j;
  var c = document.getElementById("multipleVerseID").checked;
  var e = 1;
  if (c) {
    e = 2;
  }
  var b;
  var a;
  p_last_index = $RvW.content1.length - 1;
  var h = 0;
  h = p_last_index + 1;
  j = p_last_index;
  b = $RvW.content1;
  a = $RvW.content2;
  if (e == 2) {
    var l = h % 2;
    if (l == 0) {
      j = parseInt(h / 2) - 1;
      for (var f = 0; f <= j; f++) {
        b[f] = $RvW.content1[f * 2] + "<BR>" + $RvW.content1[f * 2 + 1];
        a[f] = $RvW.content2[f * 2] + "<BR>" + $RvW.content2[f * 2 + 1];
      }
    } else {
      j = parseInt(h / 2);
      for (var f = 0; f < j; f++) {
        b[f] = $RvW.content1[f * 2] + "<BR>" + $RvW.content1[f * 2 + 1];
        a[f] = $RvW.content2[f * 2] + "<BR>" + $RvW.content2[f * 2 + 1];
      }
      b[f] = $RvW.content1[f * 2];
      a[f] = $RvW.content2[f * 2];
    }
  }
  var k = parseInt(g / e);
  if ($RvW.vvConfigObj.get_singleVersion()) {
    var d = a.length;
    for (f = 0; f < d; f++) {
      a[f] = "";
    }
  }
  p_text1_arr = b;
  p_text2_arr = a;
  p_text1_font = bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
  p_text2_font = bibleVersionArray[$RvW.vvConfigObj.get_version2()][6];
  p_title = p_title;
  p_footnote = $RvW.p_footer;
  p_current_index = k;
  p_last_index = j;
  p_bkgnd_filename = $RvW.graphicsObj.getBkgndFilename();
  p_bkgnd_motion = $RvW.graphicsObj.getMotionFlag();
  p_bkgnd_color = "blue";
  p_font_color = $RvW.vvConfigObj.get_p_textColor();
  p_font_color2 = $RvW.vvConfigObj.get_p_textColor2();
  p_ver1ScaleFactor = 1;
  p_ver2ScaleFactor = 1;
  if ($RvW.vvConfigObj.get_singleVersion()) {
    p_text_orientation = 2;
  } else {
    p_text_orientation = $RvW.vvConfigObj.get_p_text_orientation();
  }
  presentation();
}
$RvW.loadBookNames = function(a) {
  setPrimaryBooknames();
}
$RvW.getSingleVerse = function(j, f, k, e) {
  var l;
  var g = j * 1 + 1;
  var a = f * 1 + 1;
  var h = k * 1 + 1;
  var d = getVerseFromArray(g, a, h);
  if (e == 1) {
    l = bibledbObj[1].getSingleVerseFromBuffer(d - 1);
  } else {
    l = bibledbObj[2].getSingleVerseFromBuffer(d - 1);
  }
  return l;
}
$RvW.present = function() {
  $RvW.bookIndex = document.getElementById("bookList").selectedIndex;
  $RvW.chapterIndex = document.getElementById("chapterList").selectedIndex;
  $RvW.verseIndex = document.getElementById("verseList").selectedIndex;
  recent.addSelection($RvW.bookIndex, $RvW.chapterIndex, $RvW.verseIndex);
  air.trace("Called in $RvW.present()");
  getdata();
  $RvW.p_footer = $RvW.getFooter();
  p_title = booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex + 1);
  $RvW.launch($RvW.verseIndex);
  themeState = false;
  disableNavButtons(false);
}
$RvW.present_external = function(a, h, e) {
  var g = $RvW.bookIndex;
  var f = $RvW.chapterIndex;
  var d = $RvW.verseIndex;
  $RvW.bookIndex = a;
  $RvW.chapterIndex = h;
  $RvW.verseIndex = e;
  getdataONLY();
  $RvW.p_footer = $RvW.getFooter();
  p_title = booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex * 1 + 1);
  $RvW.launch($RvW.verseIndex);
  themeState = false;
  $RvW.bookIndex = g;
  $RvW.chapterIndex = f;
  $RvW.verseIndex = d;
  getdataONLY();
  disableNavButtons(false);
}
$RvW.getFooter = function() {
  var b;
  var a = bibleVersionArray[$RvW.vvConfigObj.get_version1()][3];
  var c = bibleVersionArray[$RvW.vvConfigObj.get_version2()][3];
  b = a + " / " + c;
  if (a == "public") {
    a = "Public Domain";
  }
  if (c == "public") {
    c = "Public Domain";
  }
  if (a == "Public Domain" && c == "Public Domain") {
    b = "";
  }
  if ((a == "Public Domain" || a == "") && c != "Public Domain") {
    b = c;
  }
  if (a != "Public Domain" && (c == "Public Domain" || c == "")) {
    b = a;
  }
  if (a == c) {
    b = a;
  }
  if (parseInt(p_text_orientation) == 2) {
    if (a == "Public Domain") {
      b = "";
    } else {
      b = a;
    }
  }
  return b;
}
function presentTheme() {
  if (themeState) {
    $RvW.present();
  } else {
    themeState = true;
    p_title = "";
    p_footnote = "";
    p_last_index = 0;
    $RvW.content1[0] = "";
    $RvW.content2[0] = "";
    p_current_index = 0;
    p_bkgnd_filename = $RvW.graphicsObj.getBkgndFilename();
    p_bkgnd_motion = $RvW.graphicsObj.getMotionFlag();
    p_bkgnd_color = "black";
    p_font_color = "white";
    p_font_color2 = "white";
    presentation();
  }
}
$RvW.setFontForList = function() {
  var a = bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
  $("#bookList").css("font-family", a);
  $("#chapterList").css("font-family", a);
  $("#verseList").css("font-family", a);
  $("#recentSel").css("font-family", a);
}
$RvW.putbook = function() {
  clearSelectList("bookList");
  var a = $RvW.vvConfigObj.get_listinenglish();
  var b = booknames.length;
  for (i = 0; i < b; i++) {
    if (a) {
      document.getElementById("bookList").options[i] = new Option(
        default_booknames[i],
        i
      );
    } else {
      document.getElementById("bookList").options[i] = new Option(
        booknames[i],
        i
      );
    }
  }
  document.getElementById("bookList").selectedIndex = 0;
  $RvW.setFontForList();
}
$RvW.putch = function(b, a) {
  clearSelectList("chapterList");
  const val = document.getElementById("bookList").selectedIndex + 1;
  for (let i = 0; i < $RvW.numofch[val][0]; i++) {
    document.getElementById("chapterList").options[i] = new Option(i + 1, i);
  }
  if (b == null) {
    document.getElementById("chapterList").selectedIndex = 0;
  } else {
    document.getElementById("chapterList").selectedIndex = b;
  }
  if (!a) {
    $RvW.putver();
  }
}

let bookval, chval;

$RvW.putver = function(a) {
  bookval = document.getElementById("bookList").selectedIndex + 1;
  chval = document.getElementById("chapterList").selectedIndex + 1;
  clearSelectList("verseList");
  for (let i = 0; i < $RvW.numofch[bookval][chval]; i++) {
    document.getElementById("verseList").options[i] = new Option(i + 1, i + 1);
  }
  if (a == null) {
    document.getElementById("verseList").selectedIndex = 0;
  } else {
    document.getElementById("verseList").selectedIndex = a;
  }
  $RvW.scroll_to_view = true;
  $RvW.updateVerseContainer();
}
function verseChange() {
    const a = $RvW.getVerseValue();
    $RvW.scroll_to_view = true;
    $RvW.highlightVerse(a);
    updateRefMenu();
}
function updateRefMenu() {
    const bi = document.getElementById("bookList").selectedIndex;
    const ci = document.getElementById("chapterList").selectedIndex;
    const vi = document.getElementById("verseList").selectedIndex;
    const e = booknames[bi] + " " + (ci + 1) + ":" + (vi + 1);
    $("#book_name").text(e);
}
$RvW.highlightVerse = function(a) {
  let b = "TC_" + previousSelVerse;
  document.getElementById(b).style.backgroundColor = "edf5ff";
  b = "TC_" + a;
  document.getElementById(b).style.backgroundColor = $RvW.highlightColor;
  previousSelVerse = a;
  const c = "TC_" + a;
  if ($RvW.scroll_to_view) {
    document.getElementById(c).scrollIntoView();
    $RvW.scroll_to_view = false;
  }
  window.scroll(0, 0);
}
$RvW.updateVerseContainer = function() {
  previousSelVerse = 0;
  $RvW.priFontName = bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
  $RvW.secFontName = bibleVersionArray[$RvW.vvConfigObj.get_version2()][6];
  var a = document.getElementById("navDualLanguageID").checked;
  $RvW.vvConfigObj.set_navDualLanguage(a);
  $RvW.bookIndex = document.getElementById("bookList").selectedIndex;
  $RvW.chapterIndex = document.getElementById("chapterList").selectedIndex;
  $RvW.verseIndex = document.getElementById("verseList").selectedIndex;
  getdata();
}
$RvW.updateVerseContainer_continue = function() {
  var p = $RvW.content1.length;
  var n = "";
  n = n + "<table border=1>";
  if ($RvW.vvConfigObj.get_navDualLanguage()) {
    n =
      n +
      '<tr><td width="4%"></td><td width="48%"></td><td width="48%"></td></tr>';
  } else {
    n = n + '<tr><td width="4%"></td><td width="96%"></td></tr>';
  }
  for (i = 0; i < p; i++) {
    var a = "TC_" + i;
    if ($RvW.vvConfigObj.get_navDualLanguage()) {
      n = n + '<tr class="vcClass" id="' + a + '"><td width="4%">';
      var h = "NC_" + i;
      n =
        n +
        '<div class="vcClassIcon" id="' +
        h +
        '"><img class="vcClassIcon" src="../graphics/icon/notes_s.png"></div>';
      n = n + '</td><td class="navtd" width="48%">';
      var h = "VC1_" + i;
      n = n + '<div class="vcClass" id="' + h + '">a</div>';
      n = n + '</td><td class="navtd" width="48%">';
      var h = "VC2_" + i;
      n = n + '<div class="vcClass" id="' + h + '">b</div>';
      n = n + "</td></tr>";
    } else {
      n = n + '<tr class="vcClass" id="' + a + '"><td width="4%">';
      var h = "NC_" + i;
      n =
        n +
        '<div class="vcClassIcon" id="' +
        h +
        '"><img class="vcClassIcon" src="../graphics/icon/notes_s.png"></div>';
      n = n + '</td><td class="navtd" width="96%">';
      var h = "VC1_" + i;
      n = n + '<div class="vcClass" id="' + h + '">x</div>';
      n = n + "</td></tr>";
    }
  }
  n = n + "</table>";
  document.getElementById("verseTab").innerHTML = n;
  var o = [];
  var c = [];
  var b = [];
  for (i = 0; i < p; i++) {
    var m = "VC1_" + i;
    var g = "VC2_" + i;
    var e = "NC_" + i;
    o[i] = new postit();
    o[i].init(e, $RvW.bookIndex + 1, $RvW.chapterIndex + 1, i + 1);
    c[i] = new verseClass();
    var l = $RvW.content1[i];
    var k = bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
    c[i].init(m, l, $RvW.bookIndex + 1, $RvW.chapterIndex + 1, i + 1, k);
    if ($RvW.vvConfigObj.get_navDualLanguage()) {
      b[i] = new verseClass();
      var l = $RvW.content2[i];
      var k = bibleVersionArray[$RvW.vvConfigObj.get_version2()][6];
      b[i].init(g, l, $RvW.bookIndex + 1, $RvW.chapterIndex + 1, i + 1, k);
    }
  }
  if ($RvW.notesObj != null) {
    var j = document.getElementById("nm_note_type1");
    if (j.checked) {
      $RvW.notesObj.getNotes(bookval, chval, 0);
    }
  }
  var d = $RvW.getVerseValue();
  $RvW.highlightVerse(d);
}

function loadPreferences(callback) {
  const appStorageDir = air.File.applicationStorageDirectory;
  const prefsFile = appStorageDir.resolvePath("preferences.json");

  const _cb = (e, store) => {
    if (e) {
      alert("[!] LoadPreferences: " + e);
      return;
    }

    rvwPreferences = store;

    callback(store);
  }

  if (!prefsFile.exists || prefsFile.isDirectory) {
    rvw.store.Preferences.init(prefsFile, _cb);
  } else {
    rvw.store.Preferences.load(prefsFile, _cb);
  }
}

function activateMainWindow() {
  // load saved window state
  const { nativeWindow } = window;

  const windowState = rvwPreferences.get("app.state.window");
  if (windowState) {
    const { bounds, maximized } = windowState;
    const { NativeWindowDisplayState } = air;

    nativeWindow.x = bounds.x;
    nativeWindow.y = bounds.y;
    nativeWindow.width = bounds.width;
    nativeWindow.height = bounds.height;

    if ((maximized === true) && (nativeWindow.displayState !== NativeWindowDisplayState.MAXIMIZED)) {
      nativeWindow.maximize();
    } else {
      nativeWindow.restore();
    }
  }

  nativeWindow.visible = true;
  nativeWindow.activate();
}

function loadInstalledFonts() {
  const { Array } = window.runtime;
  const { Font } = window.runtime.flash.text;

  const allFonts = Font.enumerateFonts(
      /* enumerateDeviceFonts: boolean */ true
  );
  allFonts.sortOn("fontName", Array.CASEINSENSITIVE);

  // const embeddedFonts = Font.enumerateFonts(
  //     /* enumerateDeviceFonts: boolean */ false
  // );
  // embeddedFonts.sortOn("fontName", Array.CASEINSENSITIVE);

  allFonts.forEach((font) => {
    air.trace(font.fontName);
  });

  return allFonts;
}

function setupConsole() {
  // new $Y.Console({
  //   logSource: $Y.Global,
  //   style: 'block',
  //   newestOnTop: false,
  //   width: "250px"
  // }).render("#yconsole");
}

function vvinit_continue() {
  setupConsole();

  rvw.ui.Toast.setup();
  rvw.ui.Prompt.setup();

  // rvw.ui.Overlay.setup();

  setTimeout(function () {
    var b = $RvW.vvConfigObj.get_chordsDBVersion() * 1;
    if (b == 1 && !firstTimeFlag) {
      var c = copyFile("chords/chords.db", "song/chords.db");
      if (c) {
        rvw.ui.Toast.show("Chords", "Updated Chords database");
        $RvW.vvConfigObj.set_chordsDBVersion(2);
      }
    }
    var a = $RvW.vvConfigObj.get_bibleDBVersion() * 1;
    if (a == 1 && !firstTimeFlag) {
      var c = copyFile("xml/version.xml", "xml/version.xml");
      if (c) {
        c = copyFile("bible", "bible");
        if (c) {
          $RvW.vvConfigObj.set_version1(1);
          $RvW.vvConfigObj.set_version2(2);
          $RvW.vvConfigObj.set_bibleDBVersion(2);
          rvw.ui.Toast.show("VerseVIEW", "Bible Database update process completed.");
        } else {
          rvw.ui.Toast.show(
            "VerseVIEW",
            "Bible Database update failed. Please contact verseview@yahoo.com"
          );
        }
      } else {
        rvw.ui.Toast.show(
          "VerseVIEW",
          "Bible Database update failed. Please contact verseview@yahoo.com"
        );
      }
    }
    loadBibleVersion();
    loadSQLBible($RvW.vvConfigObj.get_version1(), 1);
    loadSQLBible($RvW.vvConfigObj.get_version2(), 2);
    setupTabContent();

    rvw.window.Splash.close();

    activateMainWindow();

    setupNavWindow();
    $RvW.loadBookNames($RvW.vvConfigObj.get_version1());
    $RvW.putbook();
  $RvW.setupMenu();
    nativeWindow.addEventListener("resize", setupNavWindow);
    nativeWindow.addEventListener("close", processExit);
    nativeWindow.addEventListener("closing", beforeExit);
    $RvW.newUpdateObj = new checkForNewVersion();
    $RvW.newUpdateObj.init();
  }, 500);

  setTimeout(function () {
    window.scroll(0, 0);
  }, 3000);
}

function setupNavWindow() {
  var c = 280;
  var d = window.nativeWindow.bounds.height;
  var k = window.nativeWindow.bounds.width;
  if (navWindowHeight != d || navWindowWidth != k) {
    document.body.style.overflow = "hidden";
    var j = window.nativeWindow.bounds.width - 16;
    var f = window.innerHeight;
    var b = parseInt((j * 3) / 100);
    var a = parseInt((f * 4) / 100);
    $RvW.tabHeight = f - 120;
    var g = 250;
    var e = 200;
    document.getElementById("wrapper").style.height = $RvW.tabHeight;
    $("#container").height($RvW.tabHeight);
    $("#navTab").height($RvW.tabHeight);
    $("#songNavTab").height($RvW.tabHeight);
    $("#bookList").height($RvW.tabHeight - c);
    $("#chapterList").height($RvW.tabHeight - c);
    $("#verseList").height($RvW.tabHeight - c);
    var l = j - g - e - 3 * b;
    document.getElementById("container2").style.height = $RvW.tabHeight;
    document.getElementById("bibleverseTab").style.height = $RvW.tabHeight;
    document.getElementById("lyricsTab").style.height = $RvW.tabHeight;
    document.getElementById("notesTab").style.height = $RvW.tabHeight;
    document.getElementById("scheduleTab").style.height = $RvW.tabHeight;
    document.getElementById("searchTab").style.height = $RvW.tabHeight;
    document.getElementById("graphicsTab").style.height = $RvW.tabHeight;
    document.getElementById("screenTab").style.height = $RvW.tabHeight;
    document.getElementById("still_bkgnd_grid").style.height = f - 450;
    $RvW.graphicsObj.setNumOfPicsInRow(l);
    $RvW.songNavObj.setFormats();
    navWindowHeight = d;
    navWindowWidth = k;
  }
}

function setupTheme() {
  var a = document.getElementById("themeList").value;
  switch (a) {
    case "1":
      document.body.style.backgroundImage = "url(graphics/background2.png)";
      break;
    case "2":
      document.body.style.backgroundImage = "url(graphics/background3.png)";
      break;
    default:
  }
}

function setupTabContent() {
  $RvW.bibleVersionSelObj = new bibleVersionSelClass();
  $RvW.bibleVersionSelObj.init($RvW.loadViewTemplate("setup_biblesel"));

  $RvW.remoteVV_UI_Obj = new remoteVV_UI_Class();
  $RvW.remoteVV_UI_Obj.init($RvW.loadViewTemplate("setup_remote"));

  setupTabViewTemplate("bible_verses", "bibleverseTab");
  setupTabViewTemplate("screens", "screenTab");

  $RvW.updateVV_UI_Obj = new updateVV_UI_Class();
  $RvW.updateVV_UI_Obj.init($RvW.loadViewTemplate("setup_update"));

  fillTabs('configTab');

  setupTabViewTemplate("nav", "navTab");
  setupTabViewTemplate("search", "searchField");
  setupTabViewTemplate("html", "notesTab");
  setupTabViewTemplate("schedule", "scheduleTab");
  setupTabViewTemplate("song_nav", "songNavTab");
  setupTabViewTemplate("song_lyrics", "lyricsTab");

  $RvW.notesManageObj = new manageNotes();
  $RvW.notesManageObj.init(firstTimeFlag);

  $RvW.notesObj = new notes($RvW.loadViewTemplate("notesui"));
  $RvW.notesObj.setNotesContainerID("notesPanelID");

  $RvW.searchObj = new vvsearch("./bible/" + getVersion1Filename());
  $RvW.searchObj.init();

  $RvW.webServerObj = new vvWebServer();
  $RvW.webEngineObj = new vvWebEngine();
  $RvW.vvchatQObj = new chatQ();
  $RvW.bibleRefObj = new BibleReference();
  $RvW.songNumberObj = new songNumber();

  $RvW.songManagerObj = new SongManager(true, true);

  $RvW.songEditObj = new SongEdit($RvW.loadViewTemplate("song_edit"));

  $RvW.songNavObj = new songNavClass();
  $RvW.songNavObj.init();

  $RvW.helpObj = new RvwHelp($RvW.loadViewTemplate("help"));

  $RvW.graphicsObj = new graphicsClass();
  $RvW.graphicsObj.init($RvW.loadViewTemplate("graphics"));

  $RvW.chordsNavObj = new ChordsNav($RvW.loadViewTemplate("chords"));

  $RvW.chordsEditObj = new chordsEditClass();
  $RvW.chordsEditObj.init($RvW.loadViewTemplate("chords_edit"));

  $RvW.chordsKeyboard = new chordsVirtualKeyboard();
  $RvW.chordsKeyboard.init($RvW.loadViewTemplate("chords_keyboard"));

  if (!isUpToDate() && task2Status() == false) {
    air.trace("About to copy webroot files...");
    var b = backupWebroot();
    if (b) {
      copyFile("network/webroot", "network/webroot");
      task2Complete();
    }
    checkVerUpdateFlags();
  }
}

$RvW.loadViewTemplate = function(name) {
  const filepath = `./views/${name}.hbs`;

  const { File, FileStream, FileMode } = air;
  const { applicationDirectory: appDir } = File;

  const file = appDir.resolvePath(filepath);

  const prefsFS = new FileStream();
  prefsFS.open(file, FileMode.READ);
  const data = prefsFS.readMultiByte(prefsFS.bytesAvailable, 'utf-8');
  prefsFS.close();

  return data;
}

function setupTabViewTemplate(name, mountPoint) {
  document.getElementById(mountPoint).innerHTML = $RvW.loadViewTemplate(name);
  fillTabs(mountPoint);
}
function fillTabs(a) {
  if (a == "navTab") {
    fillNav();
  }
  if (a == "configTab") {
    versionFill(true);
    configInit();
  }
  if (a == "scheduleTab") {
    $RvW.scheduleObj = new schedule();
  }
  if (a == "graphicsTab") {
  }
  if (a == "searchField") {
    roundSearchBox(document.getElementById("adSearch"));
  }
  if (a == "monitorTab") {
  }
  if (a == "screenTab") {
    document.getElementById("thirdview_opacity").value =
      $RvW.vvConfigObj.get_svOpacity();
    document.getElementById("thirdview_height").value =
      $RvW.vvConfigObj.get_svHeight();
    document.getElementById("thirdview_fcolor").value =
      $RvW.vvConfigObj.get_svFcolor();
    document.getElementById("thirdview_position").value =
      $RvW.vvConfigObj.get_svPosition();
    document.getElementById("thirdview_maxFontSize").value =
      $RvW.vvConfigObj.get_svMaxFontSize();
    document.getElementById("thirdview_bcolor").value =
      $RvW.vvConfigObj.get_svBcolor();
    $("#thirdview_primary").prop(
      "checked",
      $RvW.vvConfigObj.get_svShowPrimary() == "true" ? true : false
    );
    $("#thirdview_secondary").prop(
      "checked",
      $RvW.vvConfigObj.get_svShowSecondary() == "true" ? true : false
    );
    $("#stageviewWindow").prop(
      "checked",
      $RvW.vvConfigObj.get_svWindow() == "true" ? true : false
    );
    $("#stageviewGreenWindow").prop(
      "checked",
      $RvW.vvConfigObj.get_svGreenWindow() == "true" ? true : false
    );
    $("#thirdview_outline").prop(
      "checked",
      $RvW.vvConfigObj.get_svTextOutline() == "true" ? true : false
    );
    $("#thirdview_shadow").prop(
      "checked",
      $RvW.vvConfigObj.get_svTextShadow() == "true" ? true : false
    );
    $("#stageSettingShowTime").prop(
      "checked",
      $RvW.vvConfigObj.get_svShowDate() == "true" ? true : false
    );
    $("#thirdview_opacity_range").range({
      min: 0,
      max: 10,
      start: $RvW.vvConfigObj.get_svOpacity() * 10,
      onChange: function (b) {
        $("#thirdview_opacity").val(b / 10);
        svParameterSaveEvent();
      },
    });
    $("#thirdview_opacity").prop("disabled", true);
    $("#thirdview_height_range").range({
      min: 0,
      max: 100,
      start: $RvW.vvConfigObj.get_svHeight(),
      onChange: function (b) {
        $("#thirdview_height").val(b);
        svParameterSaveEvent();
      },
    });
    $("#thirdview_height").prop("disabled", true);
    $("#thirdview_position_range").range({
      min: 0,
      max: 100,
      start: $RvW.vvConfigObj.get_svPosition(),
      onChange: function (b) {
        $("#thirdview_position").val(b);
        svParameterSaveEvent();
      },
    });
    $("#thirdview_position").prop("disabled", true);
    $("#thirdview_maxFontSize_range").range({
      min: 10,
      max: 100,
      start: $RvW.vvConfigObj.get_svMaxFontSize(),
      onChange: function (b) {
        $("#thirdview_maxFontSize").val(b);
        svParameterSaveEvent();
      },
    });
    $("#thirdview_maxFontSize").prop("disabled", true);
    $("#thirdview_fcolor_range").range({
      min: 0,
      max: 80,
      start: $RvW.vvConfigObj.get_svFcolor(),
      onChange: function (b) {
        $("#thirdview_fcolor").val(b);
        svParameterSaveEvent();
        var c = "#" + $RvW.colorChart[$("#thirdview_fcolor").val()];
        $("#thirdview_fcolor").css({ "background-color": c });
      },
    });
    $("#thirdview_fcolor").prop("disabled", true);
    $("#thirdview_bcolor_range").range({
      min: 0,
      max: 81,
      start: $RvW.vvConfigObj.get_svBcolor(),
      onChange: function (b) {
        $("#thirdview_bcolor").val(b);
        svParameterSaveEvent();
        var c = "#" + $RvW.colorChart[$("#thirdview_bcolor").val()];
        $("#thirdview_bcolor").css({ "background-color": c });
      },
    });
    $("#thirdview_bcolor").prop("disabled", true);
  }
}
function updateBookNameVar() {
  var a;
  a = new XMLHttpRequest();
  a.onreadystatechange = function () {
    if (a.readyState < 4) {
      air.trace("BOOK NAME: Loading...");
    }
    if (a.readyState == 4) {
      var c = a.responseXML.documentElement;
      b(c);
    }
  };
  a.open("GET", "./xml/booknames.xml", false);
  a.send(null);
  function b(e) {
    air.trace("********Processing bookname");
    var d = e.getElementsByTagName("b").length;
    for (var c = 0; c < d; c++) {
      booknames[c] = e.getElementsByTagName("b")[c].textContent;
    }
  }
}
function fillNav() {
  $RvW.putbook();
  $RvW.putch();
  document.getElementById("bookList").addEventListener("change", $RvW.putch, false);
  document
    .getElementById("chapterList")
    .addEventListener("change", $RvW.putver, false);
  document
    .getElementById("verseList")
    .addEventListener("change", verseChange, false);
    const b = new ImageIcon(
        "searchButtonID",
        " SEARCH ",
        "graphics/icon/search_32.png",
        "graphics/icon/search_32.png",
        ""
    );
    document
    .getElementById("nav_bibleRef_presentID")
    .addEventListener("click", processNavBibleRef, false);
  document
    .getElementById("nav_bibleRef_findID")
    .addEventListener("click", processNavBibleRefFind, false);
    const c = new ImageIcon(
        "nav_bibleRef_presentID",
        " QUICK PRESENT ",
        "graphics/icon/qpresent_24.png",
        "graphics/icon/qpresent_24.png",
        ""
    );
    const a = new ImageIcon(
        "nav_bibleRef_findID",
        " FIND ",
        "graphics/icon/search_s.png",
        "graphics/icon/search_s.png",
        ""
    );
    document
    .getElementById("nav_bibleRefID")
    .addEventListener("blur", bibleRefBlur, false);
  document
    .getElementById("nav_bibleRefID")
    .addEventListener("focus", bibleRefFocus, false);
    
  // menubar buttons
  $("#icon_present").click(function () {
      const d = getActiveTabLabel();
      if (d === "Songs") {
      $RvW.songNavObj.sn_presentSong();
    } else {
      $RvW.present();
    }
  });
  $("#icon_blank").click(function () {
    blankSlide();
  });
  $("#icon_theme").click(function () {
    if (newWindow != null) {
      newWindow.window.showThemeProcess();
    }
  });
  $("#icon_logo").click(function () {
    showLogoSlide();
  });
  $("#icon_close").click(function () {
    closePresentWindowMain();
  });
  $("#icon_prev").click(function () {
    call_prevSlide();
  });
  $("#icon_next").click(function () {
    call_nextSlide();
  });

  // conditionally disable nav buttons
  $("#bibleAddScheduleButton").click(function () {
    nav_addVerse2Schedule();
  });
  
  disableNavButtons(true);
  $RvW.enterForSearchActive = true;
    updateRefMenu();
  
  recent.init();
}

function setupLeftTabFrame() {
  const tabs = [
    {
      label: " Bible ",
      content: '<div id="navTab">Bible</div>',
    },
    {
      label: " Songs ",
      content: '<div id="songNavTab">Songs</div>',
    },
  ];

  const { TabView, Tab } = $Y;

  const tabview = new TabView();

  tabs.forEach((tabMeta, index) => {
    const tab = new Tab(tabMeta);
    tabview.add(tab, index);
  });

  tabview.render('#container');

  const lti = rvwPreferences.get('app.state.leftTabActiveIndex', 0);
  tabview.selectChild(lti);

  tabview.after('selectionChange', (e) => {
    const currentTab = e.newVal;

    // FIXME: find store base tab sync
    switch (currentTab.get('index')) {
      case 0: {
        $RvW.rightTabView.selectChild(0);
        break;
      }
      case 1: {
        $RvW.rightTabView.selectChild(1);
        break;
      }
    }
  });

  $RvW.leftTabView = tabview;
}
function setupRightTabFrame() {
  const tabs = [
    {
      label: "Verses",
      content: '<div id="bibleverseTab" class="tabSubContainer" >Loading Bible Database ... </div>',
    },
    {
      label: "Lyrics",
      content: '<div id="lyricsTab" class="tabSubContainer" >Lyrics</div>',
    },
    {
      label: "Notes",
      content: '<div id="notesTab" class="notesTabSubContainer">Notes</div>',
    },
    {
      label: "Search",
      content: '<div id="searchTab"><div id="searchField" class="searchFieldContainer">Search Field</div></div>',
    },
    {
      label: "Schedule",
      content: '<div id="scheduleTab">Schedule</div>',
    },
    {
      label: "Graphics",
      content: '<div id="graphicsTab">Graphics</div>',
    },
    {
      label: "Screens",
      content: '<div id="screenTab">Screens</div>',
    },
  ];

  const { TabView, Tab } = $Y;

  const tabview = new TabView();

  tabs.forEach((tabMeta, index) => {
    const tab = new Tab(tabMeta);
    tabview.add(tab, index);
  });

  tabview.render('#container2');

  const rti = rvwPreferences.get('app.state.rightTabActiveIndex', 0);
  tabview.selectChild(rti);

  function menuBarSync(currentTab) {
    switch (currentTab.get('index')) {
      case 0: {
        $("#lyrics_menu").hide();
        $("#verses_menu").show();
        break;
      }
      case 1: {
        $("#verses_menu").hide();
        $("#lyrics_menu").show();
        break;
      }
    }
  }

  tabview.after('selectionChange', (e) => {
    const currentTab = e.newVal;

    menuBarSync(currentTab);

    // TODO: figure out store base tab sync
    switch (currentTab.get('index')) {
      case 0: {
        $RvW.leftTabView.selectChild(0);
        break;
      }
      case 1: {
        $RvW.leftTabView.selectChild(1);
        break;
      }
    }
  });

  menuBarSync(tabview.get('selection'));

  $RvW.rightTabView = tabview;
}

function beforeExit() {
  // save app state
  {
    const lti = $RvW.leftTabView.get('selection').get('index');
    rvwPreferences.set('app.state.leftTabActiveIndex', lti);

    const rti = $RvW.rightTabView.get('selection').get('index');
    rvwPreferences.set('app.state.rightTabActiveIndex', rti);
  }

  // main window state
  {
    const { NativeWindowDisplayState } = air;

    const windowState = {
      bounds: {
        x: nativeWindow.x,
        y: nativeWindow.y,
        width: nativeWindow.width,
        height: nativeWindow.height,
      },
      maximized: nativeWindow.displayState === NativeWindowDisplayState.MAXIMIZED,
    }

    rvwPreferences.set('app.state.window', windowState);
  }

  rvwPreferences.commit();
}

function processExit() {
  air.trace('Exit process');

  if (presentWindowOpen) {
    newWindow.window.nativeWindow.removeEventListener(
      air.Event.CLOSE,
      presentWindowClosed
    );
    newWindow.window.nativeWindow.close();
    if (stageView && newStageWindow != null) {
      newStageWindow.window.nativeWindow.removeEventListener(
        air.Event.CLOSE,
        presentWindowClosed
      );
      newStageWindow.window.nativeWindow.close();
    }
  }
}
function firstTimeCheck() {
  var b = true;
  var a = fileExist("xml/version.xml", 1);
  if (!a) {
    b = setupVVersion();
  }
  var d = fileExist("xml/backgroundlist.xml", 1);
  if (!d) {
    b = setupVBkgnd();
  }
  var c = fileExist("xml/config.xml", 1);
  if (!c) {
    b = setupVConfig();
  }
  if (!a && !d && !c) {
    firstTimeFlag = true;
  }
  air.trace("First time check: " + b);
  return b;
}
function setupVVersion() {
  createFolder("xml");
  createFolder("bible");
  createFolder("notes");
  createFolder("song");
  createFolder("network");
  var a = copyFile("xml/version.xml", "xml/version.xml");
  if (!a) {
    return a;
  }
  var a = copyFile("bible", "bible");
  if (!a) {
    return a;
  }
  var a = copyFile("network/webroot", "network/webroot");
  if (!a) {
    return a;
  }
  var a = copyFile("song/default.db", "song/default.db");
  if (!a) {
    return a;
  }
  var a = copyFile("song/words.db", "song/words.db");
  if (!a) {
    return a;
  }
  var a = copyFile("chords/chords.db", "song/chords.db");
  if (!a) {
    return a;
  }
  return a;
}
function setupVBkgnd() {
  var a = copyFile("xml/backgroundlist.xml", "xml/backgroundlist.xml");
  if (!a) {
    return a;
  }
  var a = copyFile("background", "background");
  if (!a) {
    return a;
  }
  return a;
}

function onMainWindowKeyUp(evt) {
  const b = $(":focus").attr("id");
  switch (evt.keyCode) {
    case 13: /* Enter */
      if ($RvW.enterForSearchActive) {
        $RvW.searchObj.searchKeywordInit();
      }
      if ($RvW.enterForBibleRef) {
        processNavBibleRef();
      }
      if ($RvW.songNavObj.isSongSearchEditActive()) {
        $RvW.songNavObj.sn_searchSong();
      }
      break;
    case 27: /* Escape */
      closePresentWindowMain();
      break;
    case 33: /* PageUp */
      call_prevSlide();
      break;
    case 34: /* PageDown */
      call_nextSlide();
      break;
    case 39: /* ArrowRight */
    case 40: /* ArrowDown */
      if (b == null) {
        call_nextSlide();
      }
      break;
    case 37: /* ArrowLeft */
    case 38: /* ArrowUp */
      if (b == null) {
        call_prevSlide();
      }
      break;
    case 84: /* T */
      if (b == null) {
        call_showTheme();
      }
      break;
    case 119: /* F8 */
      if (!apple) {
        pluckapple();
      }
  }
}

function setupVConfig() {
    const a = copyFile("xml/config.xml", "xml/config.xml");
    if (!a) {
    return a;
  }
  return a;
}
function getActiveTabLabel() {
  return $RvW.leftTabView.get('selection').get('label')
}

// body: onload
export function start(Y) {
    document.body.addEventListener("keyup", onMainWindowKeyUp);

    rvw.window.Splash.show();

    if (!firstTimeCheck()) {
        rvw.ui.Toast.show(
            "ReVerseVIEW",
            "Error first init!"
        );
    }

    // {
    //   // Register a {{{link}}} helper for creating HTML links.
    //   $Y.Handlebars.registerHelper('link', function (text, url) {
    //     text = $Y.Escape.html(text);
    //     url  = $Y.Escape.html(url);
    //
    //     return new $Y.Handlebars.SafeString(`<a href="${url}">${text}</a>`);
    //   });
    // }

    loadPreferences(() => {
        setupLeftTabFrame();
        setupRightTabFrame();

        $RvW.systemFontList = loadInstalledFonts().map((font) => font.fontName);

        $RvW.vvConfigObj = new RvwConfig();
        $RvW.vvConfigObj.load(vvinit_continue);

        $RvW.learner = new wordlearner();

        $RvW.wordbrain = new vvbrain();
        $RvW.wordbrain.init();
    });
}
