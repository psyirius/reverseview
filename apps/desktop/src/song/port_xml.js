import {addTagList, fillTagList} from "@/tags";
import {Song} from '@/song/obj';
import {Toast} from "@app/toast";
import {$RvW} from "@/rvw";
import {fixHTTPS_Link, specialCategory} from "@app/common";

export class SongPortXML {
    constructor(song, category, s, exk) {
        this.exportAll = exportAll;
        this.exportByCat = exportByCat;
        this.exportSingle = exportSingle;
        this.importXML = importXML;

        const m_song = song;
        const m_category = category;
        const j = s;
        let m_exportKind = exk;

        function exportAll() {
            const r = new Song();
            r.init();

            const w = generateExportXmlFilename();
            let u = '<?xml version="1.0" encoding="UTF-8"?>\n';
            u += "<songDB>\n";
            u += "<type>XMLsong</type>\n";
            u += "<disclaimer>The copyrights to these songs belongs to person mentioned in the copyright tag of each song. This database has been designed and compiled for VerseVIEW only.</disclaimer>\n";

            for (let t = 0; t < m_song.data.length; t++) {
                if (!specialCategory(m_song.data[t].cat)) {
                    let v = m_song.data[t].name;
                    v = v.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    v = v.replace(/(\x26)/g, "and");
                    r.name = v;
                    r.catIndex = m_song.data[t].cat;
                    r.font = m_song.data[t].font;
                    r.font2 = m_song.data[t].font2;
                    r.timestamp = m_song.data[t].timestamp;
                    r.yvideo = m_song.data[t].yvideo;
                    r.bkgnd_fname = m_song.data[t].bkgndfname;
                    r.key = m_song.data[t].key;
                    r.copyright = m_song.data[t].copy;
                    r.notes = m_song.data[t].notes;
                    r.name2 = m_song.data[t].title2;
                    r.tags = m_song.data[t].tags != null ? m_song.data[t].tags : "";
                    r.slideseq = m_song.data[t].slideseq;
                    r.slides = m_song.data[t].lyrics.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    const x = m_song.data[t].lyrics2;
                    r.slides2 = x != null ? x.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "") : "";
                    u += q(r);
                }
            }

            u += "</songDB>\n";

            saveToFile(u, w);
        }

