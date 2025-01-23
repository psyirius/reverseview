import {presentationCtx} from "@app/presentation";
import {presentation} from "@/p_window";
import {Toast} from "@app/toast";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";
import {getPrimaryBibleVersion} from "@/bible/version";

export function saveFileInAppStorage(content, filename) {
    // fs.writeFileSync(
    //     fs.resolveUrlInAppStorageDir(filename),
    //     content,
    //     "utf-8"
    // );
    const {
        File,
        FileStream,
        FileMode,
    } = air;
    const { applicationStorageDirectory: appStorageDir } = File;

    const b = appStorageDir.resolvePath(filename);
    const e = new FileStream();
    e.open(b, FileMode.WRITE);
    e.writeMultiByte(content, "utf-8");
    e.close();
}

export function saveVVExportInDesktop(content, name) {
    // fs.writeFileSync(
    //     fs.resolveUrlInDesktopDir(`./vvexport/${name}.html`),
    //     content,
    //     "utf-8"
    // );
    const filename = `./vvexport/${name}.html`;
    const dtFilename = air.File.desktopDirectory.resolvePath(filename);
    const fz = new air.FileStream();
    fz.open(dtFilename, air.FileMode.WRITE);
    fz.writeMultiByte(content, "utf-8");
    fz.close();
}

export function fileExist(path, kind) {
    const { File } = air;
    const { applicationDirectory: appDir } = File;
    const { applicationStorageDirectory: appStorageDir } = File;

    let c = (kind === 1) ? appStorageDir : appDir;
    c = c.resolvePath(path);
    return c.exists;
}

export function createFolder(b) {
    const { File } = air;
    const { applicationStorageDirectory: appStorageDir } = File;

    const a = appStorageDir.resolvePath(b);
    if (!a.exists) {
        a.createDirectory();
        console.trace("Directory Created..");
    } else {
        console.trace("directory already exists...");
    }
}

export function clearSelectList(a) {
    if (document.getElementById(a) != null) {
        document.getElementById(a).innerHTML = "";
        return true;
    } else {
        return false;
    }
}

export function copyFile2AppStorage(appDirSrc, appStorageDirDst) {
    const { File } = air;
    const { applicationDirectory: appDir } = File;
    const { applicationStorageDirectory: appStorageDir } = File;

    const src = appDir.resolvePath(appDirSrc);
    const dst = appStorageDir.resolvePath(appStorageDirDst);

    src.copyTo(dst, true);

    return dst.exists;
}

export function backupWebroot() {
    const { File } = air;
    const { applicationStorageDirectory: appStorageDir } = File;

    console.trace("Came to backup Webroot...");

    const wr = appStorageDir.resolvePath("webroot");
    if (wr.exists) {
        const wrb = appStorageDir.resolvePath("webroot_backup6");
        if (!wrb.exists) {
            try {
                wr.moveTo(wrb, true);
                return true;
            } catch (b) {
                Toast.error("Creating Webroot Backup", b.message);
                return false;
            }
        } else {
            Toast.error("Creating Webroot Backup", "Backup already exists.");
            return true;
        }
    } else {
        return true;
    }
}

export function extractFileName(d) {
    const segments = d.split(air.File.separator);
    return segments[segments.length - 1];
}

export function IsNumeric(v) {
    const charSet = "0123456789";
    for (let i = 0; i < v.length; i++) {
        const char = v.charAt(i);
        if (charSet.indexOf(char) === -1) {
            return false;
        }
    }
    return true;
}

