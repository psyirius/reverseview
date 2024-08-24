// TODO: clean up this file
!(function (exports) {
    let task1 = false;
    let task2 = true;

    function isUpToDate() {
        const a = $RvW.vvConfigObj.get_versionNum();
        return a === rvw.vu.version_number;
    }

    function checkVerUpdateFlags() {
        if (task1 && task2) {
            $RvW.vvConfigObj.set_versionNum(rvw.vu.version_number);
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

    // Exports
    exports.isUpToDate = isUpToDate;
    exports.checkVerUpdateFlags = checkVerUpdateFlags;
    exports.task1Complete = task1Complete;
    exports.task2Complete = task2Complete;
    exports.task1Status = task1Status;
    exports.task2Status = task2Status;

    exports.version_number = 14;
}(rvw.provide("rvw.vu")));

// rvw.vu.