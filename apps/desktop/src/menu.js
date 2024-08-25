import { BgContext } from '@/app/background'
import {setupVerseEditObject} from "@/bible/edit";

const MAIN_MENU = [
    {
        label: 'File',
        items: [
            { label: 'Remote', onSelect: remoteVV_UI },
            { label: 'Check for Updates', onSelect: show_updateVV_UI },
            { type: 'separator' },
            { label: 'Exit', onSelect: verseviewExit }
        ]
    },
    {
        label: 'Bible',
        items: [
            { label: 'Add', onSelect: add_bible_version },
            { label: 'Select', onSelect: setup_bible_version },
            { label: 'Manage', onSelect: show_bible_manage },
            { type: 'separator' },
            { label: 'Edit Verse', onSelect: show_editVerse_UI },
        ]
    },
    {
        label: 'Song',
        items: [
            { label: 'New', onSelect: song_new_menu },
            { label: 'Edit', onSelect: song_edit_menu },
            {
                label: 'Delete',
                items: [
                    { label: 'Selected Song', onSelect: song_delete_menu },
                    { label: 'Selected Category', onSelect: song_delete_cat_menu },
                ]
            },
            { type: 'separator' },
            {
                label: 'Export Lyrics',
                items: [
                    { label: 'All Categories', onSelect: songDB_Export_all_xml },
                    { label: 'Selected Category', onSelect: songDB_Export_cat_xml },
                ]
            },
            { label: 'Import Lyrics', onSelect: songDB_Import_xml },
        ]
    },
    {
        label: 'Help',
        items: [
            { label: 'About', onSelect: showAbout }
        ]
    }
];

export function setupMenu() {
    const { ui: { Menu } } = air;

    // New AirMenuBuilder fix
    MAIN_MENU.nodeType = MAIN_MENU.DOCUMENT_NODE = 'MainMenu' /* Value is Dummy */;

    const vvMenu = Menu.createFromJSON(MAIN_MENU);
    // const vvMenu = Menu.createFromXML("menu.xml");

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
    rvw.bible.manageVersion();
    rvw.bible.showBrowse();
}
function show_bible_manage() {
    rvw.bible.manageVersion();
}
function show_editVerse_UI() {
    setupVerseEditObject();
    $RvW.editVerse_UI_Obj.show();
}
function remoteVV_UI() {
    $RvW.remoteVV_UI_Obj.show();
}
function show_updateVV_UI() {
    $RvW.newUpdateObj.checkForUpdates();
}
function verseviewExit() {
    $RvW.processExit();
    window.nativeWindow.close();
}
function addBkgndMenu() {
    BgContext.showBrowse();
}
function deleteBkgndMenu() {
    BgContext.delBkgnd();
}
function showAbout() {
    // TODO: make it a separate tool window
    $RvW.helpObj.show();
}
function vvPromote_menu1() {
    rvw.common.promoteVV(1);
}
function vvPromote_menu2() {
    rvw.common.promoteVV(2);
}
