$RvW.setupMenu = function() {
    const { ui: { Menu } } = air;

    const vvMenu = Menu.createFromXML("menu.xml");

    // application or window menu
    Menu.setAsMenu(vvMenu);

    // DOM element context menu
    // Menu.setAsContextMenu(vvMenu);
    // Menu.setAsContextMenu(null);

    // tray icon context menu
    // Menu.setAsIconMenu(vvMenu);
}

function song_new_menu(a) {
  if ($RvW.songNavObj != null) {
    $RvW.songNavObj.sn_newSong();
  }
}
function song_edit_menu(a) {
  if ($RvW.songNavObj != null) {
    $RvW.songNavObj.sn_editSong();
  }
}
function song_delete_menu(a) {
  if ($RvW.songNavObj != null) {
    $RvW.songNavObj.sn_deleteSong();
  }
}
function song_delete_cat_menu(a) {
  if ($RvW.songNavObj != null) {
    $RvW.songNavObj.sn_deleteSongByCat();
  }
}
function songDB_Export_all_db() {
  $RvW.songNavObj.processExportSongDB();
}
function songDB_Export_all_xml() {
  $RvW.songManagerObj.processExportSongXML();
}
function songDB_Export_cat_xml() {
  $RvW.songManagerObj.processExportCatXML();
}
function songDB_Import_db() {
  $RvW.songManagerObj.processImportSongDB();
}
function songDB_Import_xml() {
  $RvW.songManagerObj.processImportSongXML();
}
function setup_bible_version() {
  $RvW.bibleVersionSelObj.show();
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
  $RvW.editVerse_UI_Obj.show();
}
function remoteVV_UI() {
  $RvW.remoteVV_UI_Obj.show();
}
function show_present_setup_UI() {}
function show_updateVV_UI() {
  $RvW.newUpdateObj.checkForUpdates();
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
  // TODO: make it a separate tool window
  $RvW.helpObj.show();
}
function vvPromote_menu1() {
  promoteVV(1);
}
function vvPromote_menu2() {
  promoteVV(2);
}
