import {specialCategory} from "@app/common";
import {Toast} from "@app/toast";
import {console} from "@/platform/adapters/air";
import * as XML from "@/utils/xml";

export class SongExporter {
    constructor(song, category, _, exportKind) {
        this.exportAll = exportAll;
        this.exportByCat = exportByCat;

        const m_song = song;
        const m_category = category;
        let m_exportKind = exportKind; // 1: All, 2: By Category

        function exportAll() {
            // const r = new Song();
            const r = {};

            const w = _generateExportXmlFilename();
            let u = '<?xml version="1.0" encoding="UTF-8"?>\n';
            u += "<songDB>\n";
            u += "<type>XMLsong</type>\n";
            u += "<disclaimer>The copyrights to these songs belongs to person mentioned in the copyright tag of each song. This database has been designed and compiled for VerseVIEW only.</disclaimer>\n";

            for (let t = 0; t < m_song.length; t++) {
                if (!specialCategory(m_song[t].cat)) {
                    let v = m_song[t].name;
                    v = v.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    v = v.replace(/(\x26)/g, "and");
                    r.name = v;
                    r.catIndex = m_song[t].cat;
                    r.font = m_song[t].font;
                    r.font2 = m_song[t].font2;
                    r.timestamp = m_song[t].timestamp;
                    r.yvideo = m_song[t].yvideo;
                    r.bkgnd_fname = m_song[t].bkgndfname;
                    r.key = m_song[t].key;
                    r.copyright = m_song[t].copy;
                    r.notes = m_song[t].notes;
                    r.name2 = m_song[t].title2;
                    r.tags = m_song[t].tags != null ? m_song[t].tags : "";
                    r.slideseq = m_song[t].slideseq;
                    r.slides = m_song[t].lyrics.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    const x = m_song[t].lyrics2;
                    r.slides2 = x != null ? x.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "") : "";
                    u += _serializeSongXml(r);
                }
            }

            u += "</songDB>\n";

            _saveToFile(u, w);
        }

        function exportByCat() {
            if (m_category === "ALL") {
                m_exportKind = 1;
                exportAll();
                return false;
            }

            if (specialCategory(m_category)) {
                Toast.error("Song Database", "Only user added lyrics can be exported");
                return false;
            }

            const filename = _generateExportXmlFilename();

            let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xmlContent += "<songDB>\n";
            xmlContent += "<type>XMLsong</type>\n";
            xmlContent += "<disclaimer>The copyrights to these songs belongs to person mentioned in the copyright tag of each song. This database has been designed and compiled for VerseVIEW only.</disclaimer>\n";

            let errored = true;
            for (const item of m_song) {
                if (item.cat === m_category) {
                    errored = false;
                    let w = item.name;
                    w = w.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    w = w.replace(/(\x26)/g, "and");

                    const so = new Song();
                    so.name = w;
                    so.catIndex = item.cat;
                    so.font = item.font;
                    so.font2 = item.font2;
                    so.timestamp = item.timestamp;
                    so.yvideo = item.yvideo;
                    so.bkgnd_fname = item.bkgndfname;
                    so.key = item.key;
                    so.copyright = item.copy;
                    so.notes = item.notes;
                    so.name2 = item.title2;
                    so.tags = item.tags != null ? item.tags : "";
                    so.slideseq = item.slideseq;
                    so.subcat = item.subcat;
                    so.slides = item.lyrics.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "");
                    const x = item.lyrics2;
                    so.slides2 = x != null ? x.replace(/([\x00-\x08\x0B-\x0C\x0E-\x1F\x7F])/g, "") : "";

                    xmlContent += _serializeSongXml(so);
                }
            }

            xmlContent += "</songDB>\n";

            if (errored) {
                Toast.error(
                    "Song Database",
                    "Database contains invalid Category. Contact VerseVIEW"
                );
            } else {
                _saveToFile(xmlContent, filename);
            }
        }

        function _generateExportXmlFilename() {
            const suffix = new Date().toDateString();

            switch (m_exportKind) {
                case 1:
                    return `vvsongs_${suffix}.xml`;
                case 2:
                    return `${m_category}_songs_${suffix}.xml`;
                case 3:
                    return `vvsongs_${suffix}.xml`;
                default:
                    return null;
            }
        }

        function _serializeSongXml(song) {
            let sx = "";
            sx += "<song>\n";
            sx += "\t<category>" + song.catIndex + "</category>\n";
            sx += "\t<name>" + song.name + "</name>\n";
            sx += "\t<font>" + song.font + "</font>\n";
            sx += "\t<font2>" + song.font2 + "</font2>\n";
            sx += "\t<timestamp>" + song.timestamp + "</timestamp>\n";
            if (song.yvideo === "null" || !song.yvideo) {
                sx += `\t<yvideo></yvideo>\n`;
            } else {
                sx += `\t<yvideo>${song.yvideo}</yvideo>\n`;
            }
            sx += "\t<bkgnd>" + song.bkgnd_fname + "</bkgnd>\n";
            sx += "\t<key>" + song.key + "</key>\n";
            sx += "\t<copyright>" + song.copyright + "</copyright>\n";
            sx += "\t<notes>" + song.notes + "</notes>\n";
            sx += "\t<slide><![CDATA[" + song.slides + "]]></slide>\n";
            sx += "\t<slide2><![CDATA[" + song.slides2 + "]]></slide2>\n";
            sx += "\t<name2><![CDATA[" + song.name2 + "]]></name2>\n";
            sx += "\t<tags><![CDATA[" + song.tags + "]]></tags>\n";
            sx += "\t<slideseq><![CDATA[" + song.slideseq + "]]></slideseq>\n";
            sx += "\t<subcat><![CDATA[" + song.subcat + "]]></subcat>\n";
            sx += "</song>\n";
            return sx;
        }

        function _saveToFile(content, filename) {
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
                        Toast.success(
                            "Song Database",
                            `Exported to ${newFile.name}`
                        );
                    });
                    stream.writeMultiByte(content, "utf-8");
                    stream.close();
                } else {
                    Toast.error(
                        "Song Database",
                        "File already exists. Choose a different name."
                    );
                }
            });
        }
    }
}