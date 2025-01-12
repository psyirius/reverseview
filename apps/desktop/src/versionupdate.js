import {$RvW} from "@/rvw";

// TODO: clean up this file
let version_number = 14;

let task1 = false; // song db update task
let task2 = true; // webroot copy task

export function isUpToDate() {
    return $RvW.vvConfigObj.get_versionNum() === version_number;
}

export function checkVerUpdateFlags() {
    if (task1 && task2) {
        $RvW.vvConfigObj.set_versionNum(version_number);
        $RvW.vvConfigObj.save();
    }
}

export function task2Complete() {
    task2 = true;
}
export function task2Status() {
    return task2;
}