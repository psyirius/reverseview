import {showSongEditPanel, selectedSongForEdit} from "@stores/global";

export class SongEdit {
    static _loadSong(sngObj) {
        if (sngObj != null) { // if edit mode
            selectedSongForEdit.set({
                id: sngObj.id,
                name: sngObj.name,
                name2: sngObj.name2,
                songNumber: sngObj.subcat,
                tags: sngObj.tags,
                notes: sngObj.notes,
                key: sngObj.key,
                author: sngObj.copyright,
                youtube: sngObj.yvideo,
                slides1: sngObj.slides,
                slides2: sngObj.slides2,
                slideSequence: sngObj.slideseq,
                category: sngObj.catIndex,
                font1: sngObj.font,
                font2: sngObj.font2,
            });
        } else { // if add mode
            selectedSongForEdit.set({
                id: null,
                name: '',
                name2: '',
                songNumber: null,
                tags: '',
                notes: '',
                key: '',
                author: '',
                youtube: '',
                slides1: [],
                slides2: [],
                slideSequence: '',
                category: null,
                font1: undefined,
                font2: undefined,
            });
        }
    }

    static showEditPanel(song) {
        this._loadSong(song);
        showSongEditPanel.set(true);
    }
}