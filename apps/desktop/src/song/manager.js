// TODO: yui-migrate
// - YAHOO.widget.Panel

class SongManager {
    constructor(_arg1, _arg2) {
        this.addSong = addSong;
        this.updateSong = updateSong;
        this.deleteSong = deleteSong;
        this.deleteSongByCat = deleteSongByCat;
        this.delCatManagedUpdate = delCatManagedUpdate;
        this.getSongObj = getSongObj;
        this.getSongsFromCat = getSongsFromCat;
        this.get_sm_cat_records = get_sm_cat_records;
        this.getFontList = getFontList;
        this.searchRecords = searchRecords;
        this.processImportSongDB = processImportSongDB;
        this.processExportSongXML = processExportSongXML;
        this.processExportCatXML = processExportCatXML;
        this.processImportSongXML = processImportSongXML;
        this.addImportSongs = addImportSongs;
        this.getSongObjWithID = getSongObjWithID;
        this.getSongObjWithName = getSongObjWithName;
        this.getSongID = getSongID;
        this.checkSongExists = checkSongExists;
        this.checkSongExistsInCat = checkSongExistsInCat;
        this.getAllTitlesForWeb = getAllTitlesForWeb;
        this.test2_updateRecords = test2_updateRecords;
        this.test2_getOrgsonglist = test2_getOrgsonglist;

        var m_isDebug = false;
        var ax = false;
        var ad = "./song/default.db";
        var m_sqlConnection = null;
        var aA = null;
        var ab = "_ALL";
        var av = null;
        var az = [];
        var ae = [];
        var ap = [];
        var m;
        var K;
        var x;
        var v;
        var L;
        var k;
        var am;
        var P;
        var J;
        var W;
        var au;
        var b;
        var an;
        var u;
        var R;
        var ac;
        var aM;
        var af;
        var ao;
        var sng = null;
        var sqlRes = null;
        var aq = null;
        var f = null;
        var aj = null;
        var aH = null;
        var T = 0;

        init(_arg1, _arg2);

        function init(aO, aN) {
            aw();
            av = new songObj();
            ax = false;
            ah();
        }
        function aw() {
            __debug("Generating ProgressPanel");
            aH = new YAHOO.widget.Panel("panelObj2xx", {
                width: "400px",
                fixedcenter: true,
                modal: true,
                visible: false,
                constraintoviewport: true,
            });
            aH.render(document.body);
            aH.setHeader("Song Import Progress");
            var aN = '<span id="total"></span> songs remaining';
            aH.setBody(aN);
            aH.hide();
        }
        function ay(aQ) {
            var aN = "";
            var aP = aQ.length;
            for (var aO = 0; aO < aP; aO++) {
                aN = aN + aQ[aO] + "<slide>";
            }
            return aN;
        }
        function D(aR) {
            var aQ;
            aQ = aR.split("<slide>");
            aQ.splice(aQ.length - 1, 1);
            var aO = $RvW.vvConfigObj.get_hideStanzaNumber();
            if (aO) {
                var aN = aQ.length;
                for (var aP = 0; aP < aN; aP++) {
                    aQ[aP] = aQ[aP].replace(/^-?[0-9]*\.?[0-9]+/, "");
                }
            }
            var aO = $RvW.vvConfigObj.get_show2lines();
            if (aO) {
                aQ = splitIN2(aQ);
            }
            return aQ;
        }
        function j(aQ, aP) {
            var aN = aQ.length;
            var aO = new Array();
            for (var aR = 0; aR < aN; aR++) {
                if (aP[aR] == null) {
                    aO.push("");
                } else {
                    aO.push(aP[aR]);
                }
            }
            return aO;
        }
        function n() {
            var aO = sng.data.length;
            for (var aN = 0; aN < aO; aN++) {
                az[aN] = sng.data[aN].name;
                ae[aN] = sng.data[aN].id;
            }
        }
        function addSong(aN, aP, aO) {
            m = aN.name;
            K = aN.catIndex;
            x = aN.font;
            v = aN.font2;
            L = aN.timestamp;
            k = aN.yvideo;
            am = aN.bkgnd_fname;
            P = aN.key;
            J = aN.copyright;
            W = aN.notes;
            if (aO) {
                au = aN.slides;
                b = aN.slides2;
            } else {
                au = ay(aN.slides);
                b = ay(aN.slides2);
            }
            an = aN.name2;
            u = aN.tags;
            R = aN.slideseq;
            ac = aN.rating;
            aM = aN.chordsavailable;
            af = aN.usagecount;
            ao = aN.subcat;
            s(aP, aO);
        }
        function updateSong(aN, aO, aR, aS) {
            var aP = null;
            var aQ;
            if (aS == null) {
                aQ = false;
            } else {
                aQ = aS;
            }
            if (aR == null) {
                if (aQ) {
                    aP = sqlRes.data[aO].id;
                } else {
                    aP = sng.data[aO].id;
                }
            } else {
                aP = aR;
            }
            __debug("Primary key of the song that is being saved after edit... " + aP);
            m = aN.name;
            K = aN.catIndex;
            x = aN.font;
            v = aN.font2;
            L = aN.timestamp;
            k = aN.yvideo;
            am = aN.bkgnd_fname;
            P = aN.key;
            J = aN.copyright;
            W = aN.notes;
            au = ay(aN.slides);
            b = ay(aN.slides2);
            an = aN.name2;
            u = aN.tags;
            R = aN.slideseq;
            ac = aN.rating;
            aM = aN.chordsavailable;
            af = aN.usagecount;
            ao = aN.subcat;
            Q(aP);
        }
        function deleteSong(aN, aO) {
            if (aO) {
                var aP = sqlRes.data[aN].id;
            } else {
                var aP = sng.data[aN].id;
            }
            X(aP);
        }
        function deleteSongByCat(aN) {
            y(aN);
        }
        function getSongObjWithID(aS) {
            let aP = false;
            const so = new songObj();
            so.init();
            so.slides = [];
            const aN = sng.data.length;
            for (let aQ = 0; aQ < aN; aQ++) {
                if (sng.data[aQ].id === aS) {
                    so.name = sng.data[aQ].name;
                    so.catIndex = sng.data[aQ].cat;
                    so.font = sng.data[aQ].font;
                    so.font2 = sng.data[aQ].font2;
                    so.timestamp = sng.data[aQ].timestamp;
                    so.yvideo = sng.data[aQ].yvideo;
                    so.bkgnd_fname = sng.data[aQ].bkgndfname;
                    so.key = sng.data[aQ].key;
                    so.copyright = sng.data[aQ].copy;
                    so.notes = sng.data[aQ].notes;
                    so.slides = D(sng.data[aQ].lyrics);
                    const aO = sng.data[aQ].lyrics2;
                    if (aO != null) {
                        so.slides2 = D(aO);
                    } else {
                        so.slides2 = [];
                    }
                    so.slides2 = j(so.slides, so.slides2);
                    so.name2 = sng.data[aQ].title2;
                    so.tags = sng.data[aQ].tags;
                    so.slideseq = sng.data[aQ].slideseq;
                    so.rating = sng.data[aQ].rating;
                    so.chordsavailable = sng.data[aQ].chordsavailable;
                    so.usagecount = sng.data[aQ].usagecount;
                    so.subcat = sng.data[aQ].subcat;
                    aP = true;
                    break;
                }
            }
            if (aP) {
                return so;
            } else {
                return null;
            }
        }
        function getSongObjWithName(aQ) {
            var aP = false;
            var aS = new songObj();
            aS.init();
            aS.slides = new Array();
            var aN = sng.data.length;
            for (var aR = 0; aR < aN; aR++) {
                if (sng.data[aR].name == aQ) {
                    aS.name = sng.data[aR].name;
                    aS.catIndex = sng.data[aR].cat;
                    aS.font = sng.data[aR].font;
                    aS.font2 = sng.data[aR].font2;
                    aS.timestamp = sng.data[aR].timestamp;
                    aS.yvideo = sng.data[aR].yvideo;
                    aS.bkgnd_fname = sng.data[aR].bkgndfname;
                    aS.key = sng.data[aR].key;
                    aS.copyright = sng.data[aR].copy;
                    aS.notes = sng.data[aR].notes;
                    aS.slides = D(sng.data[aR].lyrics);
                    var aO = sng.data[aR].lyrics2;
                    if (aO != null) {
                        aS.slides2 = D(aO);
                    } else {
                        aS.slides2 = new Array();
                    }
                    aS.slides2 = j(aS.slides, aS.slides2);
                    aS.name2 = sng.data[aR].title2;
                    aS.tags = sng.data[aR].tags;
                    aS.slideseq = sng.data[aR].slideseq;
                    aS.rating = sng.data[aR].rating;
                    aS.chordsavailable = sng.data[aR].chordsavailable;
                    aS.usagecount = sng.data[aR].usagecount;
                    aS.subcat = sng.data[aR].subcat;
                    aP = true;
                    break;
                }
            }
            if (aP) {
                return aS;
            } else {
                return null;
            }
        }
        function getSongID(aO, aP) {
            var aN = 0;
            if (!aP) {
                aN = sng.data[aO].id;
            } else {
                aN = sqlRes.data[aO].id;
            }
            return aN;
        }
        function getSongObj(aO, aQ) {
            var aP = new songObj();
            aP.init();
            aP.slides = new Array();
            if (!aQ) {
                aP.name = sng.data[aO].name;
                aP.catIndex = sng.data[aO].cat;
                aP.font = sng.data[aO].font;
                aP.font2 = sng.data[aO].font2;
                aP.timestamp = sng.data[aO].timestamp;
                aP.yvideo = sng.data[aO].yvideo;
                aP.bkgnd_fname = sng.data[aO].bkgndfname;
                aP.key = sng.data[aO].key;
                aP.copyright = sng.data[aO].copy;
                aP.notes = sng.data[aO].notes;
                aP.slides = D(sng.data[aO].lyrics);
                var aN = sng.data[aO].lyrics2;
                if (aN != null) {
                    aP.slides2 = D(aN);
                } else {
                    aP.slides2 = new Array();
                }
                aP.slides2 = j(aP.slides, aP.slides2);
                aP.name2 = sng.data[aO].title2;
                aP.tags = sng.data[aO].tags;
                aP.slideseq = sng.data[aO].slideseq;
                aP.rating = sng.data[aO].rating;
                aP.chordsavailable = sng.data[aO].chordsavailable;
                aP.usagecount = sng.data[aO].usagecount;
                aP.subcat = sng.data[aO].subcat;
            } else {
                aP.name = sqlRes.data[aO].name;
                aP.catIndex = sqlRes.data[aO].cat;
                aP.font = sqlRes.data[aO].font;
                aP.font2 = sqlRes.data[aO].font2;
                aP.timestamp = sqlRes.data[aO].timestamp;
                aP.yvideo = sqlRes.data[aO].yvideo;
                aP.bkgnd_fname = sqlRes.data[aO].bkgndfname;
                aP.key = sqlRes.data[aO].key;
                aP.copyright = sqlRes.data[aO].copy;
                aP.notes = sqlRes.data[aO].notes;
                aP.slides = D(sqlRes.data[aO].lyrics);
                var aN = sqlRes.data[aO].lyrics2;
                if (aN != null) {
                    aP.slides2 = D(aN);
                } else {
                    aP.slides2 = new Array();
                }
                aP.slides2 = j(aP.slides, aP.slides2);
                aP.name2 = sqlRes.data[aO].title2;
                aP.tags = sqlRes.data[aO].tags;
                aP.slideseq = sqlRes.data[aO].slideseq;
                aP.rating = sqlRes.data[aO].rating;
                aP.chordsavailable = sqlRes.data[aO].chordsavailable;
                aP.usagecount = sqlRes.data[aO].usagecount;
                aP.subcat = sqlRes.data[aO].subcat;
            }
            return aP;
        }
        function getSongsFromCat(aN) {
            ab = aN;
            __debug("In getSongsFromCat function " + aN);
            $RvW.songNavObj.update_songList(sng, aN);
        }
        function aK() {
            var aN = sng.data.length;
            var aO = "";
            for (var aP = 0; aP < aN; aP++) {
                aO = aO + sng.data[aP].name + "|" + sng.data[aP].cat + "\n";
            }
            var aQ = "./song/songlist.txt";
            save2file(aO, aQ, false);
        }
        function get_sm_cat_records() {
            return aq;
        }
        function d() {
            if (f.data != null) {
                var aO = f.data.length;
                for (var aN = 0; aN < aO; aN++) {
                    ap[aN] = f.data[aN].font;
                }
            }
        }
        function getFontList() {
            return ap;
        }
        function processImportSongDB() {
            var aN = new songImportClass();
            aN.init();
        }
        function processImportSongXML() {
            var aN = new songPortXML();
            aN.init(sng, null, null, 1);
            aN.importXML();
        }
        function processExportSongXML() {
            var aN = new songPortXML();
            aN.init(sng, null, null, 1);
            aN.exportAll();
        }
        function processExportCatXML() {
            var aN = new songPortXML();
            aN.init(sng, ab, null, 2);
            aN.exportByCat();
        }
        function addImportSongs(aN) {
            var aO = aN.data.length;
            for (var aP = 0; aP < aO; aP++) {
                var aQ = checkSongExists(aN.data[aP].name);
                if (!aQ) {
                    m = aN.data[aP].name;
                    au = aN.data[aP].lyrics;
                    b = aN.data[aP].lyrics2;
                    J = aN.data[aP].copy;
                    K = aN.data[aP].cat;
                    x = aN.data[aP].font;
                    v = aN.data[aP].font2;
                    L = aN.data[aP].timestamp;
                    k = aN.data[aP].yvideo;
                    P = aN.data[aP].key;
                    W = aN.data[aP].notes;
                    am = "";
                    if (aP != aO - 1) {
                        s(false, true);
                    } else {
                        s(true, true);
                    }
                }
            }
        }
        function checkSongExists(aO) {
            if (sng.data != null) {
                var aN = sng.data.length;
                for (var aP = 0; aP < aN; aP++) {
                    if (sng.data[aP].name == aO) {
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        }
        function checkSongExistsInCat(aP, aN) {
            if (sng.data != null) {
                var aO = sng.data.length;
                for (var aQ = 0; aQ < aO; aQ++) {
                    var aS = sng.data[aQ].name;
                    var aR = sng.data[aQ].cat;
                    if (aS == aP && aR == aN) {
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        }
        function __debug(aN) {
            if (m_isDebug) {
                air.trace("[SongManager]...." + aN);
            }
        }
        function ah() {
            m_sqlConnection = new air.SQLConnection();
            m_sqlConnection.addEventListener(air.SQLEvent.OPEN, z);
            m_sqlConnection.addEventListener(air.SQLErrorEvent.ERROR, I);
            var aN = air.File.applicationStorageDirectory.resolvePath(ad);
            m_sqlConnection.openAsync(aN);
        }
        function z(aN) {
            __debug("DB was created successfully");
            ax = true;
            aG();
        }
        function I(aN) {
            __debug("Error message:" + aN.error.message);
            __debug("Details (create DB):" + aN.error.details);
            ax = false;
            rvw.ui.Toast.show(
                "Song Database",
                "Error opening Song Database : " + aN.error.message
            );
        }
        function aI(aO, aQ) {
            __debug("Updating the Song database TABLE: " + aO + " " + aQ);
            var aS = new air.SQLStatement();
            aS.sqlConnection = m_sqlConnection;
            var aR = "ALTER TABLE sm ADD COLUMN " + aO + " " + aQ;
            aS.text = aR;
            aS.addEventListener(air.SQLEvent.RESULT, aP);
            aS.addEventListener(air.SQLErrorEvent.ERROR, aN);
            aS.execute();
            function aP() {
                __debug("Updating table worked !!!...");
            }
            function aN() {
                __debug("Failed updating table...");
                __debug("Error message:" + event.error.message);
                __debug("Details in creating table :" + event.error.details);
            }
        }
        function aG() {
            __debug(" Creating song table...");
            aA = new air.SQLStatement();
            aA.sqlConnection = m_sqlConnection;
            var aN = "CREATE TABLE IF NOT EXISTS sm (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, cat TEXT, font TEXT, font2 TEXT, timestamp TEXT, yvideo TEXT, bkgndfname TEXT, key TEXT, copy TEXT, notes TEXT, lyrics TEXT lyrics2 TEXT title2 TEXT tags TEXT slideseq TEXT rating INTEGER chordsavailable Boolean usagecount INTEGER subcat TEXT )";
            aA.text = aN;
            aA.addEventListener(air.SQLEvent.RESULT, r);
            aA.addEventListener(air.SQLErrorEvent.ERROR, M);
            aA.execute();
        }
        function r() {
            aA.removeEventListener(air.SQLEvent.RESULT, r);
            aA.removeEventListener(air.SQLErrorEvent.ERROR, M);
            __debug("Notes Table created.....");
            var songDBVersion = $RvW.vvConfigObj.get_songDBVersion();
            __debug("Song DB version " + songDBVersion);
            if (songDBVersion < 2) {
                aI("title2", "TEXT");
                aI("tags", "TEXT");
                aI("slideseq", "TEXT");
                aI("rating", "INTEGER");
                aI("chordsavailable", "Boolean");
                aI("usagecount", "INTEGER");
                aI("subcat", "TEXT");
                $RvW.vvConfigObj.set_songDBVersion(2);
                songDBVersion = $RvW.vvConfigObj.get_songDBVersion();
                $RvW.vvConfigObj.save();
            }
            if (!isUpToDate() && task1Status() == false) {
                delCatManagedUpdate();
            } else {
                C();
                F();
                at();
            }
        }
        function M(aN) {
            aA.removeEventListener(air.SQLEvent.RESULT, r);
            aA.removeEventListener(air.SQLErrorEvent.ERROR, M);
            __debug("Error message:" + aN.error.message);
            __debug("Details in creating table :" + aN.error.details);
        }
        function aD() {
            ax = false;
        }
        function s(aN, aR) {
            if (T == 0) {
                aH.show();
            }
            var aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            var aS = "";
            aS +=
                "INSERT INTO sm (name, cat, font, font2, timestamp, yvideo, bkgndfname, key, copy, notes, lyrics, lyrics2, title2, tags, slideseq, rating, chordsavailable, usagecount,subcat)";
            aS +=
                " SELECT :n, :cat, :fon, :fon2, :ts, :yv, :bkg, :key, :cop, :not, :lyr, :lyr2, :n2, :tag, :seq, :rate, :chords, :count, :subcat";
            if (!aN) {
                aS +=
                    " WHERE NOT EXISTS (SELECT 1 FROM sm WHERE name = :n AND cat = :cat)";
            }
            aP.text = aS;
            aP.addEventListener(air.SQLEvent.RESULT, aO);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aQ);
            aP.parameters[":n"] = m;
            aP.parameters[":cat"] = K;
            aP.parameters[":fon"] = x;
            aP.parameters[":fon2"] = v;
            aP.parameters[":ts"] = L;
            aP.parameters[":yv"] = k;
            aP.parameters[":bkg"] = am;
            aP.parameters[":key"] = P;
            aP.parameters[":cop"] = J;
            aP.parameters[":not"] = W;
            aP.parameters[":lyr"] = au;
            aP.parameters[":lyr2"] = b;
            aP.parameters[":n2"] = an;
            aP.parameters[":tag"] = u;
            aP.parameters[":seq"] = R;
            aP.parameters[":rate"] = ac;
            aP.parameters[":chords"] = aM;
            aP.parameters[":count"] = af;
            aP.parameters[":subcat"] = ao;
            T++;
            aP.execute();
            function aO(aV) {
                T--;
                if (T % 10 == 0) {
                    document.getElementById("total").innerHTML = T;
                }
                aP.removeEventListener(air.SQLEvent.RESULT, aO);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, aQ);
                if (aR) {
                    if (T == 0) {
                        aH.hide();
                        rvw.ui.Toast.show(
                            "Song Database",
                            "Song Lyrics imported to the Song Database complete."
                        );
                        if (!isUpToDate()) {
                            rvw.ui.Toast.show("Songs", "Imported song database");
                            task1Complete();
                            checkVerUpdateFlags();
                        }
                        C();
                        F();
                        at();
                    }
                }
                if (aN) {
                    __debug("UPDATE UI Flag....");
                    var aU = aP.getResult();
                    var aT = aU.lastInsertRowID;
                    $RvW.songEditObj.setEditPrimaryKey(aT);
                    C();
                    F();
                    at();
                    if (aR) {
                        rvw.ui.Toast.show(
                            "Song Database",
                            "Song Lyrics imported to the Song Database"
                        );
                    } else {
                        rvw.ui.Toast.show(
                            "Song Database",
                            'Song "' + m + '" added to the Song Database.'
                        );
                    }
                }
                if (T == 0) {
                    __debug("Record count done.. ");
                    aH.hide();
                }
            }
            function aQ(aU) {
                T--;
                aP.removeEventListener(air.SQLEvent.RESULT, aO);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, aQ);
                rvw.ui.Toast.show(
                    "ADD EDIT Song",
                    "Failed to update song database.  Error message:" + aU.error.message
                );
                if (!isUpToDate() && T == 0) {
                    var aT = $RvW.vvConfigObj.get_songDBVersion();
                    if (aT == 2) {
                        $RvW.vvConfigObj.set_songDBVersion(1);
                        $RvW.vvConfigObj.save();
                        rvw.ui.Toast.show(
                            "ADD EDIT Song",
                            "Failed to update song database. Please restart VerseVIEW Error message:" +
                            aU.error.message
                        );
                    }
                }
            }
        }
        function Q(aN) {
            var aO = new air.SQLStatement();
            aO.sqlConnection = m_sqlConnection;
            var aR = "";
            aR +=
                "UPDATE sm SET name=:n,cat=:cat,font=:fon,font2=:fon2,timestamp=:ts,yvideo=:yv,bkgndfname=:bkg,key=:key,copy=:cop,notes=:not,lyrics=:lyr,lyrics2=:lyr2, title2=:n2, tags=:tag, slideseq=:seq, rating=:rate, chordsavailable=:chords, usagecount=:count,subcat=:subcat WHERE id=:id;";
            aO.text = aR;
            aO.addEventListener(air.SQLEvent.RESULT, aP);
            aO.addEventListener(air.SQLErrorEvent.ERROR, aQ);
            aO.parameters[":id"] = aN;
            aO.parameters[":n"] = m;
            aO.parameters[":cat"] = K;
            aO.parameters[":fon"] = x;
            aO.parameters[":fon2"] = v;
            aO.parameters[":ts"] = L;
            aO.parameters[":yv"] = k;
            aO.parameters[":bkg"] = am;
            aO.parameters[":key"] = P;
            aO.parameters[":cop"] = J;
            aO.parameters[":not"] = W;
            aO.parameters[":lyr"] = au;
            aO.parameters[":lyr2"] = b;
            aO.parameters[":n2"] = an;
            aO.parameters[":tag"] = u;
            aO.parameters[":seq"] = R;
            aO.parameters[":rate"] = ac;
            aO.parameters[":chords"] = aM;
            aO.parameters[":count"] = af;
            aO.parameters[":subcat"] = ao;
            aO.execute();
            function aP(aS) {
                aO.removeEventListener(air.SQLEvent.RESULT, aP);
                aO.removeEventListener(air.SQLErrorEvent.ERROR, aQ);
                $RvW.songNavObj.sn_backupGlobalID();
                C();
                F();
                at();
                rvw.ui.Toast.show("Song Database", 'Song "' + m + '" updated.');
            }
            function aQ(aS) {
                aO.removeEventListener(air.SQLEvent.RESULT, aP);
                aO.removeEventListener(air.SQLErrorEvent.ERROR, aQ);
                __debug("UPDATE error:" + aS.error);
                __debug("event.error.code:" + aS.error.code);
                __debug("event.error.message:" + aS.error.message);
            }
        }
        function at() {
            __debug("Getting ALL Data from Song DB");
            var aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            var aQ = "SELECT * FROM sm ORDER BY name ASC";
            aP.text = aQ;
            aP.addEventListener(air.SQLEvent.RESULT, aO);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aN);
            aP.execute();
            function aO(aR) {
                __debug("Succesfuly got all data from Song DB");
                sng = aP.getResult();
                a();
                $RvW.scheduleObj.init();
                $RvW.songNavObj.update_songList(sng, "_ALL");
            }
            function aN(aR) {
                __debug("Song Manager data error...");
            }
        }
        function getAllTitlesForWeb(query, callback) {
            __debug("Getting ALL Titles from Song DB");

            const sqlStatement = new air.SQLStatement();
            sqlStatement.sqlConnection = m_sqlConnection;
            sqlStatement.text = "SELECT * FROM sm ORDER BY name ASC";
            sqlStatement.addEventListener(air.SQLEvent.RESULT, function onResult() {
                __debug("Succesfuly got all data from Song DB");
                callback(null, $RvW.songNavObj.get_songList(sqlStatement.getResult(), "_ALL", query));
            });
            sqlStatement.addEventListener(air.SQLErrorEvent.ERROR, function onError(aS) {
                __debug("Song Manager data error...");
                callback(aS);
            });
            sqlStatement.execute();
        }
        function C() {
            __debug("Getting ALL Categories from Song DB");
            var aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            var aQ = "SELECT DISTINCT cat FROM sm ORDER BY cat ASC";
            aP.text = aQ;
            aP.addEventListener(air.SQLEvent.RESULT, aO);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aN);
            aP.execute();
            function aO(aR) {
                __debug("Succesfuly got all categories from Song DB");
                aq = aP.getResult();
                $RvW.songNavObj.update_CategoryList(aq);
            }
            function aN(aR) {
                __debug("Song Manager data error while trying to get category...");
            }
        }
        function F() {
            __debug("Getting ALL Unique Fonts from Song DB");
            var aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            var aQ = "SELECT DISTINCT font FROM sm ORDER BY font ASC";
            aP.text = aQ;
            aP.addEventListener(air.SQLEvent.RESULT, aO);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aN);
            aP.execute();
            function aO(aR) {
                __debug("Succesfuly got all fonts from Song DB");
                f = aP.getResult();
                d();
            }
            function aN(aR) {
                __debug("Song Manager data error while trying to get fonts...");
            }
        }
        function searchRecords(aP, aQ, cb = null) {
            __debug("Searching Song DB " + aQ);

            const sqlQuery = new air.SQLStatement();
            sqlQuery.sqlConnection = m_sqlConnection;
            sqlQuery.addEventListener(air.SQLEvent.RESULT, _onSqlResult);
            sqlQuery.addEventListener(air.SQLErrorEvent.ERROR, _onSqlError);

            let aT = "";
            if (aQ === SEARCH_TITLE) {
                aT = "SELECT * FROM sm WHERE name LIKE :param1 OR title2 LIKE :param1";
                sqlQuery.parameters[":param1"] = aP;
            }
            if (aQ === SEARCH_LYRICS) {
                aT =
                    "SELECT * FROM sm WHERE lyrics LIKE :param1 OR lyrics2 LIKE :param1 OR name LIKE :param1 OR subcat == :param2";
                sqlQuery.parameters[":param1"] = aP;
                var aS = /%/gi;
                sqlQuery.parameters[":param2"] = aP.replace(aS, "");
            }
            if (aQ === SEARCH_TAGS) {
                aT = "SELECT * FROM sm WHERE tags LIKE :param1";
                sqlQuery.parameters[":param1"] = aP;
            }
            if (aQ === SEARCH_AUTHOR) {
                aT = "SELECT * FROM sm WHERE copy LIKE :param1";
                sqlQuery.parameters[":param1"] = aP;
            }
            if (aQ === SEARCH_SONGNUMBER) {
                aT = "SELECT * FROM sm WHERE subcat LIKE :param1";
                sqlQuery.parameters[":param1"] = aP;
            }
            sqlQuery.text = aT;
            sqlQuery.execute();
            function _onSqlResult(aU) {
                sqlQuery.removeEventListener(air.SQLEvent.RESULT, _onSqlResult);
                sqlQuery.removeEventListener(air.SQLErrorEvent.ERROR, _onSqlError);

                sqlRes = sqlQuery.getResult();
                if (aQ === SEARCH_TAGS && sqlRes.data == null) {
                    removeTag(aP);
                    rvw.ui.Toast.show("Song Tag Search", "No matching tag");
                } else {
                    if (aP.length > 2) {
                        $RvW.wordbrain.findRecordBy_wordin(aP);
                    }
                    $RvW.songNavObj.searchComplete(sqlRes, aQ);
                }
            }
            function _onSqlError(aU) {
                sqlQuery.removeEventListener(air.SQLEvent.RESULT, _onSqlResult);
                sqlQuery.removeEventListener(air.SQLErrorEvent.ERROR, _onSqlError);
                __debug("Song Manager search data error...");
                alert("Search function failed.");
            }
        }
        function X(aQ) {
            __debug("Deleting record with keyValue as primary key from Song Database...");

            const aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            let aR = "";
            aR += "DELETE FROM sm WHERE id = :id;";
            aP.text = aR;
            aP.addEventListener(air.SQLEvent.RESULT, aN);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aO);
            aP.parameters[":id"] = aQ;
            aP.execute();
            function aN(aS) {
                aP.removeEventListener(air.SQLEvent.RESULT, insertResult);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
                C();
                F();
                at();
            }
            function aO(aS) {
                aP.removeEventListener(air.SQLEvent.RESULT, insertResult);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, insertError);
                __debug("Error deleting song DB");
                __debug("event.error.code:" + aS.error.code);
                __debug("event.error.message:" + aS.error.message);
            }
        }
        function y(aP) {
            __debug("Deleting records based on category from Song Database...");
            var aQ = new air.SQLStatement();
            aQ.sqlConnection = m_sqlConnection;
            var aR = "";
            aR += "DELETE FROM sm WHERE cat = :cat;";
            aQ.text = aR;
            aQ.addEventListener(air.SQLEvent.RESULT, aN);
            aQ.addEventListener(air.SQLErrorEvent.ERROR, aO);
            aQ.parameters[":cat"] = aP;
            aQ.execute();
            function aN(aS) {
                aQ.removeEventListener(air.SQLEvent.RESULT, aN);
                aQ.removeEventListener(air.SQLErrorEvent.ERROR, aO);
                m_sqlConnection.compact();
                C();
                F();
                at();
            }
            function aO(aS) {
                aQ.removeEventListener(air.SQLEvent.RESULT, aN);
                aQ.removeEventListener(air.SQLErrorEvent.ERROR, aO);
                __debug("Error deleting song DB");
                __debug("event.error.code:" + aS.error.code);
                __debug("event.error.message:" + aS.error.message);
            }
        }
        function delCatManagedUpdate() {
            __debug("Deleting Category for managed update from Song Database...");
            var aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            var aQ = "";
            aQ += "DELETE FROM sm WHERE cat = :cat1 OR cat = :cat2 OR cat = :cat3;";
            aP.text = aQ;
            aP.addEventListener(air.SQLEvent.RESULT, aN);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aO);
            aP.parameters[":cat1"] = "VV Malayalam 2021";
            aP.parameters[":cat2"] = "VV Hindi 2021";
            aP.parameters[":cat3"] = "VV Tamil 2021";
            aP.execute();
            function aN(aR) {
                aP.removeEventListener(air.SQLEvent.RESULT, aN);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, aO);
                setTimeout(function () {
                    g();
                    m_sqlConnection.compact();
                }, 3000);
            }
            function aO(aR) {
                aP.removeEventListener(air.SQLEvent.RESULT, aN);
                aP.removeEventListener(air.SQLErrorEvent.ERROR, aO);
                __debug("Error deleting song DB category");
                __debug("event.error.code:" + aR.error.code);
                __debug("event.error.message:" + aR.error.message);
            }
        }
        function g() {
            __debug("about to copy new records...");
            var aN = "./song/default.db";
            var aP = air.File.applicationDirectory.resolvePath(aN);
            m_sqlConnection.addEventListener(air.SQLEvent.ATTACH, aQ);
            m_sqlConnection.addEventListener(air.SQLErrorEvent.ERROR, aO);
            m_sqlConnection.attach("newstuff", aP);
            function aQ(aR) {
                __debug("****** DB attach worked");
                aF();
            }
            function aO(aR) {
                __debug("Error message:" + aR.error.message);
                __debug("Details (Update Failed):" + aR.error.details);
            }
        }
        function aF() {
            __debug("Getting ALL Data from Original Song DB");
            var aP = new air.SQLStatement();
            aP.sqlConnection = m_sqlConnection;
            var aQ = "INSERT INTO sm SELECT NULL,name,cat,font,font2,timestamp,yvideo,bkgndfname,key,copy,notes,lyrics,lyrics2,title2,tags,slideseq,rating,chordsavailable,usagecount,subcat FROM newstuff.sm WHERE cat = :cat1 OR cat = :cat2 OR cat = :cat3";
            aP.text = aQ;
            aP.addEventListener(air.SQLEvent.RESULT, aO);
            aP.addEventListener(air.SQLErrorEvent.ERROR, aN);
            aP.parameters[":cat1"] = "VV Malayalam 2021";
            aP.parameters[":cat2"] = "VV Hindi 2021";
            aP.parameters[":cat3"] = "VV Tamil 2021";
            aP.execute();
            function aO(aR) {
                __debug("Succesfuly got all data from Original Song DB and inserted");
                if (!isUpToDate()) {
                    rvw.ui.Toast.show("Songs", "Updated song database");
                    task1Complete();
                    checkVerUpdateFlags();
                }
                C();
                F();
                at();
            }
            function aN(aR) {
                __debug("Song DB updater data error...");
                __debug("UPDATE error:" + aR.error);
                __debug("event.error.code:" + aR.error.code);
                __debug("event.error.message:" + aR.error.message);
                rvw.ui.Toast.show("Song Manager", "Song DB updater data error...");
            }
        }
        function ag() {
            var aO = sng.data.length;
            var aP = new Array(0, 0);
            aP[0] = 0;
            aP[1] = 0;
            for (var aQ = 0; aQ < aO; aQ++) {
                var aR = sng.data[aQ].subcat;
                var aN = sng.data[aQ].cat;
                if (aN == "VV Malayalam 2021") {
                    if (aR != null && aR != "") {
                        if (parseInt(aR) > aP[0]) {
                            aP[0] = aR;
                        }
                    }
                }
                if (aN == "VV Hindi 2021") {
                    if (aR != null && aR != "") {
                        if (parseInt(aR) > aP[1]) {
                            aP[1] = aR;
                        }
                    }
                }
            }
            aP[1] = aP[1] - 5000;
            return aP;
        }
        function a() {
            var aN = ag();
            $RvW.songNumberObj.setMaxMalayalam(aN[0]);
            $RvW.songNumberObj.setMaxHindi(aN[1]);
        }
        function aB() {
            var aO = sng.data.length;
            alert("Number of records..." + aO);
            var aQ = 0;
            var aP = sng.data[aQ].id;
            var aN = sng.data[aQ].cat;
            aR(aP, aN);
            function aR(aT, aS) {
                var aW = new air.SQLStatement();
                aW.sqlConnection = m_sqlConnection;
                var aY = "";
                aY += "UPDATE sm SET subcat=:songnumber WHERE id=:id;";
                aW.text = aY;
                aW.addEventListener(air.SQLEvent.RESULT, aZ);
                aW.addEventListener(air.SQLErrorEvent.ERROR, aU);
                aW.parameters[":id"] = aT;
                var aV = $RvW.songNumberObj.assignSongNumber(aS);
                aW.parameters[":songnumber"] = aV;
                air.trace(aQ + " ID: " + aT + " Song Number: " + aV);
                aW.execute();
                function aZ(a0) {
                    aW.removeEventListener(air.SQLEvent.RESULT, aZ);
                    aW.removeEventListener(air.SQLErrorEvent.ERROR, aU);
                    aX();
                }
                function aU(a0) {
                    aW.removeEventListener(air.SQLEvent.RESULT, aZ);
                    aW.removeEventListener(air.SQLErrorEvent.ERROR, aU);
                    __debug("UPDATE error:" + a0.error);
                    __debug("event.error.code:" + a0.error.code);
                    __debug("event.error.message:" + a0.error.message);
                    aX();
                }
                function aX() {
                    aQ++;
                    if (aQ < aO) {
                        var a1 = sng.data[aQ].id;
                        var a0 = sng.data[aQ].cat;
                        aR(a1, a0);
                    } else {
                        alert("Song number update complete");
                    }
                }
            }
        }
        function S() {
            var aO = sng.data.length;
            var aQ = 0;
            var aP = sng.data[aQ].id;
            var aN = sng.data[aQ].cat;
            var aR = sng.data[aQ].name.toLowerCase();
            aS(aP, aN, aR);
            function aS(aZ, aW, aV) {
                var aU = new air.SQLStatement();
                aU.sqlConnection = m_sqlConnection;
                var a0 = "";
                a0 += "UPDATE sm SET subcat=:songnumber WHERE id=:id;";
                aU.text = a0;
                aU.addEventListener(air.SQLEvent.RESULT, aT);
                aU.addEventListener(air.SQLErrorEvent.ERROR, aY);
                aU.parameters[":id"] = aZ;
                var a1 = $RvW.songNumberObj.assignSongNumber(aW, aV);
                aU.parameters[":songnumber"] = a1;
                aU.execute();
                function aT(a2) {
                    aU.removeEventListener(air.SQLEvent.RESULT, aT);
                    aU.removeEventListener(air.SQLErrorEvent.ERROR, aY);
                    aX();
                }
                function aY(a2) {
                    aU.removeEventListener(air.SQLEvent.RESULT, aT);
                    aU.removeEventListener(air.SQLErrorEvent.ERROR, aY);
                    __debug("UPDATE error:" + a2.error);
                    __debug("event.error.code:" + a2.error.code);
                    __debug("event.error.message:" + a2.error.message);
                    aX();
                }
                function aX() {
                    aQ++;
                    if (aQ < aO) {
                        var a3 = sng.data[aQ].id;
                        var a2 = sng.data[aQ].cat;
                        var a4 = sng.data[aQ].name.toLowerCase();
                        aS(a3, a2, a4);
                    } else {
                        alert("Song number update complete");
                    }
                }
            }
        }
        function test2_updateRecords() {
            var aS = testName.length;
            var aT = sng.data.length;
            for (var aQ = 0; aQ < aS; aQ++) {
                var aO = testName[aQ].toLowerCase();
                aO = test2_updatedname(aO);
                var aR = false;
                for (var aN = 0; aN < aT; aN++) {
                    var aP = sng.data[aN].name;
                    aP = aP.toLowerCase();
                    if (aO == aP) {
                        aR = true;
                        break;
                    }
                }
                if (!aR) {
                    air.trace("Song not found :" + aO);
                }
            }
        }
        function test2_getOrgsonglist() {
            var aS = new Array();
            var aR = "";
            var aO = sng.data.length;
            for (var aQ = 0; aQ < aO; aQ++) {
                var aN = sng.data[aQ].cat;
                var aP = sng.data[aQ].name;
                var aT = sng.data[aQ].subcat;
                if (aN == "Malayalam 2020" || aN == "Hindi 2020") {
                    aR = aN + "|" + aP + "|" + aT;
                    aS.push(aR);
                }
            }
            return aS;
        }
        function w(aS) {
            var aO = sng.data.length;
            __debug("record length " + aO);
            for (var aQ = 0; aQ < aO; aQ++) {
                var aN = sng.data[aQ].cat;
                var aR = new songObj();
                if (aN == "Malayalam 2019") {
                    aR = getSongObj(aQ, false);
                    var aP = findIndexFromTestTitle1(aR.name);
                    if (aP != -1) {
                        aR.name2 = testTitle2[aP];
                        aR.tags = "";
                        if (testTag1[aP] != "") {
                            aR.tags = aR.tags + testTag1[aP] + ",";
                        }
                        if (testTag2[aP] != "") {
                            aR.tags = aR.tags + testTag2[aP] + ",";
                        }
                        if (testTag3[aP] != "") {
                            aR.tags = aR.tags + testTag3[aP] + ",";
                        }
                        aR.tags = aR.tags.slice(0, -1);
                        updateSong(aR, aQ, sng.data[aQ].id, false);
                    } else {
                        __debug("**** No Match **** : " + aR.name);
                    }
                }
            }
        }
    }
}
