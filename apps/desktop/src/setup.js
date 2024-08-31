import {loadVersion} from "@/bible/version";
import {clearSelectList, UnZip} from "@app/common";

export class BibleVersionSelector {
    constructor(bodyContent) {
        this.show = show;
        this.hide = hide;

        let _panel = null;
        const _body = bodyContent;

        _setupPanel();

        function _setupPanel() {
            _panel = new YAHOO.widget.Panel("panelObj2", {
                width: "300px",
                fixedcenter: true,
                modal: true,
                visible: false,
                constraintoviewport: true,
            });
            _panel.render(document.body);
            _panel.setHeader("Bible Version Selection");
            _panel.setBody(_body);
            _panel.hide();
            _panel.bringToTop();
        }

        function show() {
            _panel.show();
            _panel.bringToTop();
        }

        function hide() {
            _panel.hide();
        }
    }
}

export class BibleUpdater {
    constructor() {
        let bibleVersionList = null;
        let filename = null;

        const checkUpdateBut = document.getElementById("checkUpdateBut");
        checkUpdateBut.addEventListener("click", onCheckUpdate, false);

        const loadSelectedBut = document.getElementById("loadSelectedBut")
        loadSelectedBut.addEventListener("click", onLoadSelected, false);
        loadSelectedBut.disabled = true;

        new YAHOO.widget.Tooltip("ttip1", {
            context: checkUpdateBut,
            text: "Check for Update",
        });
        new YAHOO.widget.Tooltip("ttip2", {
            context: loadSelectedBut,
            text: "Load selected",
        });

        function onCheckUpdate() {
            air.trace("Update Check......");
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
                air.trace("Error getting file..");
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
            air.trace("Load selected.....");
            document.getElementById("loadSelectedBut").disabled = true;
            const q = "https://www.verseview.info/download/bible/" + filename;
            air.trace("url path: " + q);
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
                var t = v.target.data;
                var w = air.ByteArray(t);
                var u = air.File.applicationStorageDirectory.resolvePath("test.zip");
                var x = new air.FileStream();
                x.open(u, air.FileMode.WRITE);
                x.writeBytes(w, 0, w.length);
                x.close();
                air.trace("Completed downloading the zip file to test.zip");
                const l = new UnZip("", "test.zip");
                const s = new air.File();
                air.trace("File....." + l.get_nPath());
                s.nativePath = l.get_nPath();
                air.trace("[UPDATE] .... Native Path: " + s.nativePath);
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