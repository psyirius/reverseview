// TODO: make enum
var CHORDS_ADDNEW_PASS = 1;
var CHORDS_ADDNEW_FAIL = 2;
var CHORDS_LOAD_PASS = 3;
var CHORDS_LOAD_FAIL = 4;
var CHORDS_DELETE_PASS = 5;
var CHORDS_DELETE_FAIL = 6;
var CHORDS_UPDATE_PASS = 7;
var CHORDS_UPDATE_FAIL = 8;
var CHORDS_EXPORT_LOAD_PASS = 9;
var CHORDS_EXPORT_LOAD_FAIL = 10;

class chordsManagerClass {
  constructor() {
    this.init = l;
    this.getChordsByTitle = d;
    this.importChordsXML = e;
    this.addNew = f;
    this.deleteChords = g;
    this.updateChords = j;
    this.taskcomplete = k;
    var i = null;
    var b = false;
    function l() {
      a("Initialize Chords Manager");
      $RvW.chordsDatabaseObj = new chordsDatabaseClass();
      $RvW.chordsDatabaseObj.init();
    }
    function d(p) {
      var s = new Array();
      var r = null;
      r = $RvW.chordsDatabaseObj.getAllChords();
      if (r) {
        var m = r.data.length;
        for (var o = 0; o < m; o++) {
          var q = r.data[o].title;
          if (p == q) {
            var n = new chordsObjClass();
            n.id = r.data[o].id;
            n.title = r.data[o].title;
            n.lyrics = r.data[o].lyrics;
            n.chords = r.data[o].chords;
            n.key = r.data[o].key;
            n.chordsby = r.data[o].chordsby;
            n.timestamp = r.data[o].timestamp;
            n.bpm = r.data[o].bpm;
            n.notes = r.data[o].notes;
            n.timesignature = r.data[o].timesignature;
            n.rhythm = r.data[o].rhythm;
            n.complexity = r.data[o].complexity;
            n.tags = r.data[o].tags;
            n.rating = r.data[o].rating;
            n.original = r.data[o].original;
            n.usagecount = r.data[o].usagecount;
            n.category = r.data[o].category;
            n.additional = r.data[o].additional;
            s.push(n);
          }
        }
        return s;
      } else {
        return false;
      }
    }
    function f(m) {
      $RvW.chordsDatabaseObj.addRecord(m);
    }
    function g(m) {
      $RvW.chordsDatabaseObj.deleteRecord(m);
    }
    function j(m, n) {
      $RvW.chordsDatabaseObj.updateRecord(m, n);
    }
    function e(p) {
      a("Importing Chords XML");
      var n;
      var o = new air.File(p);
      n = new XMLHttpRequest();
      n.onreadystatechange = function () {
        if (n.readyState == 4) {
          a("Ready state... " + n.readyState + "  " + n.status);
          i = n.responseXML.documentElement;
          m();
        }
      };
      a(o.url);
      n.open("GET", o.url, true);
      n.send(null);
      function m() {
        a("Adding chords to db records");
        var u = i.getElementsByTagName("song");
        var q = u.length;
        a("Chords XML number of Songs: " + q);
        for (var w = 0; w < q; w++) {
          var s = new chordsObjClass();
          s.title = u[w].getElementsByTagName("name")[0].textContent;
          var v = u[w].getElementsByTagName("lyrics")[0];
          if (v != null) {
            s.lyrics = u[w].getElementsByTagName("lyrics")[0].textContent;
          } else {
            var r = $RvW.songManagerObj.getSongObjWithName(s.title);
            if (r != null) {
              s.lyrics = h(r.slides2);
            } else {
              a("Song without lyrics match : " + s.title);
              s.lyrics = "";
            }
          }
          s.chords = u[w].getElementsByTagName("chords")[0].textContent;
          s.key = u[w].getElementsByTagName("key")[0].textContent;
          s.chordsby = u[w].getElementsByTagName("author")[0].textContent;
          s.timestamp = u[w].getElementsByTagName("timestamp")[0].textContent;
          s.bpm = u[w].getElementsByTagName("bpm")[0].textContent;
          s.notes = u[w].getElementsByTagName("notes")[0].textContent;
          s.timesignature =
            u[w].getElementsByTagName("timesignature")[0].textContent;
          s.rhythm = u[w].getElementsByTagName("rhythm")[0].textContent;
          s.complexity = u[w].getElementsByTagName("complexity")[0].textContent;
          s.tags = "";
          s.rating = 0;
          s.original = false;
          s.usagecount = 0;
          s.category = "";
          s.additional = u[w].getElementsByTagName("preferredkey")[0].textContent;
          $RvW.chordsDatabaseObj.addRecord(s);
        }
        rvw.ui.Toast.show("Chords Import", "Imported " + q + " chords to the database.");
      }
    }
    function k(m, n) {
      switch (m) {
        case CHORDS_ADDNEW_FAIL:
          a("Adding new chords record failed");
          c(n);
          break;
        case CHORDS_ADDNEW_PASS:
          $RvW.chordsDatabaseObj.loadAllChordsRecords();
          break;
        case CHORDS_LOAD_FAIL:
          a("Loading of chords db records to array failed");
          c(n);
          break;
        case CHORDS_UPDATE_FAIL:
          a("Updating chords record failed");
          c(n);
          break;
        case CHORDS_UPDATE_PASS:
          $RvW.chordsDatabaseObj.loadAllChordsRecords();
          break;
        case CHORDS_LOAD_PASS:
          $RvW.chordsNavObj.showChordsPanelForSong();
          break;
        case CHORDS_DELETE_PASS:
          $RvW.chordsDatabaseObj.loadAllChordsRecords();
          break;
        case CHORDS_EXPORT_LOAD_PASS:
          $RvW.chordsImportExportObj.chexport_continue();
          break;
        case CHORDS_EXPORT_LOAD_FAIL:
          c(n);
          break;
        case CHORDS_DELETE_FAIL:
          c(n);
          break;
        default:
          c("Error in code");
      }
    }
    function c(n) {
      rvw.ui.Toast.show("Chords", n);
    }
    function h(p) {
      var m = "";
      var o = p.length;
      for (var n = 0; n < o; n++) {
        m = m + p[n] + "<slide>";
      }
      return m;
    }
    function a(m) {
      if (b) {
        air.trace("[Chords MANAGER]...." + m);
      }
    }
  }
}
