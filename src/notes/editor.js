// NOT USED
// function notes() {
//   this.init = v;
//   this.showNotesPanel = m;
//   this.hideNotesPanel = o;
//   this.setNotesContainerID = r;
//   this.setVariables = c;
//   var h;
//   var u;
//   var f;
//   var s;
//   var e = 0;
//   var d = 0;
//   var w = 0;
//   var A = null;
//   function v() {
//     air.trace("Notes initialization....");
//     x();
//     k();
//     q();
//   }
//   function r(B) {
//     h = B;
//   }
//   function c(B, D, C) {
//     e = B;
//     d = D;
//     w = C;
//   }
//   function k() {
//     air.trace("Initializing Notes panel....");
//     air.trace(h);
//     u = new YAHOO.widget.Panel("notesPanelID", {
//       width: "625px",
//       fixedcenter: true,
//       modal: true,
//       visible: false,
//       constraintoviewport: true,
//     });
//   }
//   function q() {
//     air.trace("Generating Notes panel Content....");
//     u.setHeader("Notes");
//     var B = '<textarea id="notes_rte"></textarea>';
//     B = B + '<input type="button" id="notesSaveButton" value=" SAVE ">';
//     B = B + '<input type="button" id="notesCancelButton" value=" CANCEL ">';
//     u.setBody(B);
//     u.render();
//     f = new YAHOO.widget.Editor("notes_rte", {
//       width: "600px",
//       height: "200px",
//     });
//     f.render();
//     u.showEvent.subscribe(f.show, f, true);
//     u.hideEvent.subscribe(f.hide, f, true);
//     document
//       .getElementById("notesSaveButton")
//       .addEventListener("click", t, false);
//     document
//       .getElementById("notesCancelButton")
//       .addEventListener("click", p, false);
//   }
//   function m() {
//     u.show();
//   }
//   function o() {
//     u.hide();
//   }
//   function x() {
//     var B = "./notes/defaultnotes.db";
//     A = new air.SQLConnection();
//     A.addEventListener(air.SQLEvent.OPEN, i);
//     A.addEventListener(air.SQLErrorEvent.ERROR, z);
//     var C = air.File.applicationStorageDirectory.resolvePath(B);
//     A.openAsync(C);
//   }
//   function i(B) {
//     air.trace("Notes DB was created successfully");
//     g();
//   }
//   function z(B) {
//     air.trace("Error message:", B.error.message);
//     air.trace("Details (create DB):", B.error.details);
//   }
//   function g() {
//     var C = new air.SQLStatement();
//     C.sqlConnection = A;
//     var B =
//       "CREATE TABLE IF NOT EXISTS notesTable (noteId INTEGER PRIMARY KEY AUTOINCREMENT, noteText TEXT, noteTextFormat TEXT, bookNum INTEGER, chNum INTEGER, verseNum INTEGER )";
//     C.text = B;
//     C.addEventListener(air.SQLEvent.RESULT, b);
//     C.addEventListener(air.SQLErrorEvent.ERROR, l);
//     C.execute();
//   }
//   function b(B) {
//     air.trace("Created notes Table...");
//   }
//   function l(B) {
//     air.trace("Error message:", B.error.message);
//     air.trace("Details (create DB):", B.error.details);
//   }
//   function a(C, B) {
//     var E = new air.SQLStatement();
//     E.sqlConnection = A;
//     var D =
//       "INSERT INTO notesTable (noteText, noteTextFormat, bookNum, chNum, verseNum) VALUES (:noteText, :noteTextFormat, :b, :c, :v);";
//     E.text = D;
//     E.addEventListener(air.SQLEvent.RESULT, j);
//     E.addEventListener(air.SQLErrorEvent.ERROR, n);
//     E.parameters[":noteText"] = C;
//     E.parameters[":noteTextFormat"] = B;
//     E.parameters[":b"] = e;
//     E.parameters[":c"] = d;
//     E.parameters[":v"] = w;
//     E.execute();
//   }
//   function j(B) {
//     air.trace("Added to the database....");
//   }
//   function n(B) {
//     air.trace("Error message:", B.error.message);
//     air.trace("Details (create DB):", B.error.details);
//   }
//   function y() {
//     var B = new air.SQLStatement();
//     B.sqlConnection = A;
//     var C =
//       "SELECT noteTextFormat, bookNum, chNum, verseNum FROM notesTable WHERE bookNum = :b";
//     var C =
//       "SELECT word, bookNum, chNum, verseNum FROM words WHERE word LIKE :param1 ";
//   }
//   function t() {
//     air.trace("Saving Notes.....");
//     var E = f.getEditorHTML();
//     var C = f.cleanHTML(E);
//     air.trace(E);
//     air.trace(C);
//     var D = /<\S[^><]*>/g;
//     var B = C.replace(/<br>/gi, "\n").replace(D, "");
//     air.trace(B);
//     a(B, C);
//   }
//   function p() {
//     air.trace("Cancelling notes....");
//   }
// }
// function postit() {
//   this.init = d;
//   var a = null;
//   var e;
//   var c;
//   var f;
//   function d(h, g, j, i) {
//     a = h;
//     e = g;
//     c = j;
//     f = i;
//     document.getElementById(a).addEventListener("click", b, false);
//   }
//   function b() {
//     $RvW.notesObj.setVariables(e, c, f);
//     $RvW.notesObj.showNotesPanel();
//   }
// }
