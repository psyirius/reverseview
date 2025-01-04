import {_Scheduler_} from "@app/schedule";
import {_SongManager_} from "@/song/song-manager";
import {$RvW} from "@/rvw";

$RvW.english_booknames = [];

export const songManager = new _SongManager_();
export const scheduler = new _Scheduler_();