import {_Scheduler_} from "@app/schedule";
import {_SongManager_} from "@/song/song-manager";

export let songManager: _SongManager_;
export let scheduler: _Scheduler_;

export function ngInit() {
    songManager = new _SongManager_()
    scheduler = new _Scheduler_();
}