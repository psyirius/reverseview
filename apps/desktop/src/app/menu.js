import {$RvW} from "@/rvw";
import {importBible} from "@/bible/version";
import {console} from "@/platform/adapters/air";
import {
    selectedBibleVersionForVerseEdit,
    selectedSong,
    selectedSongCategory, showBibleManagePanel,
    showBibleSelectPanel,
    showRemotePanel,
    showVerseEditPanel
} from "@stores/global";
import {songManager, songNavigator} from "@app/glc";

const MAIN_MENU = [
    {
        label: 'File',
        items: [
            { label: 'Remote', onSelect: remoteVV_UI },
            // { label: 'Check for Updates', onSelect: () => {} },
            { type: 'separator' },
            { label: 'Exit', onSelect: verseviewExit }
        ]
    },
    {
        label: 'Bible',
        items: [
            { label: 'Add', onSelect: add_bible_version },
            { label: 'Select', onSelect: onClickBibleSelect },
            { label: 'Manage', onSelect: show_bible_manage },
            { type: 'separator' },
            {
                label: 'Edit Verse',
                items: [
                    { label: 'Primary', onSelect: show_editVerse_UI_1 },
                    { label: 'Secondary', onSelect: show_editVerse_UI_2 },
                ]
            },
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
        label: 'Window',
        items: [
            {
                label: 'Stay on Top',
                type: 'check',
                toggled: false,
                onSelect: toggleStayOnTop,
            },
        ]
    },
    {
        label: 'Help',
        items: [
            { label: 'About', onSelect: showAbout }
        ]
    },
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

function toggleStayOnTop(e, d) {
    d.checked = !d.checked;

    const { nativeWindow } = window;

    nativeWindow.alwaysInFront = d.checked;
}

function song_new_menu() {
    songNavigator.showSongCreateDialog();
}
function song_edit_menu() {
    const song = selectedSong.get();

    if (song) {
        songNavigator.showSongEditDialog(song);
    }
}
function song_delete_menu(a) {
    const song = selectedSong.get();

    if (song) {
        songNavigator.delete(song);
    }
}
function song_delete_cat_menu() {
    const category = selectedSongCategory.get();

    if (category) {
        songNavigator.deleteByCategory(category);
    } else {
        console.log('No Category Selected')
    }
}
function songDB_Export_all_xml() {
    songManager.exportSongXML();
}
function songDB_Export_cat_xml() {
    songManager.exportCatSongsXML();
}
function songDB_Import_xml() {
    songManager.importFromXML();
}
function onClickBibleSelect() {
    showBibleSelectPanel.set(true);
}
function add_bible_version() {
    showBibleManagePanel.set(true);
    importBible();
}
function show_bible_manage() {
    showBibleManagePanel.set(true);
}
function show_editVerse_UI_1() {
    selectedBibleVersionForVerseEdit.set(0);
    showVerseEditPanel.set(true);
}
function show_editVerse_UI_2() {
    selectedBibleVersionForVerseEdit.set(1);
    showVerseEditPanel.set(true);
}
function remoteVV_UI() {
    showRemotePanel.set(true);
}
function verseviewExit() {
    $RvW.processExit();
    window.nativeWindow.close();
}
function showAbout() {
    // TODO: make it a separate tool window
    // Implement AboutPanel
}
