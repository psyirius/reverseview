import {saveFileInAppStorage} from "@app/common";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";
import {Toast} from "@app/toast";
import {bgStillImageList} from "@stores/global";
import {showPrompt} from "@app/ui/Prompt";

export class StillBackground {
    constructor() {
        this.getBkgndFilename = getBkgndFilename;
        this.getLogoFilename = getLogoFilename;

        this.addStillBg = addStillBg;
        this.delStillBg = delStillBg;

        let _bgNames = null;
        let _bgFilenames = null;
        let selectBGFile = null;
        let logoThumbFile = "";

        const IS_DEBUG = true;

        setupState();
        setupEvents();

        function setupState() {
            __debug("Setting values...");
            _bgNames = [];
            _bgFilenames = [];
            selectBGFile = new air.File();
            _loadBGList();
            let logoIndex = $RvW.vvConfigObj.get_logoFilename();
            if (isNaN(logoIndex)) {
                logoIndex = 0;
            }
            logoThumbFile = `./background/${_bgFilenames[logoIndex]}`;
        }

        function setupEvents() {
            __debug("Set events...");

            selectBGFile.addEventListener(air.Event.SELECT, onSelectBg);
        }

        function onSelectBg() {
            __debug("Process adding background");

            const ab = selectBGFile.nativePath;
            const Z = ab.split("\\");
            const V = Z[Z.length - 1];
            let X = true;
            for (let i = 0; i < _bgFilenames.length; i++) {
                if (_bgFilenames[i] === V) {
                    X = false;
                }
            }
            if (X) {
                _bgFilenames.push(V);
                _bgNames.push(V);
                
                const bgf = air.File.applicationStorageDirectory.resolvePath("background/" + V);
                selectBGFile.copyTo(bgf, true);
                
                saveFileInAppStorage(serializeBgListJSON(), "./background/list.json");
                updateListOnUI();
            } else {
                Toast.error("Background Graphics", "Background already exists.");
            }
        }
        
        function _loadBGList() {
            __debug("Load background list...");

            const { File, FileStream, FileMode } = air;

            const ff = File.applicationStorageDirectory.resolvePath("./background/list.json");

            const fz = new FileStream();
            fz.open(ff, FileMode.READ);
            const data = fz.readMultiByte(fz.bytesAvailable, 'utf-8');
            fz.close();

            const bgl = JSON.parse(data);

            for (const bg of bgl) {
                _bgNames.push(bg.name);
                _bgFilenames.push(bg.filename);
            }

            updateListOnUI();
        }

        function addStillBg() {
            if (_bgFilenames.length < 100) {
                const filters = [
                    new air.FileFilter("JPEG", "*.jpg"),
                    new air.FileFilter("PNG", "*.png"),
                ];
                selectBGFile.browseForOpen("Select Background", filters);
            } else {
                Toast.error(
                    "Background Graphics",
                    "VerseVIEW supports a maximum of 50 backgrounds. Please delete backgrounds to add new ones."
                );
            }
        }

        function delStillBg(selectedIndex) {
            __debug("Process deleting background...");

            let bgIdx = $RvW.vvConfigObj.get_bkgndIndex();

            showPrompt({
                title: `Delete Still Background`,
                message: 'Are you sure you want to delete the selected Background?',
                onOk() {
                    const W = selectedIndex;
                    if (bgIdx === selectedIndex) {
                        bgIdx = 0;
                    } else {
                        if (bgIdx > selectedIndex) {
                            bgIdx--;
                        }
                    }
                    let X = $RvW.vvConfigObj.get_logoFilename();
                    if (isNaN(X)) {
                        X = 0;
                    }
                    if (X === selectedIndex) {
                        X = 0;
                    } else {
                        if (X > selectedIndex) {
                            X--;
                        }
                    }

                    $RvW.vvConfigObj.set_logoFilename(X);
                    $RvW.vvConfigObj.save();

                    _bgFilenames.splice(W, 1);
                    _bgNames.splice(W, 1);

                    saveFileInAppStorage(serializeBgListJSON(), "./background/list.json");

                    $RvW.vvConfigObj.set_bkgndIndex(bgIdx);
                    $RvW.vvConfigObj.save();

                    updateListOnUI();
                },
                onCancel() {}
            });
        }

        function updateListOnUI() {
            __debug("Fill the bkgnd table...");

            const V = air.File.applicationStorageDirectory;

            let T = $RvW.vvConfigObj.get_logoFilename();
            if (isNaN(T)) {
                T = 0;
            }
            logoThumbFile = "./background/" + _bgFilenames[T];

            const res = [];

            for (let i = 0; i < _bgFilenames.length; i++) {
                const af = V.resolvePath("./background/" + _bgFilenames[i]);

                res.push({ name: _bgNames[i], url: af.url });
            }

            bgStillImageList.set(res);
        }
        function serializeBgListJSON() {
            const res = [];
            
            for (let i = 0; i < _bgFilenames.length; ++i) {
                res.push({
                    name: _bgNames[i],
                    filename: _bgFilenames[i],
                });
            }
            
            return JSON.stringify(res);
        }
        function getBkgndFilename() {
            const res = [];
            const bgIdx = $RvW.vvConfigObj.get_bkgndIndex();
            res[0] = "./background/" + _bgFilenames[bgIdx];

            if ($RvW.rvwPreferences.get("app.settings.background.still.random", false)) {
                const V = Math.floor(Math.random() * _bgFilenames.length);
                res[0] = "./background/" + _bgFilenames[V];
            }

            return res;
        }

        function getLogoFilename() {
            const T = [];

            if (logoThumbFile !== "" && isLogoFileExists()) {
                T[0] = logoThumbFile;
            } else {
                Toast.error("Logo", "Add and set LOGO file in the Graphics section");
                T[0] = "./background/" + _bgFilenames[0];
            }

            return T;
        }

        function isLogoFileExists() {
            return air.File.applicationStorageDirectory.resolvePath(logoThumbFile).exists;
        }

        function __debug(...messages) {
            if (IS_DEBUG) {
                console.trace("[StillBackground]:", ...messages);
            }
        }
    }
}
