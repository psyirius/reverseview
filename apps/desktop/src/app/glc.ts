import {_Scheduler_} from "@app/schedule";
import {_BibleManager_, _BibleNavigator_, _Presenter_, _SongManager_, _SongNavigator_} from "@/song/song-manager";

export let songManager: _SongManager_;
export let songNavigator: _SongNavigator_;

export let bibleManager: _BibleManager_;
export let bibleNavigator: _BibleNavigator_;

export let presenter: _Presenter_;
export let scheduler: _Scheduler_;

export function ngInit() {
    songManager = new _SongManager_();
    songNavigator = new _SongNavigator_(songManager);

    bibleManager = new _BibleManager_();
    bibleNavigator = new _BibleNavigator_(bibleManager);

    presenter = new _Presenter_(
        songManager,
        bibleManager,
    );

    scheduler = new _Scheduler_();
}