import {$RvW} from "@/rvw";

const VERSION = 0x0805;

export function isSameCfgVersion() {
    return $RvW.vvConfigObj.get_versionNum() === VERSION;
}

export function updateCfgVersion() {
    $RvW.vvConfigObj.set_versionNum(VERSION);
    $RvW.vvConfigObj.save();
}