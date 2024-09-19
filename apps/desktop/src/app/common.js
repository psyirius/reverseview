import {presentationCtx} from "@app/presentation";
import {presentation} from "@/p_window";
import {Toast} from "@app/toast";
import {$RvW} from "@/rvw";

import * as $ from "jquery";

export let apple = false;

export function save2file(c, d, a) {
    const {
        File,
        FileStream,
        FileMode,
    } = air;

    const b = File.applicationStorageDirectory.resolvePath(d);
    const e = new FileStream();
    e.open(b, FileMode.WRITE);
    e.writeMultiByte(c, "utf-8");
    e.close();
}

export function filesave2vvexport(content, name) {
    const filename = `./vvexport/${name}.html`;
    const dtFilename = air.File.desktopDirectory.resolvePath(filename);
    const fz = new air.FileStream();
    fz.open(dtFilename, air.FileMode.WRITE);
    fz.writeMultiByte(content, "utf-8");
    fz.close();
}

export function fileExist(b, a) {
    let c = (a === 1)
        ? air.File.applicationStorageDirectory
        : air.File.applicationDirectory;
    c = c.resolvePath(b);
    return c.exists;
}

export function createFolder(b) {
    var a = air.File.applicationStorageDirectory.resolvePath(b);
    if (!a.exists) {
        a.createDirectory();
        air.trace("Directory Created..");
    } else {
        air.trace("directory already exists...");
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

export function copyFile2AppStorage(d, c) {
    let b = air.File.applicationDirectory.resolvePath(d);
    let a = air.File.applicationStorageDirectory.resolvePath(c);
    b.copyTo(a, true);
    return a.exists;
}

export function backupWebroot() {
    air.trace("Came to backup Webroot...");
    const c = air.File.applicationStorageDirectory.resolvePath("webroot");
    if (c.exists) {
        const a = air.File.applicationStorageDirectory.resolvePath("webroot_backup6");
        if (!a.exists) {
            try {
                c.moveTo(a, true);
                return true;
            } catch (b) {
                Toast.show(
                    "Creating Webroot Backup",
                    b.message + " Files in use by another application"
                );
                return false;
            }
        } else {
            Toast.show("Creating Webroot Backup", "Backup already exists.");
            return true;
        }
    } else {
        return true;
    }
}

export function extractFileName(d) {
    let b;
    const c = air.Capabilities.manufacturer;
    if (c === "Adobe Windows") {
        b = d.split("\\");
    } else {
        b = d.split("/");
    }
    const a = b.length;
    return b[a - 1];
}

export function withinRange(b, c, a) {
    return a >= b && a <= c;
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

export class UnZip {
    constructor(u, d) {
        this.close = close;
        this.get_nPath = get_nPath;

        const ba = new air.ByteArray();

        var v = '';
        var s;
        var p;
        var e;
        var a;
        var j;
        var c;
        var n;
        var k = "";
        var r = u + d;
        air.trace(r);
        var b = air.File.applicationStorageDirectory.resolvePath(r);
        var h = new air.FileStream();
        var o = null;

        init();

        function init() {
            h.open(b, air.FileMode.READ);
            ba.endian = air.Endian.LITTLE_ENDIAN;
            air.trace("unzip init function*****");
            air.trace("zstream....." + h + "   " + h.position);
            while (h.position < b.size) {
                air.trace("unzip init function in while loop *****");
                h.readBytes(ba, 0, 30);
                air.trace("Byte positon...." + ba.position);
                ba.position = 0;
                n = ba.readInt();
                if (n !== 67324752) {
                    break;
                }
                ba.position = 8;
                c = ba.readByte();
                e = 0;
                ba.position = 26;
                s = ba.readShort();
                e += s;
                ba.position = 28;
                p = ba.readShort();
                e += p;
                h.readBytes(ba, 30, e);
                ba.position = 30;
                v = ba.readUTFBytes(s);
                k += v + "\n";
                ba.position = 18;
                a = ba.readUnsignedInt();
                k += "\tCompressed size is: " + a + "\n";
                ba.position = 22;
                j = ba.readUnsignedInt();
                k += "\tUncompressed size is: " + j + "\n";
                h.readBytes(ba, 0, a);
                air.trace("Byte positon...." + ba.position);
                if (c == 8) {
                    air.trace("Byte positon...." + ba.position);
                    ba.uncompress(air.CompressionAlgorithm.DEFLATE);
                }
                air.trace("Byte positon...." + ba.position);
                t(v, ba);
            }
        }

        function t(y, x) {
            var f = air.File.applicationStorageDirectory;
            f = f.resolvePath(y);
            o = f.nativePath;
            var w = new air.FileStream();
            w.open(f, air.FileMode.WRITE);
            w.writeBytes(x, 0, x.length);
            w.close();
        }

        function close() {
            h.close();
        }

        function get_nPath() {
            return o;
        }
    }
}

function stopWatch() {
    this.start = h;
    this.stop = d;
    this.reset = f;
    this.delta = g;
    var e = 0;
    var b = 0;
    var a = 0;
    var c = "";

    function h() {
        var j = new Date();
        e = j.getTime();
    }

    function d() {
        var j = new Date();
        b = j.getTime();
    }

    function f() {
        e = 0;
        b = 0;
    }

    function g(j) {
        d();
        a = b - e;
        air.trace(j + " " + a);
        return a;
    }
}

export class FontSizeSlider {
    constructor() {
        const _slider = new $Y.Slider({
            axis: 'x',
            min: 0,
            max: 200,
            length: 200,
            value: ($RvW.vvConfigObj.get_navFontSize() - 8) * 10,
            after : {
                valueChange: function() {
                    const fz = Math.round(_slider.get('value')) / 10 + 8;
                    $RvW.vvConfigObj.set_navFontSize(fz);

                    // Update the font size
                    $RvW.updateVerseContainer();
                    $RvW.searchObj.setFontSize(fz);
                    $RvW.scheduleObj.changeFontsizeScheduleTab();

                    // air.trace("Slider value changed:", fz);
                }
            }
        });

        _slider.render('#nav-font-size-slider');
    }
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
            if (s == -1) {
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
                    if (s == -1) {
                        k = "Did not find matching book name to " + m;
                        D = false;
                    } else {
                        var v = $RvW.numofch[s + 1][0];
                        d("Last Chapter number: " + v);
                        if (p < 1 || p > v) {
                            k = "Invalid chapter number for the book " + c;
                            D = false;
                        } else {
                            var u = $RvW.numofch[s + 1][p];
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
            $RvW.bookIndex = s;
            $RvW.chapterIndex = p - 1;
            $RvW.verseIndex = e - 1;
            $RvW.recentBibleRefs.addSelection($RvW.bookIndex, $RvW.chapterIndex, $RvW.verseIndex);
            presentationCtx.p_footer = $RvW.getFooter();
            presentationCtx.p_title = c + " " + ($RvW.chapterIndex + 1);
            $RvW.launch($RvW.verseIndex);
        }

        function getVerseText() {
            var t = $RvW.bible[$RvW.vvConfigObj.get_version1()]
                .getElementsByTagName("b")[s].getElementsByTagName("c")[p - 1].getElementsByTagName("v");
            return t;
        }

        function getVerseFont() {
            return $RvW.bibleVersionArray[$RvW.vvConfigObj.get_version1()][6];
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
                air.trace("[BIBLE REF]: " + t);
            }
        }
    }
}

export class ImageIcon {
    constructor(a, n, e, d, b, ttp = 'bottom center') {
        this.disableIcon = disableIcon;
        this.enableIcon = enableIcon;

        const m_sel = a;
        const m_text = n;
        const m_src = e;
        const m_srcActive = d;
        const m_srcDisabled = b;
        
        const el = document.getElementById(m_sel);

        el.src = m_src;
        el.addEventListener("mouseover", _on_mouseOver, false);
        el.addEventListener("mouseout", _on_mouseOut, false);
        el.style.border = "1px solid #ffffff";
        el.setAttribute("data-tooltip", m_text);
        el.setAttribute("data-position", ttp);
        el.setAttribute("data-inverted", '');

        function disableIcon() {
            el.src = m_srcDisabled;
            el.removeEventListener("mouseover", _on_mouseOver, false);
            el.removeEventListener("mouseout", _on_mouseOut, false);
        }

        function enableIcon() {
            el.src = m_src;
            el.addEventListener("mouseover", _on_mouseOver, false);
            el.addEventListener("mouseout", _on_mouseOut, false);
        }

        function _on_mouseOver() {
            el.src = m_srcActive;
            el.style.border = "1px solid #87AFC7";
        }

        function _on_mouseOut() {
            el.src = m_src;
            el.style.border = "1px solid #ffffff";
        }
    }
}

export function promoteVV(a) {
    presentationCtx.p_text1_arr = [];
    presentationCtx.p_text2_arr = [];
    presentationCtx.p_text1_font = "";
    presentationCtx.p_text2_font = "";
    presentationCtx.p_title = "";
    presentationCtx.p_footer = "";
    presentationCtx.p_current_index = 0;
    presentationCtx.p_last_index = 0;
    presentationCtx.p_bkgnd_filename = $RvW.graphicsObj.getLogoFilename();
    if (a === 2) {
        presentationCtx.p_bkgnd_filename = "./background/promote2.jpg";
    }
    presentationCtx.p_bkgnd_color = "black";
    presentationCtx.p_font_color = $RvW.vvConfigObj.get_p_textColor();
    presentationCtx.p_font_color2 = $RvW.vvConfigObj.get_p_textColor2();
    presentation();
}

export function showLogoSlide() {
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
    presentationCtx.p_font_color = $RvW.vvConfigObj.get_p_textColor();
    presentationCtx.p_font_color2 = $RvW.vvConfigObj.get_p_textColor2();
    presentation();
}

export function blankSlide() {
    if ($RvW.presentWindowOpen) {
        $RvW.presentationWindow.window.showBlankProcess();
        if ($RvW.stageView && $RvW.stageWindow != null) {
            $RvW.stageWindow.window.showBlankProcess();
        }
    }
    $RvW.presentationContent = "";
}

export function roundSearchBox(a) {
    a.style.borderRadius = "4px";
    a.style.padding = "0px 0px 0px 5px";
    a.style.height = "30px";
}

function getDate() {
    const e = new Date();
    const c = e.getMonth() + 1;
    const b = e.getDate();
    return e.getFullYear() +
        "/" +
        (("" + c).length < 2 ? "0" : "") +
        c +
        "/" +
        (("" + b).length < 2 ? "0" : "") +
        b;
}

export function specialCategory(d) {
    if (apple) {
        return false;
    }
    let b = d.toLowerCase().split(" ");
    return b[0] === "vv";
}

export function pluckapple() {
    const a = $("#nav_bibleRefID").val();
    if (a === "admin") {
        apple = true;
        $("#nav_bibleRefID").val("");
    }
}

export function presentationContentString(d, b, f, c, a) {
    if (c === "" && a === "") {
        return "";
    }
    return `${d}<newelement>${b}<newelement>${f}<newelement>${c}<newelement>${a}`;
}

export function fixHTTPS_Link(a) {
    return a.replace("http:", "https:");
}

export function isBlank(b) {
    const a = b.replace(/\s/g, "").replace(/<BR>/g, "");
    return a.length <= 0;
}