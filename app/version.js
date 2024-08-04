var bibleVersionArray = new Array(["", ""]);
var versionManageDialog;
var new_fname,
  new_revision,
  new_title,
  new_font,
  new_font_list,
  new_copyright,
  new_sizefactor,
  new_booknames,
  new_sel_font;
var format;
var bibleDB;
var dbFilename_hold = "";
var verFile = null;
var vdebug = false;
function loadBibleVersion() {
  var c;
  var b = "xml/version.xml";
  file = air.File.applicationStorageDirectory;
  file = file.resolvePath(b);
  var a;
  c = new XMLHttpRequest();
  c.onreadystatechange = function () {
    if (c.readyState == 4) {
      a = c.responseXML.documentElement;
      var f = a.getElementsByTagName("version").length;
      bibleVersionArray[0][0] = "None";
      for (i = 0; i < f; i++) {
        var d = i + 1;
        var e = a.getElementsByTagName("version")[i];
        bibleVersionArray[d] = new Array();
        bibleVersionArray[d][0] = e.getElementsByTagName("name")[0].textContent;
        bibleVersionArray[d][1] = e.getElementsByTagName("file")[0].textContent;
        bibleVersionArray[d][2] = e.getElementsByTagName("font")[0].textContent;
        bibleVersionArray[d][3] =
          e.getElementsByTagName("copyright")[0].textContent;
        bibleVersionArray[d][4] =
          e.getElementsByTagName("fontsizefactor")[0].textContent;
        bibleVersionArray[d][5] =
          e.getElementsByTagName("searchfile")[0].textContent;
        bibleVersionArray[d][6] =
          e.getElementsByTagName("selectedfont")[0].textContent;
        bibleVersionArray[d][7] =
          e.getElementsByTagName("booknames")[0].textContent;
      }
    }
  };
  c.open("GET", file.url, false);
  c.send(null);
}
function versionFill(b) {
  clearSelectList("version1Menu");
  clearSelectList("version2Menu");
  var a = bibleVersionArray.length;
  for (i = 1; i < a; i++) {
    document.getElementById("version1Menu").options[i] = new Option(
      bibleVersionArray[i][0],
      i
    );
    document.getElementById("version2Menu").options[i] = new Option(
      bibleVersionArray[i][0],
      i
    );
  }
  document.getElementById("version1Menu").selectedIndex =
    vvConfigObj.get_version1();
  document.getElementById("version2Menu").selectedIndex =
    vvConfigObj.get_version2();
  document.getElementById("version1Text").innerHTML =
    "Primary: " + bibleVersionArray[vvConfigObj.get_version1()][0];
  document.getElementById("version2Text").innerHTML =
    "Secondary: " + bibleVersionArray[vvConfigObj.get_version2()][0];
  document.getElementById("booknameStyle").selectedIndex =
    vvConfigObj.get_booknamestyle() - 1;
  document.getElementById("englishList").checked =
    vvConfigObj.get_listinenglish();
  if (b) {
    document
      .getElementById("versionSave")
      .addEventListener("click", saveVersionSelection, false);
    versionManageDialog = new YAHOO.widget.Panel("versionManageDialog", {
      width: "700px",
      fixedcenter: true,
      modal: true,
      visible: false,
      constraintoviewport: true,
    });
    versionManageDialog.render();
  }
}
function saveVersionSelection() {
  var f = vvConfigObj.get_version1();
  var e = vvConfigObj.get_version2();
  var b = document.getElementById("version1Menu").selectedIndex;
  var g = document.getElementById("version2Menu").selectedIndex;
  versionDebug("****************" + b + "  " + g);
  versionDebug(
    "****************" +
      vvConfigObj.get_version1() +
      "  " +
      vvConfigObj.get_version2()
  );
  if (b != f) {
    bibledbObj[1].closeDB();
    bibledbObj[1] = null;
    loadSQLBible(b, 1);
  }
  if (g != e) {
    bibledbObj[2].closeDB();
    bibledbObj[2] = null;
    loadSQLBible(g, 2);
  }
  if (b != f) {
    var a = "./bible/" + bibleVersionArray[b][1];
    versionDebug("             Search file...." + a);
    if (searchObj != null) {
      searchObj.close();
      searchObj = null;
    }
    searchObj = new vvsearch(a);
    searchObj.init();
    document.getElementById("searchID").disabled = false;
    document.getElementById("adSearch").disabled = false;
    document.getElementById("adSearchButton").disabled = false;
  }
  document.getElementById("version1Text").innerHTML =
    "Primary: " + bibleVersionArray[b][0];
  document.getElementById("version2Text").innerHTML =
    "Secondary: " + bibleVersionArray[g][0];
  vvConfigObj.set_version1(b);
  vvConfigObj.set_version2(g);
  var d = $("#booknameStyle option:selected").val();
  var c = $("#englishList").is(":checked");
  versionDebug(d + "  " + c);
  vvConfigObj.set_booknamestyle(d);
  vvConfigObj.set_listinenglish(c);
  loadBookNames();
  putbook();
  putch();
  vvConfigObj.save();
  updateVerseContainer();
}
function readPanelContent(a) {
  var b;
  b = new XMLHttpRequest();
  b.onreadystatechange = function () {
    if (b.readyState < 4) {
      versionManageDialog.setBody("Loading....");
    }
    if (b.readyState == 4) {
      versionManageDialog.setBody(b.responseText);
      fillVersionPanel();
      hideFontVersionBox();
    }
  };
  b.open("GET", a, false);
  b.send(null);
}
function fillVersionPanel() {
  document.getElementById("selectVersionList").width = 80;
  document.getElementById("fontVersionList").width = 200;
  document
    .getElementById("selectVersionList")
    .addEventListener("change", updateVersionDetails, false);
  document
    .getElementById("deleteVersionButton")
    .addEventListener("click", deleteVersionConfirm, false);
  document
    .getElementById("saveVersionButton")
    .addEventListener("click", saveVersion, false);
  document
    .getElementById("closeVersionButton")
    .addEventListener("click", panelClose, false);
  document
    .getElementById("addFontVersionButton")
    .addEventListener("click", addFontVersionBible, false);
  document
    .getElementById("okFontVersionButton")
    .addEventListener("click", addFontVersionBibleOK, false);
  document
    .getElementById("browseVersionButton")
    .addEventListener("click", showBrowse, false);
  verFile = new air.File();
  document.getElementById("versionVersionTextbox").disabled = true;
  document.getElementById("copyrightVersionTextarea").disabled = true;
  document.getElementById("saveVersionButton").disabled = false;
  loadVersionList();
}
function loadVersionList() {
  air.trace("Load Version List function...");
  var a = bibleVersionArray.length;
  air.trace("Number of version: " + a);
  clearSelectList("selectVersionList");
  for (i = 1; i < a; i++) {
    document.getElementById("selectVersionList").options[i - 1] = new Option(
      bibleVersionArray[i][0],
      i
    );
  }
  document.getElementById("selectVersionList").selectedIndex = 0;
  versionDebug("About to update version details....");
  updateVersionDetails();
}
function updateVersionDetails() {
  var h = document.getElementById("selectVersionList").selectedIndex;
  var b = document.getElementById("selectVersionList").options[h].value;
  document.getElementById("versionVersionTextbox").value =
    bibleVersionArray[b][0];
  document.getElementById("copyrightVersionTextarea").value =
    bibleVersionArray[b][3];
  var g = bibleVersionArray[b][2];
  var d = g.split(",");
  var j = d.length;
  document.getElementById("fontVersionList").options.length = 0;
  clearSelectList("fontVersionList");
  var f = 0;
  var c = true;
  for (var e = 0; e < j; e++) {
    document.getElementById("fontVersionList").options[f] = new Option(
      d[f],
      d[f]
    );
    var k = specialFontList.indexOf(d[f]);
    if (k != -1) {
      c = false;
    }
    f++;
  }
  if (c) {
    j = systemFontList.length;
    for (var e = 0; e < j; e++) {
      document.getElementById("fontVersionList").options[f] = new Option(
        systemFontList[e],
        systemFontList[e]
      );
      f++;
    }
  }
}
function toggleSaveButton() {
  var a = document.getElementById("saveVersionButton").disabled;
  if (a) {
    document.getElementById("saveVersionButton").disabled = false;
  } else {
    document.getElementById("saveVersionButton").disabled = true;
  }
}
function toggleLoadButton() {
  versionDebug("Activating Load button....");
}
function deleteVersion() {
  var e = air.File.applicationStorageDirectory;
  var d = e.resolvePath("./xml/version.xml");
  var m = e.resolvePath("./xml/version.bak");
  d.copyTo(m, true);
  var j = document.getElementById("selectVersionList").selectedIndex;
  var a = document.getElementById("selectVersionList").options[j].value;
  var h = bibleVersionArray[a][1];
  var o = "./bible/" + h;
  var c = e.resolvePath(o);
  var g = true;
  try {
    c.deleteFile();
  } catch (f) {
    g = false;
    vvDialog(
      "Bible Version",
      "Database in use. Please restart VerseVIEW and try deleting again."
    );
  } finally {
    if (g) {
      bibleVersionArray.splice(a, 1);
      var b = generateVersionXML();
      var o = "./xml/version.xml";
      save2file(b, o, false);
      loadVersionList();
      var n = j * 1 + 1;
      var l = vvConfigObj.get_version1();
      var k = vvConfigObj.get_version2();
      if (n > l && n < k) {
        vvConfigObj.set_version2(vvConfigObj.get_version2() - 1);
      }
      if (n < l && n > k) {
        vvConfigObj.set_version1(vvConfigObj.get_version1() - 1);
      }
      if (n < l && n < k) {
        if (l < k) {
          vvConfigObj.set_version1(vvConfigObj.get_version1() - 1);
          vvConfigObj.set_version2(vvConfigObj.get_version2() - 1);
        } else {
          vvConfigObj.set_version2(vvConfigObj.get_version2() - 1);
          vvConfigObj.set_version1(vvConfigObj.get_version1() - 1);
        }
      }
      versionFill(false);
      vvConfigObj.save();
    }
  }
}
function deleteVersionConfirm() {
  var a = document.getElementById("selectVersionList").selectedIndex;
  var b = document.getElementById("selectVersionList").options[a].value;
  if (b == vvConfigObj.get_version1() || b == vvConfigObj.get_version2()) {
    vvDialog(
      "Manage Bible Database",
      "Can not delete the primary and seconday version."
    );
  } else {
    deletePromptShow();
  }
}
function saveVersion() {
  var b = document.getElementById("selectVersionList").selectedIndex;
  var d = document.getElementById("selectVersionList").options[b].value;
  var a = document.getElementById("fontVersionList").selectedIndex;
  var e = document.getElementById("fontVersionList").options[a].value;
  bibleVersionArray[d][6] = e;
  setFontForList();
  var f = generateVersionXML();
  var c = "./xml/version.xml";
  save2file(f, c, false);
  updateVerseContainer();
}
function loadBibleDBEvent(a) {
  var b = a.currentTarget.nativePath;
  air.trace("Load Bible Event Processed: " + b);
  loadVersion(b);
}
function loadVersion(d) {
  air.trace("Loading Version ....");
  dbFilename_hold = d;
  air.trace("filename: " + d);
  var g = d.split("\\");
  var h = g.length;
  var e = g[h - 1];
  var b = new air.File(d);
  var c = b.extension.toLowerCase();
  if (c != "db") {
    vvDialog("Bible Database", "Invalid VerseVIEW file.");
    return false;
  }
  var k = b.exists;
  if (!k) {
    vvDialog("Bible Database", "File does not exists.");
    return false;
  }
  var a = bibleVersionArray[vvConfigObj.get_version1()][1];
  var f = bibleVersionArray[vvConfigObj.get_version2()][1];
  if (e == a || e == f) {
    vvDialog(
      "Manage Bible Database",
      "Bible database in use. Can not UPDATE the primary and seconday version. <br> Go to Bible > Select Version and select another Bible database and then update " +
        e +
        " Bible database"
    );
  } else {
    if (c == "db") {
      var m = new bibledb();
      var j = copyDB();
      m.init(j, true);
      var l = null;
      l = setInterval(function () {
        if (m.isConfigDataReady()) {
          clearTimeout(l);
          new_fname = j.split("/")[2];
          new_title = m.getConfigTitle();
          new_copyright = m.getConfigCopyrights();
          new_font_list = m.getConfigFonts();
          new_sel_font = new_font_list.split(",");
          new_sel_font = new_sel_font[0];
          new_booknames = m.getConfigBooknames();
          continueLoadingDB();
        }
      }, 200);
    } else {
      vvDialog("Bible Database", "File not VerseVIEW database");
    }
  }
}
function continueLoadingZephania() {
  generateZephania2VVBibleXML();
  var a = bibleVersionArray.length;
  var b = a;
  bibleVersionArray.push(["", ""]);
  bibleVersionArray[b][0] = new_title;
  bibleVersionArray[b][1] = new_fname;
  bibleVersionArray[b][2] = new_font_list;
  bibleVersionArray[b][3] = new_copyright;
  bibleVersionArray[b][4] = new_sizefactor;
  bibleVersionArray[b][5] = "";
  bibleVersionArray[b][6] = new_font;
  var d = generateVersionXML();
  var c = "./xml/version.xml";
  save2file(d, c, false);
  loadVersionList();
  versionFill(false);
}
function extractInfo(a) {
  var b = null;
  bibleDB = null;
  format = "verseview";
  b = new XMLHttpRequest();
  b.onreadystatechange = function () {
    if (b.readyState == 1) {
    }
    if (b.readyState == 4) {
      bibleDB = b.responseXML.documentElement;
      var c = bibleDB.getElementsByTagName("fname")[0];
      if (c == null) {
        format = "zefania";
        extractDataFromZephania(a);
      } else {
        format = "verseview";
        new_fname = bibleDB.getElementsByTagName("fname")[0].textContent;
        new_revision = bibleDB.getElementsByTagName("revision")[0].textContent;
        new_title = bibleDB.getElementsByTagName("title")[0].textContent;
        new_font_list = bibleDB.getElementsByTagName("font")[0].textContent;
        new_copyright =
          bibleDB.getElementsByTagName("copyright")[0].textContent;
        new_sizefactor =
          bibleDB.getElementsByTagName("sizefactor")[0].textContent;
        var d = new_font_list.split(",");
        new_font = d[0];
      }
    }
  };
  b.open("GET", a, false);
  b.send(null);
}
function extractDataFromZephania(d) {
  var b = d.split("/");
  var g = b.length;
  new_fname = b[g - 1];
  new_revision = "1";
  new_font_list = "Arial,Helvetica,sans-serif,Calibri";
  new_sizefactor = "1";
  var a = bibleDB.getElementsByTagName("INFORMATION")[0];
  if (a != null) {
    var e = bibleDB
      .getElementsByTagName("INFORMATION")[0]
      .getElementsByTagName("title")[0];
    if (e != null) {
      new_title = e.textContent;
    } else {
      new_title = "";
    }
    var c = bibleDB
      .getElementsByTagName("INFORMATION")[0]
      .getElementsByTagName("publisher")[0];
    if (c != null) {
      new_copyright = c.textContent;
    } else {
      new_copyright = "";
    }
  } else {
    new_title = "";
    new_copyright = "";
  }
}
function copyDB() {
  var c = new air.File(dbFilename_hold);
  var a = air.File.applicationStorageDirectory;
  var b = extractFileName(dbFilename_hold);
  a = a.resolvePath("bible/" + b);
  air.trace("Source: " + c.nativePath);
  air.trace("Destination: " + a.nativePath);
  c.copyTo(a, true);
  air.trace("Destination: " + a);
  return "./bible/" + b;
}
function continueLoadingDB() {
  var a = bibleVersionArray.length;
  var b = a;
  air.trace("Version Array Length: " + a);
  bibleVersionArray.push(["", ""]);
  bibleVersionArray[b][0] = new_title;
  bibleVersionArray[b][1] = new_fname;
  bibleVersionArray[b][2] = new_font_list;
  bibleVersionArray[b][3] = new_copyright;
  bibleVersionArray[b][4] = "";
  bibleVersionArray[b][5] = "";
  bibleVersionArray[b][6] = new_sel_font;
  bibleVersionArray[b][7] = new_booknames;
  var d = generateVersionXML();
  var c = "./xml/version.xml";
  save2file(d, c, false);
  loadVersionList();
  versionFill(false);
}
function generateVersionXML() {
  var a = "";
  var b = bibleVersionArray.length;
  a = a + '<?xml version="1.0" encoding="UTF-8"?>\n';
  a = a + "<bibleversion>\n";
  for (i = 1; i < b; i++) {
    a = a + "  <version>\n";
    a = a + "    <name>" + bibleVersionArray[i][0] + "</name>\n";
    a = a + "    <file>" + bibleVersionArray[i][1] + "</file>\n";
    a = a + "    <font>" + bibleVersionArray[i][2] + "</font>\n";
    a = a + "    <copyright>" + bibleVersionArray[i][3] + "</copyright>\n";
    a =
      a +
      "    <fontsizefactor>" +
      bibleVersionArray[i][4] +
      "</fontsizefactor>\n";
    a = a + "    <searchfile>" + bibleVersionArray[i][5] + "</searchfile>\n";
    a =
      a + "    <selectedfont>" + bibleVersionArray[i][6] + "</selectedfont>\n";
    a = a + "    <booknames>" + bibleVersionArray[i][7] + "</booknames>\n";
    a = a + "  </version>\n";
  }
  a = a + "</bibleversion>\n";
  return a;
}
function showBrowse() {
  var a = new window.runtime.Array();
  a.push(new air.FileFilter("VerseVIEW Bible Database", "*.db"));
  verFile.browseForOpen("Select VerseVIEW Bible Database", a);
  verFile.addEventListener(air.Event.SELECT, loadBibleDBEvent);
}
function panelClose() {
  versionManageDialog.hide();
}
function addFontVersionBible() {
  showFontVersionBox();
}
function addFontVersionBibleOK() {
  var c = document.getElementById("selectVersionList").selectedIndex;
  var g = document.getElementById("selectVersionList").options[c].value;
  var b = $("#addFontVersionTextbox").val();
  b = b.trim();
  bibleVersionArray[g][6] = b;
  var a = bibleVersionArray[g][2].split(",");
  var f = $.inArray(b, a);
  if (f == -1) {
    vvDialog("Adding new font: " + b);
    bibleVersionArray[g][2] = bibleVersionArray[g][2] + "," + b;
  } else {
    vvDialog("Font " + b + " already available");
  }
  updateVersionDetails();
  hideFontVersionBox();
  var h = generateVersionXML();
  var d = "./xml/version.xml";
  save2file(h, d, false);
}
function showFontVersionBox() {
  $("#okFontVersionButton").show();
  $("#addFontVersionTextbox").show();
  $("#addFontVersionButton").hide();
}
function hideFontVersionBox() {
  $("#okFontVersionButton").hide();
  $("#addFontVersionTextbox").hide();
  $("#addFontVersionButton").show();
}
function manageVersion() {
  versionManageDialog.show();
  versionManageDialog.setHeader("Bible Version Manager");
  versionManageDialog.setBody("");
  readPanelContent("./content/version.html", "versionManageDialog");
}
function processSingleVersion() {
  var a = document.getElementById("singleVersionBoxID").checked;
  vvConfigObj.set_singleVersion(a);
  if (vvConfigObj.get_singleVersion()) {
    document.getElementById("version2Menu").disabled = true;
  } else {
    document.getElementById("version2Menu").disabled = false;
  }
  vvConfigObj.save();
}
function getVersion1Filename() {
  return bibleVersionArray[vvConfigObj.get_version1()][1];
}
function getVersion1Font() {
  return bibleVersionArray[vvConfigObj.get_version1()][2];
}
function getVersion1Name() {
  return bibleVersionArray[vvConfigObj.get_version1()][0];
}
function updateVersionXML() {
  var b = generateVersionXML();
  var a = "./xml/version.xml";
  save2file(b, a, false);
}
function versionDebug(a) {
  if (vdebug) {
    air.trace("[Version.js].... " + a);
  }
}