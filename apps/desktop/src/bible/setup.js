import {loadVersion} from "@/bible/version";
import {clearSelectList} from "@app/common";
import {console, fs} from "@/platform/adapters/air";

// TODO: just kept here for the impl courtesy
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
        console.trace(r);
        var b = air.File.applicationStorageDirectory.resolvePath(r);
        var fz = new air.FileStream();
        var o = null;

        fz.open(b, air.FileMode.READ);
        ba.endian = air.Endian.LITTLE_ENDIAN;
        console.trace("unzip init function*****");
        console.trace("zstream....." + fz + "   " + fz.position);
        while (fz.position < b.size) {
            console.trace("unzip init function in while loop *****");
            fz.readBytes(ba, 0, 30);
            console.trace("Byte positon...." + ba.position);
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
            fz.readBytes(ba, 30, e);
            ba.position = 30;
            v = ba.readUTFBytes(s);
            k += v + "\n";
            ba.position = 18;
            a = ba.readUnsignedInt();
            k += "\tCompressed size is: " + a + "\n";
            ba.position = 22;
            j = ba.readUnsignedInt();
            k += "\tUncompressed size is: " + j + "\n";
            fz.readBytes(ba, 0, a);
            console.trace("Byte positon...." + ba.position);
            if (c == 8) {
                console.trace("Byte positon...." + ba.position);
                ba.uncompress(air.CompressionAlgorithm.DEFLATE);
            }
            console.trace("Byte positon...." + ba.position);
            t(v, ba);
        }

        function t(y, x) {
            const f = fs.resolveUrlInAppStorageDir(y);
            o = fs.resolveUrlInAppStorageDir(y, true);
            fs.writeFileBytesSync(f, x)
        }

        function close() {
            fz.close();
        }

        function get_nPath() {
            return o;
        }
    }
}

// TODO: just kept here for the impl courtesy
export class BibleUpdater {
    constructor() {
        let bibleVersionList = null;
        let filename = null;

        const checkUpdateBut = document.getElementById("checkUpdateBut");
        checkUpdateBut.addEventListener("click", onCheckUpdate, false);

        const loadSelectedBut = document.getElementById("loadSelectedBut")
        loadSelectedBut.addEventListener("click", onLoadSelected, false);
        loadSelectedBut.disabled = true;

        checkUpdateBut.setAttribute('data-tooltip', 'Check for Update');
        loadSelectedBut.setAttribute('data-tooltip', 'Load selected');

        function onCheckUpdate() {
            console.trace("Update Check......");
            document.getElementById("checkUpdateBut").disabled = true;
            download_bible();
        }

        function download_bible() {
            const p = new air.URLRequest(
                "https://verseview.info/download/bible/version_server.txt"
            );
            var m = new air.URLLoader();
            m.addEventListener(air.Event.COMPLETE, o);
            m.addEventListener(air.IOErrorEvent.IO_ERROR, n);
            m.load(p);
            function o(v) {
                m.removeEventListener(air.Event.COMPLETE, o);
                m.removeEventListener(air.IOErrorEvent.IO_ERROR, n);
                var u = v.target.data;
                var t = u.split("|");
                var q = t.length;
                var s = [];
                for (var r = 0; r < q; r++) {
                    s.push(t[r]);
                }
                bibleVersionList = s;
                document.getElementById("loadSelectedBut").disabled = false;
                j();
            }
            function n(r) {
                m.removeEventListener(air.Event.COMPLETE, o);
                m.removeEventListener(air.IOErrorEvent.IO_ERROR, n);
                console.trace("Error getting file..");
                var q = "Failed contacting the server. Contact verseview@yahoo.com";
                document.getElementById("updateStatusID").innerHTML = q;
                document.getElementById("checkUpdateBut").disabled = false;
            }
        }
        function j() {
            clearSelectList("updateListID");

            // name,description,filename,revision,

            const m = bibleVersionList.length;
            for (let o = 0; o < m; o++) {
                const n = bibleVersionList[o].split(",");
                document.getElementById("updateListID").options[o] = new Option(n[0], o);
            }
            document.getElementById("updateListID").selectedIndex = 0;
            h();
            document
                .getElementById("updateListID")
                .addEventListener("change", h, false);
        }
        function h() {
            var n = document.getElementById("updateListID").selectedIndex;
            var m = bibleVersionList[n].split(",");
            document.getElementById("updateStatusID").innerHTML = `<b>${m[0]}</b><br>${m[1]}<br>Revision : ${m[3]}`;
            filename = m[2];
        }
        // function e() {
        //     var m = "C:\\Users\\Binu\\AppData\\Roaming\\verseview4beta\\Local Store\\romanian.xml";
        //     loadVersion(m);
        // }
        function onLoadSelected() {
            console.trace("Load selected.....");
            document.getElementById("loadSelectedBut").disabled = true;
            const q = "https://www.verseview.info/download/bible/" + filename;
            console.trace("url path: " + q);
            var r = new air.URLRequest(q);
            var n = new air.URLLoader();
            n.dataFormat = air.URLLoaderDataFormat.BINARY;
            n.addEventListener(air.Event.COMPLETE, p);
            n.addEventListener(air.IOErrorEvent.IO_ERROR, o);
            n.addEventListener(air.ProgressEvent.PROGRESS, m);
            n.load(r);
            function p(v) {
                n.removeEventListener(air.Event.COMPLETE, p);
                n.removeEventListener(air.IOErrorEvent.IO_ERROR, o);
                n.removeEventListener(air.ProgressEvent.PROGRESS, m);
                const t = v.target.data;
                const w = air.ByteArray(t);
                const zf = fs.resolveUrlInAppStorageDir("test.zip");
                fs.writeFileBytesSync(zf, w);
                console.trace("Completed downloading the zip file to test.zip");
                const l = new UnZip("", "test.zip");
                const s = new air.File();
                console.trace("File....." + l.get_nPath());
                s.nativePath = l.get_nPath();
                console.trace("[UPDATE] .... Native Path: " + s.nativePath);
                loadVersion(s.nativePath);
                l.close();
                document.getElementById("loadSelectedBut").disabled = false;
            }
            function o(t) {
                document.getElementById("updateStatusID").innerHTML = "Failed downloading the file. Contact verseview@yahoo.com";
                document.getElementById("loadSelectedBut").disabled = false;
            }
            function m(u) {
                let t = 0;
                let s = "";
                if (n.bytesLoaded < n.bytesTotal) {
                    t = parseInt((n.bytesLoaded / n.bytesTotal) * 100);
                    s = "Dowloading translation file...." + t + "%";
                } else {
                    s = "Download COMPLETE";
                }
                document.getElementById("updateStatusID").innerHTML = s;
            }
        }
    }
}