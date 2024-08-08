function importnew_chords() {
  chordsImportExportObj.chimport();
}
function export_chords() {
  var a = 1;
  chordsImportExportObj.configexport(a, "");
  chordsImportExportObj.chexport();
}
function chordsImporExportClass() {
  this.init = p;
  this.chexport = j;
  this.chexport_continue = q;
  this.chimport = e;
  this.configexport = t;
  this.configimport = n;
  var g = 0;
  var s = 1;
  var f = 2;
  var h = 3;
  var l = 4;
  var c = 0;
  var r = 1;
  var d = s;
  var i = "";
  var u = "";
  var b = c;
  var m = true;
  function p() {}
  function j() {
    chordsDatabaseObj.loadChordsForExport();
  }
  function q() {
    var x = chordsDatabaseObj.getExportChords();
    if (x.data == null) {
      rvw.ui.Toast.show("Chords Database", "No user added chords to export");
      return false;
    }
    k("Number of chords to export: " + x.data.length);
    var y = "";
    var v = x.data.length;
    y = y + '<?xml version="1.0" encoding="UTF-8"?><chordsDB>';
    y = y + "<type>XMLChords</type>";
    y =
      y +
      '<disclaimer>The copyrights to these chords belongs to person mentioned in the "chords by" tag of each chord. This database has been designed and compiled for VerseVIEW only.</disclaimer>';
    for (var w = 0; w < v; w++) {
      y = y + "<song>";
      y = y + "<name>" + x.data[w].title + "</name>";
      y = y + "<version>";
      y = y + "<key>" + x.data[w].key + "</key>";
      y = y + "<author><![CDATA[" + x.data[w].chordsby + "]]></author>";
      y = y + "<chords><![CDATA[" + x.data[w].chords + "]]></chords>";
      y = y + "<lyrics><![CDATA[" + x.data[w].lyrics + "]]></lyrics>";
      y = y + "<timestamp>" + x.data[w].timestamp + "</timestamp>";
      y = y + "<bpm>" + x.data[w].bpm + "</bpm>";
      y = y + "<notes><![CDATA[" + x.data[w].notes + "]]></notes>";
      y =
        y +
        "<timesignature><![CDATA[" +
        x.data[w].timesignature +
        "]]></timesignature>";
      y = y + "<rhythm><![CDATA[" + x.data[w].rhythm + "]]></rhythm>";
      y = y + "<complexity>" + x.data[w].complexity + "</complexity>";
      y = y + "<preferredkey>" + x.data[w].additional + "</preferredkey>";
      y = y + "</version>";
      y = y + "</song>";
    }
    y = y + "</chordsDB>";
    var z = o();
    a(y, z);
  }
  function e() {
    k("Chords Import function...");
    var w = new window.runtime.Array();
    w.push(new air.FileFilter("VerseVIEW Chords DB", "*.xml"));
    var x = new air.File();
    x.browseForOpen("Select Chords DB in XML format.", w);
    x.addEventListener(air.Event.SELECT, v);
    function v(y) {
      k("Continuing with import....");
      var z = y.currentTarget.nativePath;
      chordsManagerObj.importChordsXML(z);
    }
  }
  function t(w, v) {
    d = w;
    if (d == l) {
      i = v;
    }
    if (d == h) {
      u = v;
    }
  }
  function n() {}
  function a(w, A) {
    var x = "./vvexport/" + A;
    var v = air.File.desktopDirectory;
    v = v.resolvePath(x);
    var y = new air.FileStream();
    y.addEventListener(air.Event.CLOSE, z);
    y.openAsync(v, air.FileMode.WRITE);
    y.writeMultiByte(w, "utf-8");
    y.close();
    function z() {
      rvw.ui.Toast.show(
        "Chords Database",
        "Exported to " + A + " under vvexport folder on the Desktop."
      );
    }
  }
  function o() {
    var x = new Date();
    var w = x.toDateString();
    var v = "";
    v = "vvchords_" + w + ".xml";
    if (d == l) {
      v = "vvchords_" + i + "_" + w + ".xml";
    }
    if (d == h) {
      v = "vvchords_" + u + "_" + w + ".xml";
    }
    return v;
  }
  function k(v) {
    if (m) {
      air.trace("[Chords IMPORT EXPORT]...." + v);
    }
  }
}