        function exportByCat() {
            if (m_category === "ALL") {
                m_exportKind = 1;
                exportAll();
                return false;
            }

            if (specialCategory(m_category)) {
                Toast.show("Song Database", "Only user added lyrics can be exported");
                return false;
            }

            const z = new Song();
            z.init();

            const t = generateExportXmlFilename();

            let v = '<?xml version="1.0" encoding="UTF-8"?>\n';
            v += "<songDB>\n";
            v += "<type>XMLsong</type>\n";
            v += "<disclaimer>The copyrights to these songs belongs to person mentioned in the copyright tag of each song. This database has been designed and compiled for VerseVIEW only.</disclaimer>\n";

            let errored = true;
            for (let u = 0; u < m_song.data.length; u++) {
                if (m_song.data[u].cat === m_category) {
                    errored = false;
                    let w = m_song.data[u].name;
                    w = w.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    w = w.replace(/(\x26)/g, "and");
                    z.name = w;
                    z.catIndex = m_song.data[u].cat;
                    z.font = m_song.data[u].font;
                    z.font2 = m_song.data[u].font2;
                    z.timestamp = m_song.data[u].timestamp;
                    z.yvideo = m_song.data[u].yvideo;
                    z.bkgnd_fname = m_song.data[u].bkgndfname;
                    z.key = m_song.data[u].key;
                    z.copyright = m_song.data[u].copy;
                    z.notes = m_song.data[u].notes;
                    z.name2 = m_song.data[u].title2;
                    z.tags = m_song.data[u].tags != null ? m_song.data[u].tags : "";
                    z.slideseq = m_song.data[u].slideseq;
                    z.subcat = m_song.data[u].subcat;
                    z.slides = m_song.data[u].lyrics.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    const x = m_song.data[u].lyrics2;
                    z.slides2 = x != null ? x.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "") : "";
                    v += q(z);
                }
            }
            v += "</songDB>\n";
            if (errored) {
                Toast.show(
                    "Song Database",
                    "Database contains invalid Category. Contact VerseVIEW"
                );
            } else {
                saveToFile(v, t);
            }
        }

        function exportSingle() {
            Toast.show(
                "Song Database",
                "Exporting single song is not supported in XML format."
            );
        }

        function importXML() {
            const d = air.File.desktopDirectory;
            const s = new runtime.Array();
            s.push(new air.FileFilter("VerseVIEW Song DB", "*.xml"));
            d.browseForOpen("Select Song DB in XML format.", s);
            d.addEventListener(air.Event.SELECT, r);
            function r(w) {
                var v = d.url;
                var u;
                u = new XMLHttpRequest();
                u.onreadystatechange = function () {
                    if (u.readyState < 4) {
                    }
                    if (u.readyState === 4) {
                        const x = u.responseXML;
                        t(x);
                    }
                };
                u.open("GET", v, false);
                u.send(null);
            }
            function t(v) {
                if (v != null) {
                    if (v.getElementsByTagName("type")[0] != null) {
                        var u = v.getElementsByTagName("type")[0].textContent;
                        if (u == "XMLsong") {
                            o(v);
                        } else {
                            Toast.show(
                                "Song Database",
                                "Invalid database for VerseVIEW Songs in XML format. (Wrong type field)"
                            );
                        }
                    } else {
                        Toast.show(
                            "Song Database",
                            "Invalid database for VerseVIEW Songs in XML format. (Type field not present)"
                        );
                    }
                } else {
                    Toast.show(
                        "Song Database",
                        "Invalid database for VerseVIEW Songs in XML format. (Invalid XML format)"
                    );
                }
            }
        }

        function generateExportXmlFilename() {
            const s = new Date().toDateString();
            switch (m_exportKind) {
                case 1:
                    return `vvsongs_${s}.xml`;
                case 2:
                    return `${m_category}_songs_${s}.xml`;
                case 3:
                    return `vvsongs_${s}.xml`;
                default:
                    return null;
            }
        }
        function i(r) {
            let s = "";
            s += "<song>\n";
            s += "  <category>" + r.catIndex + "</category>\n";
            s += "  <name>" + r.name + "</name>\n";
            s += "  <font>" + r.font + "</font>\n";
            s += "  <font2>" + r.font2 + "</font2>\n";
            s += "  <timestamp>" + r.timestamp + "</timestamp>\n";
            s += "  <yvideo>" + test_get_songlink(r.name) + "</yvideo>\n";
            s += "  <bkgnd>" + r.bkgnd_fname + "</bkgnd>\n";
            s += "  <key>" + r.key + "</key>\n";
            s += "  <copyright>" + r.copyright + "</copyright>\n";
            s += "  <notes>" + r.notes + "</notes>\n";
            s += "  <slide><![CDATA[" + r.slides + "]]></slide>\n";
            s += "  <slide2><![CDATA[" + r.slides2 + "]]></slide2>\n";
            s += "  <name2><![CDATA[" + r.name2 + "]]></name2>\n";
            s += "  <tags><![CDATA[" + r.tags + "]]></tags>\n";
            s += "  <slideseq><![CDATA[" + r.slideseq + "]]></slideseq>\n";
            s += "</song>\n";
            return s;
        }
        function q(r) {
            let s = "";
            s += "<song>\n";
            s += "  <category>" + r.catIndex + "</category>\n";
            s += "  <name>" + r.name + "</name>\n";
            s += "  <font>" + r.font + "</font>\n";
            s += "  <font2>" + r.font2 + "</font2>\n";
            s += "  <timestamp>" + r.timestamp + "</timestamp>\n";
            s += r.yvideo === "null" ? `  <yvideo></yvideo>\n` : `  <yvideo>${r.yvideo}</yvideo>\n`;
            s += "  <bkgnd>" + r.bkgnd_fname + "</bkgnd>\n";
            s += "  <key>" + r.key + "</key>\n";
            s += "  <copyright>" + r.copyright + "</copyright>\n";
            s += "  <notes>" + r.notes + "</notes>\n";
            s += "  <slide><![CDATA[" + r.slides + "]]></slide>\n";
            s += "  <slide2><![CDATA[" + r.slides2 + "]]></slide2>\n";
            s += "  <name2><![CDATA[" + r.name2 + "]]></name2>\n";
            s += "  <tags><![CDATA[" + r.tags + "]]></tags>\n";
            s += "  <slideseq><![CDATA[" + r.slideseq + "]]></slideseq>\n";
            s += "  <subcat><![CDATA[" + r.subcat + "]]></subcat>\n";
            s += "</song>\n";
            return s;
        }

        function saveToFile(content, filename) {
            const { File, FileStream, FileMode, Event } = air;
            const { desktopDirectory } = File;

            const out = desktopDirectory.resolvePath(filename);
            out.browseForSave("Save As");
            out.addEventListener(Event.SELECT, function saveData(event) {
                const newFile = event.target;

                if (!newFile.exists) {
                    const stream = new FileStream();
                    stream.openAsync(newFile, FileMode.WRITE);
                    stream.addEventListener(Event.CLOSE, function () {
                        Toast.show(
                            "Song Database",
                            `Exported to ${newFile.name}`
                        );
                    });
                    stream.writeMultiByte(content, "utf-8");
                    stream.close();
                } else {
                    Toast.show(
                        "Song Database",
                        "File already exists. Choose a different name."
                    );
                }
            });
        }

        function o(t) {
            var u = new Song();
            var C = t.getElementsByTagName("song").length;
            var x = true;
            for (var y = 0; y < C; y++) {
                var A = t
                    .getElementsByTagName("song")[y].getElementsByTagName("category")[0].textContent;
                if (!specialCategory(A)) {
                    u.name = t
                        .getElementsByTagName("song")[y].getElementsByTagName("name")[0].textContent;
                    u.catIndex = t
                        .getElementsByTagName("song")[y].getElementsByTagName("category")[0].textContent;
                    var z = false;
                    if (!z) {
                        x = false;
                        u.font = t
                            .getElementsByTagName("song")[y].getElementsByTagName("font")[0].textContent;
                        var s = t
                            .getElementsByTagName("song")[y].getElementsByTagName("font2")[0];
                        if (s != null) {
                            u.font2 = s.textContent;
                        } else {
                            u.font2 = "";
                        }
                        var B = t
                            .getElementsByTagName("song")[y].getElementsByTagName("timestamp")[0];
                        if (B != null) {
                            u.timestamp = B.textContent;
                        } else {
                            u.timestamp = "";
                        }
                        var r = t
                            .getElementsByTagName("song")[y].getElementsByTagName("yvideo")[0];
                        if (r != null) {
                            u.yvideo = fixHTTPS_Link(r.textContent);
                        } else {
                            u.yvideo = "";
                        }
                        u.bkgnd_fname = t
                            .getElementsByTagName("song")[y].getElementsByTagName("bkgnd")[0].textContent;
                        u.key = t
                            .getElementsByTagName("song")[y].getElementsByTagName("key")[0].textContent;
                        u.copyright = t
                            .getElementsByTagName("song")[y].getElementsByTagName("copyright")[0].textContent;
                        u.notes = t
                            .getElementsByTagName("song")[y].getElementsByTagName("notes")[0].textContent;
                        u.slides = t
                            .getElementsByTagName("song")[y].getElementsByTagName("slide")[0].textContent;
                        var v = t
                            .getElementsByTagName("song")[y].getElementsByTagName("slide2")[0];
                        if (v != null) {
                            u.slides2 = v.textContent;
                        } else {
                            u.slides2 = "";
                        }
                        u.name2 = w(
                            t.getElementsByTagName("song")[y].getElementsByTagName("name2")[0]
                        );
                        u.tags = w(
                            t.getElementsByTagName("song")[y].getElementsByTagName("tags")[0]
                        );
                        u.tags = u.tags.toUpperCase();
                        addTagList(u.tags);
                        u.slideseq = w(
                            t
                                .getElementsByTagName("song")[y].getElementsByTagName("slideseq")[0]
                        );
                        u.subcat = w(
                            t.getElementsByTagName("song")[y].getElementsByTagName("subcat")[0]
                        );
                        $RvW.songManagerObj.addSong(u, false, true);
                    }
                }
            }
            if (x) {
                Toast.show("No New Songs to add.");
            } else {
                fillTagList();
            }
            function w(D) {
                if (D != null) {
                    return D.textContent;
                } else {
                    return "";
                }
            }
        }
        function a(t, r) {
            if (t == null) {
                return true;
            }
            var u = t.length;
            var v = true;
            for (var s = 0; s < u; s++) {
                if (t[s] == r) {
                    v = false;
                    break;
                }
            }
            return v;
        }
        function n(r) {
            var v = r.getElementsByTagName("song").length;
            var t = -1;
            for (var u = 0; u < v; u++) {
                var s = r
                    .getElementsByTagName("song")[u].getElementsByTagName("name")[0].textContent;
                var w = $RvW.songManagerObj.checkSongExists(s);
                if (!w) {
                    t = u;
                }
            }
            return t;
        }
    }
}