function song_new_menu(a) {
  if (songNavObj != null) {
    songNavObj.sn_newSong();
  }
}
function song_edit_menu(a) {
  if (songNavObj != null) {
    songNavObj.sn_editSong();
  }
}
function song_delete_menu(a) {
  if (songNavObj != null) {
    songNavObj.sn_deleteSong();
  }
}
function song_delete_cat_menu(a) {
  if (songNavObj != null) {
    songNavObj.sn_deleteSongByCat();
  }
}
function songDB_Export_all_db() {
  songNavObj.processExportSongDB();
}
function songDB_Export_all_xml() {
  songManagerObj.processExportSongXML();
}
function songDB_Export_cat_xml() {
  songManagerObj.processExportCatXML();
}
function songDB_Import_db() {
  songManagerObj.processImportSongDB();
}
function songDB_Import_xml() {
  songManagerObj.processImportSongXML();
}
function setup_bible_version() {
  bibleVersionSelObj.show();
}
function add_bible_version() {
  manageVersion();
  showBrowse();
}
function show_bible_manage() {
  manageVersion();
}
function show_editVerse_UI() {
  setupVerseEditObject();
  editVerse_UI_Obj.show();
}
function remoteVV_UI() {
  remoteVV_UI_Obj.show();
}
function show_present_setup_UI() {}
function show_updateVV_UI() {
  newUpdateObj.checkForUpdates();
}
function verseviewExit() {
  processExit();
  window.nativeWindow.close();
}
function addBkgndMenu() {
  bkgnd.showBrowse();
}
function deleteBkgndMenu() {
  bkgnd.delBkgnd();
}
function resetFGMenu() {
  cpObj.cp_reset();
}
function exportchords() {
  air.trace("Export Chords");
  export_chords();
}
function importchords() {
  air.trace("Import Chords");
  importnew_chords();
}
function showHelp_menu() {
  helpObj.showHelp();
}
function vvPromote_menu1() {
  promoteVV(1);
}
function vvPromote_menu2() {
  promoteVV(2);
}