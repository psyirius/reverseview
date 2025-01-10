import {_Scheduler_} from "@app/schedule";
import {_BibleManager_, _Presenter_, _SongManager_} from "@/song/song-manager";

export let songManager: _SongManager_;
export let bibleManager: _BibleManager_;
export let scheduler: _Scheduler_;
export let presenter: _Presenter_;

export function ngInit() {
    songManager = new _SongManager_();
    bibleManager = new _BibleManager_();
    scheduler = new _Scheduler_();

    presenter = new _Presenter_(
        songManager,
        bibleManager,
    );
}