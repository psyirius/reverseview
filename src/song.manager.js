// TODO: yui-migrate
// - YAHOO.widget.Panel

class songManagerClass {
  constructor() {
    this.init = Z;
    this.addSong = ak;
    this.updateSong = l;
    this.deleteSong = aL;
    this.deleteSongByCat = aa;
    this.delCatManagedUpdate = E;
    this.getSongObj = O;
    this.getSongsFromCat = A;
    this.get_sm_cat_records = c;
    this.getFontList = aJ;
    this.searchRecords = p;
    this.processImportSongDB = e;
    this.processExportSongXML = h;
    this.processExportCatXML = Y;
    this.processImportSongXML = i;
    this.addImportSongs = o;
    this.getSongObjWithID = ar;
    this.getSongObjWithName = H;
    this.getSongID = q;
    this.checkSongExists = V;
    this.checkSongExistsInCat = ai;
    this.getAllTitlesForWeb = aC;
    this.test2_updateRecords = G;
    this.test2_getOrgsonglist = B;
    var m_isDebug = true;
    var ax = false;
    var ad = "./song/default.db";
    var m_sqlConnection = null;
    var aA = null;
    var ab = "_ALL";
    var av = null;
    var az = new Array();
    var ae = new Array();
    var ap = new Array();
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
    var N = null;
    var sqlRes = null;
    var aq = null;
    var f = null;
    var aj = null;
    var aH = null;
    var T = 0;
    function Z(aO, aN) {
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
      var aQ = new Array();
      aQ = aR.split("<slide>");
      aQ.splice(aQ.length - 1, 1);
      var aO = vvConfigObj.get_hideStanzaNumber();
      if (aO) {
        var aN = aQ.length;
        for (var aP = 0; aP < aN; aP++) {
          aQ[aP] = aQ[aP].replace(/^-?[0-9]*\.?[0-9]+/, "");
        }
      }
      var aO = vvConfigObj.get_show2lines();
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
      var aO = N.data.length;
      for (var aN = 0; aN < aO; aN++) {
        az[aN] = N.data[aN].name;
        ae[aN] = N.data[aN].id;
      }
    }
    function ak(aN, aP, aO) {
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
    function l(aN, aO, aR, aS) {
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
          aP = N.data[aO].id;
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
    function aL(aN, aO) {
      if (aO) {
        var aP = sqlRes.data[aN].id;
      } else {
        var aP = N.data[aN].id;
      }
      X(aP);
    }
    function aa(aN) {
      y(aN);
    }
    function ar(aS) {
      var aP = false;
      var aR = new songObj();
      aR.init();
      aR.slides = new Array();
      var aN = N.data.length;
      for (var aQ = 0; aQ < aN; aQ++) {
        if (N.data[aQ].id == aS) {
          aR.name = N.data[aQ].name;
          aR.catIndex = N.data[aQ].cat;
          aR.font = N.data[aQ].font;
          aR.font2 = N.data[aQ].font2;
          aR.timestamp = N.data[aQ].timestamp;
          aR.yvideo = N.data[aQ].yvideo;
          aR.bkgnd_fname = N.data[aQ].bkgndfname;
          aR.key = N.data[aQ].key;
          aR.copyright = N.data[aQ].copy;
          aR.notes = N.data[aQ].notes;
          aR.slides = D(N.data[aQ].lyrics);
          var aO = N.data[aQ].lyrics2;
          if (aO != null) {
            aR.slides2 = D(aO);
          } else {
            aR.slides2 = new Array();
          }
          aR.slides2 = j(aR.slides, aR.slides2);
          aR.name2 = N.data[aQ].title2;
          aR.tags = N.data[aQ].tags;
          aR.slideseq = N.data[aQ].slideseq;
          aR.rating = N.data[aQ].rating;
          aR.chordsavailable = N.data[aQ].chordsavailable;
          aR.usagecount = N.data[aQ].usagecount;
          aR.subcat = N.data[aQ].subcat;
          aP = true;
          break;
        }
      }
      if (aP) {
        return aR;
      } else {
        return null;
      }
    }
    function H(aQ) {
      var aP = false;
      var aS = new songObj();
      aS.init();
      aS.slides = new Array();
      var aN = N.data.length;
      for (var aR = 0; aR < aN; aR++) {
        if (N.data[aR].name == aQ) {
          aS.name = N.data[aR].name;
          aS.catIndex = N.data[aR].cat;
          aS.font = N.data[aR].font;
          aS.font2 = N.data[aR].font2;
          aS.timestamp = N.data[aR].timestamp;
          aS.yvideo = N.data[aR].yvideo;
          aS.bkgnd_fname = N.data[aR].bkgndfname;
          aS.key = N.data[aR].key;
          aS.copyright = N.data[aR].copy;
          aS.notes = N.data[aR].notes;
          aS.slides = D(N.data[aR].lyrics);
          var aO = N.data[aR].lyrics2;
          if (aO != null) {
            aS.slides2 = D(aO);
          } else {
            aS.slides2 = new Array();
          }
          aS.slides2 = j(aS.slides, aS.slides2);
          aS.name2 = N.data[aR].title2;
          aS.tags = N.data[aR].tags;
          aS.slideseq = N.data[aR].slideseq;
          aS.rating = N.data[aR].rating;
          aS.chordsavailable = N.data[aR].chordsavailable;
          aS.usagecount = N.data[aR].usagecount;
          aS.subcat = N.data[aR].subcat;
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
    function q(aO, aP) {
      var aN = 0;
      if (!aP) {
        aN = N.data[aO].id;
      } else {
        aN = sqlRes.data[aO].id;
      }
      return aN;
    }
    function O(aO, aQ) {
      var aP = new songObj();
      aP.init();
      aP.slides = new Array();
      if (!aQ) {
        aP.name = N.data[aO].name;
        aP.catIndex = N.data[aO].cat;
        aP.font = N.data[aO].font;
        aP.font2 = N.data[aO].font2;
        aP.timestamp = N.data[aO].timestamp;
        aP.yvideo = N.data[aO].yvideo;
        aP.bkgnd_fname = N.data[aO].bkgndfname;
        aP.key = N.data[aO].key;
        aP.copyright = N.data[aO].copy;
        aP.notes = N.data[aO].notes;
        aP.slides = D(N.data[aO].lyrics);
        var aN = N.data[aO].lyrics2;
        if (aN != null) {
          aP.slides2 = D(aN);
        } else {
          aP.slides2 = new Array();
        }
        aP.slides2 = j(aP.slides, aP.slides2);
        aP.name2 = N.data[aO].title2;
        aP.tags = N.data[aO].tags;
        aP.slideseq = N.data[aO].slideseq;
        aP.rating = N.data[aO].rating;
        aP.chordsavailable = N.data[aO].chordsavailable;
        aP.usagecount = N.data[aO].usagecount;
        aP.subcat = N.data[aO].subcat;
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
    function A(aN) {
      ab = aN;
      __debug("In getSongsFromCat function " + aN);
      songNavObj.update_songList(N, aN);
    }
    function aK() {
      var aN = N.data.length;
      var aO = "";
      for (var aP = 0; aP < aN; aP++) {
        aO = aO + N.data[aP].name + "|" + N.data[aP].cat + "\n";
      }
      var aQ = "./song/songlist.txt";
      save2file(aO, aQ, false);
    }
    function c() {
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
    function aJ() {
      return ap;
    }
    function e() {
      var aN = new songImportClass();
      aN.init();
    }
    function i() {
      var aN = new songPortXML();
      aN.init(N, null, null, 1);
      aN.importXML();
    }
    function h() {
      var aN = new songPortXML();
      aN.init(N, null, null, 1);
      aN.exportAll();
    }
    function Y() {
      var aN = new songPortXML();
      aN.init(N, ab, null, 2);
      aN.exportByCat();
    }
    function o(aN) {
      var aO = aN.data.length;
      for (var aP = 0; aP < aO; aP++) {
        var aQ = V(aN.data[aP].name);
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
    function V(aO) {
      if (N.data != null) {
        var aN = N.data.length;
        for (var aP = 0; aP < aN; aP++) {
          if (N.data[aP].name == aO) {
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    }
    function ai(aP, aN) {
      if (N.data != null) {
        var aO = N.data.length;
        for (var aQ = 0; aQ < aO; aQ++) {
          var aS = N.data[aQ].name;
          var aR = N.data[aQ].cat;
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
      rvw.ui.Dialog.show(
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
      songDBVersion = vvConfigObj.get_songDBVersion();
      __debug("Song DB version " + songDBVersion);
      if (songDBVersion < 2) {
        aI("title2", "TEXT");
        aI("tags", "TEXT");
        aI("slideseq", "TEXT");
        aI("rating", "INTEGER");
        aI("chordsavailable", "Boolean");
        aI("usagecount", "INTEGER");
        aI("subcat", "TEXT");
        vvConfigObj.set_songDBVersion(2);
        songDBVersion = vvConfigObj.get_songDBVersion();
        vvConfigObj.save();
      }
      if (!isUpToDate() && task1Status() == false) {
        E();
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
            rvw.ui.Dialog.show(
              "Song Database",
              "Song Lyrics imported to the Song Database complete."
            );
            if (!isUpToDate()) {
              rvw.ui.Dialog.show("Songs", "Imported song database");
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
          songEditObj.setEditPrimaryKey(aT);
          C();
          F();
          at();
          if (aR) {
            rvw.ui.Dialog.show(
              "Song Database",
              "Song Lyrics imported to the Song Database"
            );
          } else {
            rvw.ui.Dialog.show(
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
        rvw.ui.Dialog.show(
          "ADD EDIT Song",
          "Failed to update song database.  Error message:" + aU.error.message
        );
        if (!isUpToDate() && T == 0) {
          var aT = vvConfigObj.get_songDBVersion();
          if (aT == 2) {
            vvConfigObj.set_songDBVersion(1);
            vvConfigObj.save();
            rvw.ui.Dialog.show(
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
        songNavObj.sn_backupGlobalID();
        C();
        F();
        at();
        rvw.ui.Dialog.show("Song Database", 'Song "' + m + '" updated.');
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
        N = aP.getResult();
        a();
        scheduleObj.init();
        songNavObj.update_songList(N, "_ALL");
      }
      function aN(aR) {
        __debug("Song Manager data error...");
      }
    }
    function aC(aQ) {
      __debug("Getting ALL Titles from Song DB");
      var aP = new air.SQLStatement();
      aP.sqlConnection = m_sqlConnection;
      var aR = "SELECT * FROM sm ORDER BY name ASC";
      aP.text = aR;
      aP.addEventListener(air.SQLEvent.RESULT, aO);
      aP.addEventListener(air.SQLErrorEvent.ERROR, aN);
      aP.execute();
      function aO(aS) {
        __debug("Succesfuly got all data from Song DB");
        aj = aP.getResult();
        songListRemote = songNavObj.get_songList(aj, "_ALL", aQ);
        $("#command18").trigger("click");
      }
      function aN(aS) {
        __debug("Song Manager data error...");
      }
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
        songNavObj.update_CategoryList(aq);
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
    function p(aP, aQ) {
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
          rvw.ui.Dialog.show("Song Tag Search", "No matching tag");
        } else {
          if (aP.length > 2) {
            wordbrain.findRecordBy_wordin(aP);
          }
          songNavObj.searchComplete(sqlRes, aQ);
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
    function E() {
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
          rvw.ui.Dialog.show("Songs", "Updated song database");
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
        rvw.ui.Dialog.show("Song Manager", "Song DB updater data error...");
      }
    }
    function ag() {
      var aO = N.data.length;
      var aP = new Array(0, 0);
      aP[0] = 0;
      aP[1] = 0;
      for (var aQ = 0; aQ < aO; aQ++) {
        var aR = N.data[aQ].subcat;
        var aN = N.data[aQ].cat;
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
      songNumberObj.setMaxMalayalam(aN[0]);
      songNumberObj.setMaxHindi(aN[1]);
    }
    function aB() {
      var aO = N.data.length;
      alert("Number of records..." + aO);
      var aQ = 0;
      var aP = N.data[aQ].id;
      var aN = N.data[aQ].cat;
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
        var aV = songNumberObj.assignSongNumber(aS);
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
            var a1 = N.data[aQ].id;
            var a0 = N.data[aQ].cat;
            aR(a1, a0);
          } else {
            alert("Song number update complete");
          }
        }
      }
    }
    function S() {
      var aO = N.data.length;
      var aQ = 0;
      var aP = N.data[aQ].id;
      var aN = N.data[aQ].cat;
      var aR = N.data[aQ].name.toLowerCase();
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
        var a1 = songNumberObj.assignSongNumber(aW, aV);
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
            var a3 = N.data[aQ].id;
            var a2 = N.data[aQ].cat;
            var a4 = N.data[aQ].name.toLowerCase();
            aS(a3, a2, a4);
          } else {
            alert("Song number update complete");
          }
        }
      }
    }
    function G() {
      var aS = testName.length;
      var aT = N.data.length;
      for (var aQ = 0; aQ < aS; aQ++) {
        var aO = testName[aQ].toLowerCase();
        aO = test2_updatedname(aO);
        var aR = false;
        for (var aN = 0; aN < aT; aN++) {
          var aP = N.data[aN].name;
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
    function B() {
      var aS = new Array();
      var aR = "";
      var aO = N.data.length;
      for (var aQ = 0; aQ < aO; aQ++) {
        var aN = N.data[aQ].cat;
        var aP = N.data[aQ].name;
        var aT = N.data[aQ].subcat;
        if (aN == "Malayalam 2020" || aN == "Hindi 2020") {
          aR = aN + "|" + aP + "|" + aT;
          aS.push(aR);
        }
      }
      return aS;
    }
    function w(aS) {
      var aO = N.data.length;
      __debug("record length " + aO);
      for (var aQ = 0; aQ < aO; aQ++) {
        var aN = N.data[aQ].cat;
        var aR = new songObj();
        if (aN == "Malayalam 2019") {
          aR = O(aQ, false);
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
            l(aR, aQ, N.data[aQ].id, false);
          } else {
            __debug("**** No Match **** : " + aR.name);
          }
        }
      }
    }
  }
}
