function manageNotes() {
  this.init = N;
  this.nm_addRecord_ext = C;
  var f = false;
  var h = false;
  var A = true;
  var B = "./notes/nm.db";
  var p = null;
  var G = "";
  var E = "";
  var e = "";
  var D = false;
  var w = null;
  var k = new Array();
  var d = "";
  var l;
  function N(W) {
    h = W;
    m();
    f = false;
    o();
  }
  function m() {
    document.getElementById("nm_selectID").addEventListener("change", j, false);
    document
      .getElementById("nm_sel_buttonID")
      .addEventListener("click", y, false);
    document.getElementById("nm_deleteID").addEventListener("click", U, false);
    document
      .getElementById("nm_add_buttonID")
      .addEventListener("click", H, false);
    document
      .getElementById("nm_save_file_buttonID")
      .addEventListener("click", O, false);
    document.getElementById("nm_newID").addEventListener("click", u, false);
    document
      .getElementById("nm_note_type1")
      .addEventListener("change", F, false);
    document
      .getElementById("nm_note_type2")
      .addEventListener("change", F, false);
    document
      .getElementById("nm_save_promptID")
      .addEventListener("click", J, false);
    document
      .getElementById("nm_cancel_promptID")
      .addEventListener("click", T, false);
    document.getElementById("nm_new_promptID").style.visibility = "hidden";
    YAHOO.namespace("example.container");
    YAHOO.example.container.tt1 = new YAHOO.widget.Tooltip("tt1", {
      context: "nm_sel_buttonID",
      text: "Click to select this Notes file as active",
    });
    YAHOO.example.container.tt2 = new YAHOO.widget.Tooltip("tt2", {
      context: "nm_deleteID",
      text: "Click to delete this Notes file",
    });
    YAHOO.example.container.tt3 = new YAHOO.widget.Tooltip("tt3", {
      context: "nm_add_buttonID",
      text: "Click to load Notes file",
    });
    YAHOO.example.container.tt4 = new YAHOO.widget.Tooltip("tt4", {
      context: "nm_newID",
      text: "Click to create new Notes file",
    });
    YAHOO.example.container.tt5 = new YAHOO.widget.Tooltip("tt5", {
      context: "nm_saveID",
      text: "Click to save new Notes file",
    });
    YAHOO.example.container.tt6 = new YAHOO.widget.Tooltip("tt6", {
      context: "nm_save_file_buttonID",
      text: "Click to save the Notes file to Desktop",
    });
    YAHOO.example.container.tt7 = new YAHOO.widget.Tooltip("tt7", {
      context: "nm_save_promptID",
      text: "Click to initiate new Notes file",
    });
    YAHOO.example.container.tt8 = new YAHOO.widget.Tooltip("tt8", {
      context: "nm_cancel_promptID",
      text: "Click to cancel creating new Notes file",
    });
  }
  function j() {
    var W = document.getElementById("nm_selectID").selectedIndex;
    document.getElementById("nm_nameID").innerHTML = w.data[W].name;
    document.getElementById("nm_descriptionID").innerHTML =
      w.data[W].description;
  }
  function y() {
    var Y = document.getElementById("nm_selectID");
    var aa = Y.options[Y.selectedIndex].value;
    var X = l;
    l = aa;
    R(aa, true);
    R(X, false);
    var W = S(aa);
    var Z = "./notes/" + W.filename;
    $RvW.notesObj.init(Z);
  }
  function U() {
    var aa = document.getElementById("nm_selectID");
    var X = aa.options[aa.selectedIndex].value;
    var W = S(X);
    var ab = W.filename;
    if (ab == "defaultnotes.db") {
      rvw.ui.Toast.show("Bible Notes", "The Default Notes file can not be deleted.");
    } else {
      if (ab == d) {
        rvw.ui.Toast.show(
          "Bible Notes",
          ab + " is the active notes file and can not be deleted."
        );
      } else {
        var Z = "Bible Notes";
        var ac = "Are you sure you want to delete " + ab;
        rvw.ui.Prompt.exec(Z, ac, Y);
        function Y() {
          V(X);
          ab = "./notes/" + ab;
          var ae = air.File.applicationStorageDirectory.resolvePath(ab);
          try {
            ae.deleteFile();
            rvw.ui.Toast.show("Bible Notes", "Deleted Notes file " + ab);
          } catch (ad) {
            rvw.ui.Toast.show(
              "Bible Notes",
              " Please restart VerseVIEW to update the notes list"
            );
          }
        }
      }
    }
  }
  function H() {
    var Y = air.File.desktopDirectory;
    var W = new air.FileFilter("VerseVIEW DB", "*.db");
    Y.browseForOpen("Open", new window.runtime.Array(W));
    Y.addEventListener(air.Event.SELECT, X);
    function X() {
      var Z = air.File.applicationStorageDirectory;
      var ac = extractFileName(Y.nativePath);
      var aa = "./notes/" + ac;
      Z = Z.resolvePath(aa);
      Y.copyTo(Z, true);
      Y = null;
      rvw.ui.Toast.show("Bible Notes", "Notes Database Added to VerseVIEW");
      var ab = new notesInfo();
      ab.init(ac);
    }
  }
  function O() {
    var ae = document.getElementById("nm_selectID");
    var ad = ae.options[ae.selectedIndex].value;
    var ac = w.data.length;
    for (var ag = 0; ag < ac; ag++) {
      if (ad == w.data[ag].nmId) {
        ad = ag;
        break;
      }
    }
    var Y = w.data[ad].filename;
    var X = "./notes/" + Y;
    var Z = air.File.applicationStorageDirectory;
    Z = Z.resolvePath(X);
    var af = air.File.desktopDirectory;
    var ab = "./vvexport/" + Y;
    af = af.resolvePath(ab);
    Z.addEventListener(air.Event.COMPLETE, aa);
    Z.addEventListener(air.IOErrorEvent.IO_ERROR, W);
    Z.copyToAsync(af, true);
    function aa(ah) {
      rvw.ui.Toast.show(
        "Bible Notes",
        "Notes file " + Y + ' saved to Desktop under the "vvexport" folder'
      );
    }
    function W(ah) {
      rvw.ui.Toast.show("Bible Notes", "Unable to save Notes to Desktop");
    }
  }
  function T() {
    P(false);
    document.getElementById("nm_name_promptID").value = "";
    document.getElementById("nm_description_promptID").value = "";
    document.getElementById("nm_sel_dataID").style.visibility = "visible";
    document.getElementById("nm_new_promptID").style.visibility = "hidden";
  }
  function u() {
    P(true);
    document.getElementById("nm_name_promptID").value = "";
    document.getElementById("nm_description_promptID").value = "";
    document.getElementById("nm_sel_dataID").style.visibility = "hidden";
    document.getElementById("nm_new_promptID").style.visibility = "visible";
  }
  function F() {
    var Y = document.getElementById("nm_note_type1");
    var X = document.getElementById("nm_note_type2");
    if (Y.checked) {
      var W = document.getElementById("bookList").selectedIndex + 1;
      var Z = document.getElementById("chapterList").selectedIndex + 1;
      $RvW.notesObj.getNotes(W, Z, 0);
    } else {
      $RvW.notesObj.getNotes(-1, 0, 0);
    }
  }
  function J() {
    var X = document.getElementById("nm_name_promptID").value;
    var Y = document.getElementById("nm_description_promptID").value;
    X = r(X);
    var W = g(X);
    if (W) {
      P(false);
      document.getElementById("nm_sel_dataID").style.visibility = "visible";
      document.getElementById("nm_new_promptID").style.visibility = "hidden";
      G = X;
      E = M(X);
      e = Y;
      D = false;
      x();
    } else {
      rvw.ui.Toast.show("Bible Notes", "Invalid Notes name.");
    }
  }
  function c() {
    t();
  }
  function v() {
    if (w.data != null) {
      clearSelectList("nm_selectID");
      var X = w.data.length;
      for (var Y = 0; Y < X; Y++) {
        var W = w.data[Y];
        document.getElementById("nm_selectID").options[Y] = new Option(
          W.name,
          W.nmId
        );
        if (W.selected) {
          document.getElementById("nm_selectID").selectedIndex = Y;
          document.getElementById("nm_nameID").innerHTML = W.name;
          document.getElementById("nm_descriptionID").innerHTML = W.description;
          l = W.nmId;
        }
      }
    }
  }
  function M(Z) {
    var W = Z.replace(" ", "_");
    W = W.substr(0, 8);
    W = W.toLowerCase();
    if (W == "defaultnotes") {
      var X = Math.floor(Math.random() * 1000);
      W = W + X + ".db";
    } else {
      W = W + ".db";
    }
    K();
    var aa = k.length;
    for (var Y = 0; Y < aa; Y++) {
      if (W == k[Y]) {
        var X = Math.floor(Math.random() * 1000);
        W = "a" + X + W;
        Y = 0;
      }
    }
    return W;
  }
  function K() {
    if (w.data != null) {
      var X = w.data.length;
      for (var Y = 0; Y < X; Y++) {
        var W = w.data[Y];
        k[Y] = W.filename;
      }
    }
  }
  function q() {
    if (h) {
      G = "Default Notes";
      E = "defaultnotes.db";
      e =
        "Default notes. Automatically created when VerseVIEW is launched the first time.";
      D = true;
      x();
    } else {
      a();
    }
  }
  function L() {
    if (w.data != null) {
      var X = w.data.length;
      for (var Y = 0; Y < X; Y++) {
        var W = w.data[Y];
        if (W.selected) {
          d = W.filename;
          break;
        }
      }
    }
  }
  function Q() {
    var W = "./notes/defaultnotes.db";
    return W;
  }
  function C(X, W, Y) {
    G = X;
    E = Y;
    e = W;
    D = false;
    x();
  }
  function S(Z) {
    var X = w.data.length;
    for (var Y = 0; Y < X; Y++) {
      var W = w.data[Y];
      if (W.nmId == Z) {
        return W;
      }
    }
  }
  function P(W) {
    document.getElementById("nm_newID").disabled = W;
    document.getElementById("nm_add_buttonID").disabled = W;
    document.getElementById("nm_selectID").disabled = W;
    document.getElementById("nm_sel_buttonID").disabled = W;
    document.getElementById("nm_deleteID").disabled = W;
    document.getElementById("nm_save_file_buttonID").disabled = W;
  }
  function g(W) {
    if (W.length == 0 || W == null) {
      return false;
    } else {
      return true;
    }
  }
  function r(X) {
    var W = X;
    W = W.replace(/[^a-zA-Z 0-9]+/g, "");
    W = W.replace(/ /g, "");
    return W;
  }
  function t() {
    air.trace("");
    if (w.data != null) {
      var X = w.data.length;
      for (var Y = 0; Y < X; Y++) {
        var W = w.data[Y];
        air.trace(
          W.nmId + " | " + W.name + " | " + W.filename + " | " + W.selected
        );
      }
    } else {
      air.trace("[NM] No Records!!!");
    }
    air.trace("");
  }
  function o() {
    p = new air.SQLConnection();
    p.addEventListener(air.SQLEvent.OPEN, i);
    p.addEventListener(air.SQLErrorEvent.ERROR, b);
    var W = air.File.applicationStorageDirectory.resolvePath(B);
    p.openAsync(W);
  }
  function i(W) {
    f = true;
    n();
  }
  function b(W) {
    f = false;
  }
  function n() {
    createStmt = new air.SQLStatement();
    createStmt.sqlConnection = p;
    var W =
      "CREATE TABLE IF NOT EXISTS nm (nmId INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, filename TEXT, description TEXT, selected BOOLEAN )";
    createStmt.text = W;
    createStmt.addEventListener(air.SQLEvent.RESULT, s);
    createStmt.addEventListener(air.SQLErrorEvent.ERROR, z);
    createStmt.execute();
  }
  function s() {
    createStmt.removeEventListener(air.SQLEvent.RESULT, s);
    createStmt.removeEventListener(air.SQLErrorEvent.ERROR, z);
    q();
  }
  function z(W) {
    createStmt.removeEventListener(air.SQLEvent.RESULT, s);
    createStmt.removeEventListener(air.SQLErrorEvent.ERROR, z);
    air.trace("Error message:", W.error.message);
    air.trace("Details in creating table :", W.error.details);
  }
  function I() {
    f = false;
  }
  function x() {
    var X = new air.SQLStatement();
    X.sqlConnection = p;
    var Z = "";
    Z +=
      "INSERT INTO nm (name, filename, description, selected) VALUES (:n, :fn, :des, :s);";
    X.text = Z;
    X.addEventListener(air.SQLEvent.RESULT, W);
    X.addEventListener(air.SQLErrorEvent.ERROR, Y);
    X.parameters[":n"] = G;
    X.parameters[":fn"] = E;
    X.parameters[":des"] = e;
    X.parameters[":s"] = D;
    X.execute();
    function W(aa) {
      X.removeEventListener(air.SQLEvent.RESULT, insertResult);
      X.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
      a();
    }
    function Y(aa) {
      X.removeEventListener(air.SQLEvent.RESULT, insertResult);
      X.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
      air.trace("INSERT error:", aa.error);
      air.trace("event.error.code:", aa.error.code);
      air.trace("event.error.message:", aa.error.message);
    }
  }
  function a() {
    var Y = new air.SQLStatement();
    Y.sqlConnection = p;
    var Z = "SELECT * FROM nm";
    Y.text = Z;
    Y.addEventListener(air.SQLEvent.RESULT, X);
    Y.addEventListener(air.SQLErrorEvent.ERROR, W);
    Y.execute();
    function X(ab) {
      w = Y.getResult();
      L();
      v();
      if (A) {
        var aa = "./notes/" + d;
        $RvW.notesObj.init(aa);
        A = false;
      }
    }
    function W(aa) {
      air.trace("Notes Manager data error...");
    }
  }
  function V(Z) {
    var Y = new air.SQLStatement();
    Y.sqlConnection = p;
    var aa = "";
    aa += "DELETE FROM nm WHERE nmID = :id;";
    Y.text = aa;
    Y.addEventListener(air.SQLEvent.RESULT, W);
    Y.addEventListener(air.SQLErrorEvent.ERROR, X);
    Y.parameters[":id"] = Z;
    Y.execute();
    function W(ab) {
      Y.removeEventListener(air.SQLEvent.RESULT, insertResult);
      Y.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
      a();
    }
    function X(ab) {
      Y.removeEventListener(air.SQLEvent.RESULT, insertResult);
      Y.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
      air.trace("Error deleting notes DB");
      air.trace("event.error.code:", ab.error.code);
      air.trace("event.error.message:", ab.error.message);
    }
  }
  function R(X, Z) {
    var Y = new air.SQLStatement();
    Y.sqlConnection = p;
    var ab = "";
    ab += "UPDATE nm SET selected = :val WHERE nmID = :id;";
    Y.text = ab;
    Y.addEventListener(air.SQLEvent.RESULT, W);
    Y.addEventListener(air.SQLErrorEvent.ERROR, aa);
    Y.parameters[":id"] = X;
    Y.parameters[":val"] = Z;
    Y.execute();
    function W(ac) {
      Y.removeEventListener(air.SQLEvent.RESULT, W);
      Y.removeEventListener(air.SQLErrorEvent.ERROR, aa);
      a();
    }
    function aa(ac) {
      Y.removeEventListener(air.SQLEvent.RESULT, W);
      Y.removeEventListener(air.SQLErrorEvent.ERROR, aa);
      rvw.ui.Toast.show("Bible Notes", "Error Updating Selected");
      air.trace("event.error.code:", ac.error.code);
      air.trace("event.error.message:", ac.error.message);
    }
  }
}