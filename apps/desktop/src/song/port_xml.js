import {addTagList, fillTagList} from "@/tags";
import {Song} from '@/song/obj';
import {Toast} from "@app/toast";

export class SongPortXML {
    constructor() {
        this.init = p;
        this.exportAll = l;
        this.exportByCat = f;
        this.exportSingle = h;
        this.importXML = e;
        var c = null;
        var m = null;
        var j = null;
        var k = 0;
        var d = null;
        function p(r, t, s, u) {
            c = r;
            m = t;
            j = s;
            k = u;
        }
        function l() {
            var r = new Song();
            r.init();
            var w = b();
            var u = '<?xml version="1.0" encoding="UTF-8"?>\n';
            u = u + "<songDB>\n";
            u = u + "<type>XMLsong</type>\n";
            u =
                u +
                "<disclaimer>The copyrights to these songs belongs to person mentioned in the copyright tag of each song. This database has been designed and compiled for VerseVIEW only.</disclaimer>\n";
            var y = c.data.length;
            for (var t = 0; t < y; t++) {
                if (!rvw.common.specialCategory(c.data[t].cat)) {
                    var v = c.data[t].name;
                    v = v.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    v = v.replace(/([\x26])/g, "and");
                    r.name = v;
                    r.catIndex = c.data[t].cat;
                    r.font = c.data[t].font;
                    r.font2 = c.data[t].font2;
                    r.timestamp = c.data[t].timestamp;
                    r.yvideo = c.data[t].yvideo;
                    r.bkgnd_fname = c.data[t].bkgndfname;
                    r.key = c.data[t].key;
                    r.copyright = c.data[t].copy;
                    r.notes = c.data[t].notes;
                    r.name2 = c.data[t].title2;
                    if (c.data[t].tags != null) {
                        r.tags = c.data[t].tags;
                    } else {
                        r.tags = "";
                    }
                    r.slideseq = c.data[t].slideseq;
                    var x = c.data[t].lyrics;
                    var s = x.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    r.slides = s;
                    var x = c.data[t].lyrics2;
                    if (x != null) {
                        var s = x.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                        r.slides2 = s;
                    } else {
                        r.slides2 = "";
                    }
                    u = u + q(r);
                }
            }
            u = u + "</songDB>\n";
            g(u, w);
        }
        function f() {
            if (m == "_ALL") {
                k = 1;
                l();
                return false;
            }
            if (rvw.common.specialCategory(m)) {
                Toast.show("Song Database", "Only user added lyrics can be exported");
                return false;
            }
            var z = new Song();
            z.init();
            var t = b();
            var v = '<?xml version="1.0" encoding="UTF-8"?>\n';
            v = v + "<songDB>\n";
            v = v + "<type>XMLsong</type>\n";
            v =
                v +
                "<disclaimer>The copyrights to these songs belongs to person mentioned in the copyright tag of each song. This database has been designed and compiled for VerseVIEW only.</disclaimer>\n";
            var r = true;
            var y = c.data.length;
            for (var u = 0; u < y; u++) {
                if (c.data[u].cat == m) {
                    r = false;
                    var w = c.data[u].name;
                    w = w.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    w = w.replace(/([\x26])/g, "and");
                    z.name = w;
                    z.catIndex = c.data[u].cat;
                    z.font = c.data[u].font;
                    z.font2 = c.data[u].font2;
                    z.timestamp = c.data[u].timestamp;
                    z.yvideo = c.data[u].yvideo;
                    z.bkgnd_fname = c.data[u].bkgndfname;
                    z.key = c.data[u].key;
                    z.copyright = c.data[u].copy;
                    z.notes = c.data[u].notes;
                    z.name2 = c.data[u].title2;
                    if (c.data[u].tags != null) {
                        z.tags = c.data[u].tags;
                    } else {
                        z.tags = "";
                    }
                    z.slideseq = c.data[u].slideseq;
                    z.subcat = c.data[u].subcat;
                    var x = c.data[u].lyrics;
                    var s = x.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    z.slides = s;
                    var x = c.data[u].lyrics2;
                    if (x != null) {
                        var s = x.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                        z.slides2 = s;
                    } else {
                        z.slides2 = "";
                    }
                    v = v + q(z);
                }
            }
            v = v + "</songDB>\n";
            if (r) {
                Toast.show(
                    "Song Database",
                    "Database contains invalid Category. Contact VerseVIEW"
                );
            } else {
                g(v, t);
            }
        }
        function h() { }
        function e() {
            d = air.File.desktopDirectory;
            var s = new window.runtime.Array();
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
                    if (u.readyState == 4) {
                        var x = u.responseXML;
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
        function b() {
            var t = new Date();
            var s = t.toDateString();
            var r = "";
            switch (k) {
                case 1:
                    r = "vvsongs_" + s + ".xml";
                    break;
                case 2:
                    r = m + "_songs_" + s + ".xml";
                    break;
                case 3:
                    r = "vvsongs_" + s + ".xml";
                    break;
                default:
                    break;
            }
            return r;
        }
        function i(r) {
            var s = "";
            s = s + "<song>\n";
            s = s + "  <category>" + r.catIndex + "</category>\n";
            s = s + "  <name>" + r.name + "</name>\n";
            s = s + "  <font>" + r.font + "</font>\n";
            s = s + "  <font2>" + r.font2 + "</font2>\n";
            s = s + "  <timestamp>" + r.timestamp + "</timestamp>\n";
            s = s + "  <yvideo>" + test_get_songlink(r.name) + "</yvideo>\n";
            s = s + "  <bkgnd>" + r.bkgnd_fname + "</bkgnd>\n";
            s = s + "  <key>" + r.key + "</key>\n";
            s = s + "  <copyright>" + r.copyright + "</copyright>\n";
            s = s + "  <notes>" + r.notes + "</notes>\n";
            s = s + "  <slide><![CDATA[" + r.slides + "]]></slide>\n";
            s = s + "  <slide2><![CDATA[" + r.slides2 + "]]></slide2>\n";
            s = s + "  <name2><![CDATA[" + r.name2 + "]]></name2>\n";
            s = s + "  <tags><![CDATA[" + r.tags + "]]></tags>\n";
            s = s + "  <slideseq><![CDATA[" + r.slideseq + "]]></slideseq>\n";
            s = s + "</song>\n";
            return s;
        }
        function q(r) {
            var s = "";
            s = s + "<song>\n";
            s = s + "  <category>" + r.catIndex + "</category>\n";
            s = s + "  <name>" + r.name + "</name>\n";
            s = s + "  <font>" + r.font + "</font>\n";
            s = s + "  <font2>" + r.font2 + "</font2>\n";
            s = s + "  <timestamp>" + r.timestamp + "</timestamp>\n";
            if (r.yvideo == "null") {
                s = s + "  <yvideo></yvideo>\n";
            } else {
                s = s + "  <yvideo>" + r.yvideo + "</yvideo>\n";
            }
            s = s + "  <bkgnd>" + r.bkgnd_fname + "</bkgnd>\n";
            s = s + "  <key>" + r.key + "</key>\n";
            s = s + "  <copyright>" + r.copyright + "</copyright>\n";
            s = s + "  <notes>" + r.notes + "</notes>\n";
            s = s + "  <slide><![CDATA[" + r.slides + "]]></slide>\n";
            s = s + "  <slide2><![CDATA[" + r.slides2 + "]]></slide2>\n";
            s = s + "  <name2><![CDATA[" + r.name2 + "]]></name2>\n";
            s = s + "  <tags><![CDATA[" + r.tags + "]]></tags>\n";
            s = s + "  <slideseq><![CDATA[" + r.slideseq + "]]></slideseq>\n";
            s = s + "  <subcat><![CDATA[" + r.subcat + "]]></subcat>\n";
            s = s + "</song>\n";
            return s;
        }
        function g(s, w) {
            var t = "./vvexport/" + w;
            var r = air.File.desktopDirectory;
            r = r.resolvePath(t);
            var u = new air.FileStream();
            u.addEventListener(air.Event.CLOSE, v);
            u.openAsync(r, air.FileMode.WRITE);
            u.writeMultiByte(s, "utf-8");
            u.close();
            function v() {
                Toast.show(
                    "Song Database",
                    "Exported to " + w + " under vvexport folder on the Desktop."
                );
            }
        }
        function o(t) {
            var u = new Song();
            var C = t.getElementsByTagName("song").length;
            var x = true;
            for (var y = 0; y < C; y++) {
                var A = t
                    .getElementsByTagName("song")[y].getElementsByTagName("category")[0].textContent;
                if (!rvw.common.specialCategory(A)) {
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
                            u.yvideo = rvw.common.fixHTTPS_Link(r.textContent);
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