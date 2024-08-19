var version_number = 14;
var task1 = false;
var task2 = true;
function isUpToDate() {
    var a = $RvW.vvConfigObj.get_versionNum();
    if (a == version_number) {
        return true;
    } else {
        return false;
    }
}
function checkVerUpdateFlags() {
    if (task1 && task2) {
        $RvW.vvConfigObj.set_versionNum(version_number);
        $RvW.vvConfigObj.save();
    }
}
function task1Complete() {
    task1 = true;
}
function task2Complete() {
    task2 = true;
}
function task1Status() {
    return task1;
}
function task2Status() {
    return task2;
}