export class BibleReference {
    constructor() {
        this.init = init;
        this.present = present;
        this.getErrorMessage = getErrorMessage;
        this.getVerseText = getVerseText;
        this.getVerseFont = getVerseFont;
        this.getBook = getBook;
        this.getChapter = getChapter;
        this.getVerse = getVerse;

        var f = null;
        var m = null;
        var c = null;
        var s = null;
        var p = null;
        var e = null;
        var k = "";
        var j = false;

        function init(u) {
            f = u;
            k = "";
            return h();
        }

        function h() {
            var D = true;
            var B = f;
            d("Processing ...: " + B);
            p = 1;
            e = 1;
            B = B.replace(/^\s+|\s+$/g, "");
            B = B.replace(/\s\s+/g, " ");
            var E = B.split(" ");
            var t = E.length;
            var C = IsNumeric(E[0]);
            if (C && E[1] != null) {
                m = E[0] + " " + E[1].toLowerCase();
                if (E[2] != null) {
                    const y = E[2].indexOf(":");
                    if (y !== -1) {
                        E = E[2].split(":");
                        p = E[0];
                        e = E[1];
                    } else {
                        p = E[2];
                        if (E[3] != null) {
                            e = E[3];
                        }
                    }
                }
            } else {
                m = E[0].toLowerCase();
                if (E[1] != null) {
                    const y = E[1].indexOf(":");
                    if (y !== -1) {
                        E = E[1].split(":");
                        p = E[0];
                        e = E[1];
                    } else {
                        p = E[1];
                        if (E[2] != null) {
                            e = E[2];
                        }
                    }
                }
            }
            d(m);
            d(p);
            d(e);
            var x = $RvW.booknames.length;
            s = -1;
            for (var z = 0; z < x; z++) {
                var w = $RvW.booknames[z].toLowerCase();
                var A = new RegExp("^ " + m);
                var F = A.test(w);
                if (F) {
                    d($RvW.booknames[z]);
                    c = $RvW.booknames[z];
                    s = z;
                    break;
                }
            }
            if (s === -1) {
                d(
                    "Failed finding in version 1 language, so finding in default language..."
                );
                for (var z = 0; z < x; z++) {
                    var w = $RvW.default_booknames[z].toLowerCase();
                    var A = new RegExp("^" + m);
                    var F = A.test(w);
                    if (F) {
                        d($RvW.default_booknames[z]);
                        c = $RvW.booknames[z];
                        s = z;
                        break;
                    }
                }
            }
            if (!IsNumeric(p)) {
                k = "Invalid chapter number.";
                D = false;
            } else {
                if (!IsNumeric(e)) {
                    k = "Invalid verse number.";
                    D = false;
                } else {
                    if (s === -1) {
                        k = "Did not find matching book name to " + m;
                        D = false;
                    } else {
                        const v = $RvW.numofch[s + 1][0];
                        d("Last Chapter number: " + v);
                        if (p < 1 || p > v) {
                            k = "Invalid chapter number for the book " + c;
                            D = false;
                        } else {
                            const u = $RvW.numofch[s + 1][p];
                            d("Last Verse number: " + u);
                            if (e < 1 || e > u) {
                                k = "Invalid verse number for " + c + " " + p;
                                D = false;
                            }
                        }
                    }
                }
            }
            return D;
        }

        function present() {
            var t = s;
            var w = p - 1;
            var u = e - 1;
            $RvW.present_external(t, w, u);
            return true;

            // $RvW.bookIndex = s;
            // $RvW.chapterIndex = p - 1;
            // $RvW.verseIndex = e - 1;
            // $RvW.recentBibleRefs.addSelection($RvW.bookIndex, $RvW.chapterIndex, $RvW.verseIndex);
            // presentationCtx.p_footer = $RvW.getFooter();
            // presentationCtx.p_title = c + " " + ($RvW.chapterIndex + 1);
            // $RvW.launch($RvW.verseIndex);
        }

        function getVerseText() {
            return $RvW.bible[$RvW.vvConfigObj.get_version1()]
                .getElementsByTagName("b")[s].getElementsByTagName("c")[p - 1].getElementsByTagName("v");
        }

        function getVerseFont() {
            return getPrimaryBibleVersion().selectedFont;
        }

        function getErrorMessage() {
            d(k);
            return k;
        }

        function getBook() {
            return s;
        }

        function getChapter() {
            return p;
        }

        function getVerse() {
            return e;
        }

        function d(t) {
            if (j) {
                console.trace("[BIBLE REF]: " + t);
            }
        }
    }
}

export function showLogoSlide() {
    $RvW.webServerObj.broadcastWS({event: 'cc:show-logo'});

    presentationCtx.p_text1_arr = [];
    presentationCtx.p_text2_arr = [];
    presentationCtx.p_text1_arr[0] = "";
    presentationCtx.p_text2_arr[0] = "";
    presentationCtx.p_text1_font = "";
    presentationCtx.p_text2_font = "";
    presentationCtx.p_title = "";
    presentationCtx.p_footer = "";
    presentationCtx.p_current_index = 0;
    presentationCtx.p_last_index = 0;
    presentationCtx.p_bkgnd_filename = $RvW.graphicsObj.getLogoFilename();
    presentationCtx.p_bkgnd_color = "black";
    presentationCtx.p_font_color = $RvW.rvwPreferences.get('app.settings.text.color1');
    presentationCtx.p_font_color2 = $RvW.rvwPreferences.get('app.settings.text.color2');
    presentation();
}

export function blankSlide() {
    $RvW.webServerObj.broadcastWS({event: 'cc:blank-screen'});
    if ($RvW.presentWindowOpen) {
        $RvW.presentationWindow.window.showBlankProcess();
        if ($RvW.stageView && $RvW.stageWindow != null) {
            $RvW.stageWindow.window.showBlankProcess();
        }
    }
    $RvW.presentationContent = "";
}

export function specialCategory(d) {
    let b = d.toLowerCase().split(" ");
    return b[0] === "vv";
}