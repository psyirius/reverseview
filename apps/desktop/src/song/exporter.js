import {addTagList, fillTagsToUI} from "@/song/tags";
import {fixHTTPS_Link, specialCategory} from "@app/common";
import {Song} from '@/song/obj';
import {Toast} from "@app/toast";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";
import * as XmlUtils from "@/utils/xml";

export class SongExporter {
    constructor(song, category, s, exportKind) {
        this.exportAll = exportAll;
        this.exportByCat = exportByCat;
        this.exportSingle = exportSingle;
        this.importXML = importXML;

        const m_song = song;
        const m_category = category;
        let m_exportKind = exportKind;

        function exportAll() {
            const r = new Song();

            const w = generateExportXmlFilename();
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
                    u += serializeSongXml(r);
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

            const filename = generateExportXmlFilename();

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

                    xmlContent += serializeSongXml(so);
                }
            }

            xmlContent += "</songDB>\n";

            if (errored) {
                Toast.show(
                    "Song Database",
                    "Database contains invalid Category. Contact VerseVIEW"
                );
            } else {
                saveToFile(xmlContent, filename);
            }
        }

        function exportSingle() {
            Toast.show(
                "Song Database",
                "Exporting single song is not supported in XML format."
            );
        }

        function importXML() {
            // TODO: save last open dir
            const file = air.File.desktopDirectory;
            const fileFilters = [
                new air.FileFilter("VerseVIEW Song DB", "*.xml"),
            ];
            file.browseForOpen("Select Song DB in XML format.", fileFilters);
            file.addEventListener(air.Event.SELECT, onSelectFile);

            function onSelectFile(e) {
                const { FileStream, FileMode } = air;

                /** @type {File} */
                const selectedFile = e.target;

                const fileStream = new FileStream();
                fileStream.open(selectedFile, FileMode.READ);
                const fileContents = fileStream.readMultiByte(fileStream.bytesAvailable, 'utf-8');
                fileStream.close();

                const songsDoc = XmlUtils.parse(fileContents);

                console.trace('Song DB File:', fileContents.length, songsDoc);

                parseSongDB(songsDoc);
            }

            function parseSongDB(root) {
                if (root != null) {
                    if (root.getElementsByTagName("type")[0] != null) {
                        const rootTagName = root.getElementsByTagName("type")[0].textContent;

                        if (rootTagName === "XMLsong") {
                            loadSongs(root);
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

        function serializeSongXml(song) {
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

        function loadSongs(doc) {
            let addedSongs = 0;

            const songItems = doc.getElementsByTagName("song");

            console.trace('Total Songs:', songItems.length);

            for (let i = 0; i < songItems.length; ++i) {
                const item = songItems[i];

                const category = item.getElementsByTagName("category")[0].textContent;

                if (!specialCategory(category)) {
                    const so = new Song();
                    so.name = item.getElementsByTagName("name")[0].textContent;
                    so.catIndex = item.getElementsByTagName("category")[0].textContent;
                    so.font = item.getElementsByTagName("font")[0].textContent;
                    so.font2 = w(item.getElementsByTagName("font2")[0]);
                    so.timestamp = w(item.getElementsByTagName("timestamp")[0]);
                    const r = item.getElementsByTagName("yvideo")[0];
                    so.yvideo = r != null ? fixHTTPS_Link(r.textContent) : "";
                    so.bkgnd_fname = item.getElementsByTagName("bkgnd")[0].textContent;
                    so.key = item.getElementsByTagName("key")[0].textContent;
                    so.copyright = item.getElementsByTagName("copyright")[0].textContent;
                    so.notes = item.getElementsByTagName("notes")[0].textContent;
                    so.slides = item.getElementsByTagName("slide")[0].textContent;
                    so.slides2 = w(item.getElementsByTagName("slide2")[0]);
                    so.name2 = w(item.getElementsByTagName("name2")[0]);
                    so.tags = w(item.getElementsByTagName("tags")[0]).toUpperCase();
                    so.slideseq = w(item.getElementsByTagName("slideseq")[0]);
                    so.subcat = w(item.getElementsByTagName("subcat")[0]);

                    $RvW.songManagerObj.addSong(so, false, true);
                    addTagList(so.tags);

                    addedSongs++;
                }
            }

            if (addedSongs > 0) {
                fillTagsToUI();
            } else {
                Toast.show("No New Songs to add.");
            }

            function w(D) {
                return D != null ? D.textContent : "";
            }
        }
    }
}