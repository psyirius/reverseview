class ChordsNav {
    constructor(bodyContent) {
        this.showChordsPanelForSong = showChordsPanelForSong;
        this.setSongValues = setSongValues;

        var p = [];
        var ak = "The chords provided within this application are for general information and education purposes only. Chords provided in this application may not reflect the same way as played in the original recording. <br>";
        var f = "";
        var O = "";
        var o = "";
        var m = null;
        var d = null;
        var m_version_value = 1;
        var n = 1;
        var W;
        var S;
        var R;
        var m_body = bodyContent;
        var _panel = null;
        var m_visible = false;
        var m_el_name;
        var m_el_author;
        var m_el_key;
        var m_el_majorminor;
        var m_el_time_signature;
        var m_el_bpm;
        var m_el_id;
        var m_el_versions;
        var m_el_notes;
        var m_el_complexity;
        var m_el_rhythm;
        var m_el_disclaimer;
        var m_el_piano;
        var m_el_guitar;
        var m_el_new;
        var m_el_edit;
        var m_el_delete;
        var m_el_close;

        const m_isDebug = true;

        init();

        function init() {
            __debug("Initialize Chords Panel");
            _setupUI();

            $RvW.chordsImportExportObj = new chordsImporExportClass();
            $RvW.chordsManagerObj = new chordsManagerClass();
            $RvW.chordsManagerObj.init();

            m_el_name = $("#ch_name");
            m_el_author = $("#ch_author");
            m_el_key = $("#ch_key");
            m_el_majorminor = $("#ch_majorminor");
            m_el_time_signature = $("#ch_signature");
            m_el_bpm = $("#ch_tempo");
            m_el_id = $("#chordsId");
            m_el_versions = $("#ch_versions");
            m_el_notes = $("#ch_notes");
            m_el_disclaimer = $("#ch_disclaimer");
            m_el_complexity = $("#ch_complexity");
            m_el_rhythm = $("#ch_rhythm");
            m_el_piano = $("#ch_piano");
            m_el_guitar = $("#ch_guitar");
            m_el_new = $("#ch_new");
            m_el_edit = $("#ch_edit");
            m_el_delete = $("#ch_delete");
            m_el_close = $("#ch_cancel");

            m = null;
            d = null;

            _setupEvents();
        }
        function _setupUI() {
            __debug("Generating Chords Panel");
            _panel = new YAHOO.widget.Panel("chordsPanelObj", {
                width: "1000px",
                fixedcenter: true,
                modal: true,
                visible: false,
                close: false,
                constraintoviewport: true,
            });
            _panel.render(document.body);
            _panel.setHeader("CHORDS");
            _panel.setBody(m_body);
            _panel.hide();

            // TODO: impl alternative
            $(".menu .item").tab();
        }
        function _setupEvents() {
            __debug("Setting Events for Chords");
            m_el_key.on("change", _onKeyChange);
            m_el_versions.on("change", function () {
                m_version_value = m_el_versions.val();
                showChordsPanelForSong(m_el_name.val(), "", d, m_version_value);
            });
            m_el_new.on("click", function () {
                $RvW.chordsKeyboard.clearRecent();
                _createNew();
            });
            m_el_edit.on("click", function () {
                $RvW.chordsKeyboard.clearRecent();
                _editChords();
            });
            m_el_delete.on("click", function () {
                _onDeleteChords();
            });
            m_el_close.on("click", function () {
                $RvW.chordsKeyboard.clearRecent();
                _closeIt();
            });
        }
        function _createNew() {
            $RvW.chordsEditObj.configureChordsEdit(false);
            $RvW.chordsEditObj.setSongValues(R, W, S);
            $RvW.chordsEditObj.setActiveData(m, d, parseInt(n) + 1);
            $RvW.chordsEditObj.showEditChordsPanel();
        }
        function _editChords() {
            __debug("Edit chords...");
            $RvW.chordsEditObj.configureChordsEdit(true);
            $RvW.chordsEditObj.setSongValues(R, W, S);
            $RvW.chordsEditObj.setActiveData(m, d, parseInt(m_version_value) + 0);
            $RvW.chordsEditObj.showEditChordsPanel();
        }
        function _onDeleteChords() {
            rvw.ui.Prompt.exec("Chords", "Are you sure you want to delete this version?", () => _deleteChords.apply(this));
        }
        function _deleteChords() {
            __debug("Delete chords...");
            var ap = $RvW.chordsManagerObj.getChordsByTitle(m_el_name.val());
            if (ap.length == 0) {
                __debug("No chords...");
            } else {
                __debug("About to delete version : " + m_version_value);
                __debug("Original " + ap[m_version_value - 1].original);
                __debug("About to delete...ID " + ap[m_version_value - 1].id);
                var ar = ap[m_version_value - 1].original;
                if (!ar) {
                    var aq = ap[m_version_value - 1].id;
                    $RvW.chordsManagerObj.deleteChords(aq);
                } else {
                    rvw.ui.Toast.show("Chords", "Can not be deleted..");
                }
            }
        }
        function _closeIt() {
            __debug("Close chords...");
            _uiClose();
        }
        function __uiShow() {
            _panel.show();
            m_visible = true;
        }
        function _uiClose() {
            _panel.hide();
            m_visible = false;
        }
        function setSongValues(ar, aq, ap) {
            __debug("Song title coming to navigation: " + ar);
            R = ar;
            W = aq;
            S = ap;
        }
        function showChordsPanelForSong(at, aq, ap, au) {
            air.trace("Show Chords Panel for Song: " + at);

            if (!m_visible) {
                if (at == null) {
                } else {
                    const ar = $RvW.chordsManagerObj.getChordsByTitle(at);
                    if (ar.length === 0) {
                        __debug("No chords...");
                    }
                    m_version_value = 1;
                    L(ar, ap, true);
                }
            } else {
                const ar = $RvW.chordsManagerObj.getChordsByTitle(m_el_name.val());
                if (ar.length === 0) {
                    __debug("No chords...");
                }
                if (au == null) {
                    m_version_value = 1;
                } else {
                    m_version_value = au;
                }
                L(ar, d, false);
            }
        }
        function c() {
            m_el_name.val("");
            m_el_author.val("");
            m_el_complexity.html("");
            m_el_rhythm.val("");
            m_el_key.val("C");
            m_el_majorminor.html("Major");
            m_el_time_signature.val("");
            m_el_bpm.val("");
            m_el_id.html("");
            m_el_versions.val(m_version_value);
            m_el_notes.val("");
            m_el_piano.html("");
            m_el_guitar.html("");
        }
        function L(ar, aq, ap) {
            if (ar.length === 0) {
                __debug("populatePanel : No chords...");
                c();
                Z("Major");
                an(true);
                m_el_id.html("No Chords are available");
                m_el_name.val(R);
                m_el_versions.html(z(1));
                m_el_majorminor.hide();
                m = null;
                d = null;
            } else {
                n = ar.length;
                m_el_versions.html(z(ar.length));
                c();
                __debug("About to populate the panel with active record...");
                A(ar[m_version_value - 1], aq);
            }
            if (ap) {
                __uiShow();
            }
        }
        function A(at, ar) {
            m = at;
            an(at.original);
            m_el_name.val(at.title);
            m_el_author.val(at.chordsby);
            m_el_majorminor.hide();
            if (at.key !== "") {
                let ap = at.key;
                let au = at.key;
                ap = ap[at.key.length - 1];
                if (ap === "m") {
                    Z("minor");
                    au = au.slice(0, -1);
                } else {
                    Z("Major");
                }
                m_el_key.val(au);
                o = au;
            } else {
                o = "C";
            }
            f = at.chords;
            if (at.lyrics === "") {
                O = ar;
            } else {
                O = at.lyrics;
            }
            d = O.split("<slide>");
            if (at.complexity == null) {
                m_el_complexity.hide();
            } else {
                let aq;
                switch (at.complexity) {
                    case "0":
                        aq = "Beginner";
                        break;
                    case "1":
                        aq = "Intermediate";
                        break;
                    case "2":
                        aq = "Advanced";
                        break;
                    default:
                        aq = "Beginner";
                }
                m_el_complexity.html(aq);
                m_el_complexity.show();
            }
            m_el_time_signature.val(at.timesignature);
            m_el_bpm.val(at.bpm);
            m_el_rhythm.val(at.rhythm);
            m_el_notes.val(at.notes);
            _onKeyChange();
        }
        function _onKeyChange() {
            const ap = m_el_key.val();
            const new_chords = w(f, o, ap);
            m_el_id.html(P(new_chords, O));
            m_el_disclaimer.html(ak);
            ag();
            J();
        }
        function P(au, at) {
            var ax = "";
            var aE = at.replace(/<BR>/g, "<br>");
            var az = aE.split("<slide>");
            var aq = au.split("<slide>");
            var aC = az.length;
            for (var aD = 0; aD < aC; aD++) {
                var aw = az[aD].split("<br>");
                var ay = aw.length;
                var ap = [""];
                if (aq[aD] != null) {
                    ap = aq[aD].split("<br>");
                }
                for (var aB = 0; aB < ay; aB++) {
                    var av = ap[aB].split("|");
                    var ar = av.length;
                    if (ar == 1) {
                        ax = ax + al(ap[aB], aw[aB]) + "<br>";
                    } else {
                        for (var aA = 0; aA < ar; aA++) {
                            ax = ax + al(av[aA], aw[aB]) + "<br>";
                        }
                    }
                }
                ax += "<br>";
            }
            return ax;
        }
        function al(aA, at) {
            var aE = "";
            var aA = aA.replace(/\xa0/g, " ");
            var aC = aA.split("");
            var aB = aC.length;
            var av = 0;
            var aD = new Array();
            var aG = new Array();
            var ax = "";
            var aw = 0;
            for (var aF = 0; aF < aB; aF++) {
                var ap = aC[av].charCodeAt(0);
                switch (ap) {
                    case 160:
                        if (ax != "") {
                            aG.push(ax);
                            var au = ax.length;
                            aD.push(av - au);
                        }
                        av++;
                        ax = "";
                        break;
                    case 32:
                        if (ax != "") {
                            aG.push(ax);
                            var au = ax.length;
                            aD.push(av - au);
                        }
                        av++;
                        ax = "";
                        break;
                    case 47:
                        if (ax != "") {
                            aG.push(ax + "/");
                            var au = ax.length + 1;
                            aD.push(av - au + 1);
                        }
                        av++;
                        ax = "";
                        break;
                    case 124:
                        ax += "|";
                        aG.push(ax);
                        var au = ax.length;
                        aD.push(av - 0);
                        av++;
                        ax = "";
                        break;
                    case 67:
                        ax += "C";
                        av++;
                        break;
                    case 68:
                        ax += "D";
                        av++;
                        break;
                    case 69:
                        ax += "E";
                        av++;
                        break;
                    case 70:
                        ax += "F";
                        av++;
                        break;
                    case 71:
                        ax += "G";
                        av++;
                        break;
                    case 65:
                        ax += "A";
                        av++;
                        break;
                    case 66:
                        ax += "B";
                        av++;
                        break;
                    case 109:
                        ax += "m";
                        av++;
                        break;
                    case 98:
                        ax += "b";
                        av++;
                        break;
                    case 35:
                        ax += "#";
                        av++;
                        break;
                    case 100:
                        ax += "d";
                        av++;
                        break;
                    case 105:
                        ax += "i";
                        av++;
                        break;
                    case 50:
                        ax += "2";
                        av++;
                        break;
                    case 52:
                        ax += "4";
                        av++;
                        break;
                    case 55:
                        ax += "7";
                        av++;
                        break;
                    case 57:
                        ax += "9";
                        av++;
                        break;
                    case 115:
                        ax += "s";
                        av++;
                        break;
                    case 117:
                        ax += "u";
                        av++;
                        break;
                    default:
                        rvw.ui.Toast.show(
                            "Chords",
                            'Invalid Chord: "' + aC[av]
                        );
                        aC[av] = " ";
                        av++;
                }
            }
            if (ax != "") {
                aG.push(ax);
                var au = ax.length;
                aD.push(av - au);
            }
            var ar = aG.length;
            var aH = new Array();
            var az = null;
            var aF = 0;
            var aI = 0;
            aE += "<div>";
            if (aD[aF] != 0) {
                az = at.substring(0, aD[aF]);
                aE += ae("", az);
            }
            for (var ay = aF; ay < ar; ay++) {
                aI = aF + 1;
                var aq = 0;
                if (aI >= ar) {
                    aq = at.length;
                } else {
                    aq = aD[aI];
                }
                az = at.substring(aD[aF], aq);
                aE += ae(aG[aF], az);
                aF++;
            }
            aE += "</div><br>";
            return aE;
        }
        function ae(aq, ap) {
            var ar = "";
            var ap = ap.replace(/ /g, "&nbsp;");
            ar =
                ar +
                '<div class="chunk">  <span class="chordsedit_chords">' +
                aq +
                '</span><br><span class="lyric">' +
                ap +
                "</span> </div>";
            return ar;
        }
        function w(aC, aP, aD) {
            var aI = "";
            p = new Array();
            var aq = aC.split("<slide>");
            var aF = aq.length;
            for (var aB = 0; aB < aF; aB++) {
                var aE = aq[aB].split("<BR>");
                var aL = aE.length;
                if (aL == 1) {
                    aE = aq[aB].split("<br>");
                    aL = aE.length;
                }
                for (var az = 0; az < aL; az++) {
                    var aM = aE[az].length;
                    var av = 0;
                    var aG = new Array();
                    var aK = new Array();
                    var aA = "";
                    var ax = 0;
                    while (av < aM) {
                        var ap = aE[az][av].charCodeAt(0);
                        switch (ap) {
                            case 160:
                                if (aA != "") {
                                    aK.push(aA);
                                    var at = aA.length;
                                    aG.push(av - at);
                                }
                                av++;
                                aA = "";
                                break;
                            case 32:
                                if (aA != "") {
                                    aK.push(aA);
                                    var at = aA.length;
                                    aG.push(av - at);
                                }
                                av++;
                                aA = "";
                                break;
                            case 47:
                                if (aA != "") {
                                    aK.push(aA + "/");
                                    var at = aA.length + 1;
                                    aG.push(av - at);
                                }
                                av++;
                                aA = "";
                                break;
                            case 124:
                                aA += "|";
                                aK.push(aA);
                                var at = aA.length;
                                aG.push(av - 0);
                                av++;
                                aA = "";
                                break;
                            case 67:
                                aA += "C";
                                av++;
                                break;
                            case 68:
                                aA += "D";
                                av++;
                                break;
                            case 69:
                                aA += "E";
                                av++;
                                break;
                            case 70:
                                aA += "F";
                                av++;
                                break;
                            case 71:
                                aA += "G";
                                av++;
                                break;
                            case 65:
                                aA += "A";
                                av++;
                                break;
                            case 66:
                                aA += "B";
                                av++;
                                break;
                            case 109:
                                aA += "m";
                                av++;
                                break;
                            case 98:
                                aA += "b";
                                av++;
                                break;
                            case 35:
                                aA += "#";
                                av++;
                                break;
                            case 100:
                                aA += "d";
                                av++;
                                break;
                            case 105:
                                aA += "i";
                                av++;
                                break;
                            case 50:
                                aA += "2";
                                av++;
                                break;
                            case 52:
                                aA += "4";
                                av++;
                                break;
                            case 55:
                                aA += "7";
                                av++;
                                break;
                            case 57:
                                aA += "9";
                                av++;
                                break;
                            case 115:
                                aA += "s";
                                av++;
                                break;
                            case 117:
                                aA += "u";
                                av++;
                                break;
                            default:
                                rvw.ui.Toast.show(
                                    "Chords",
                                    'Invalid Chord: "' + aE[az][av]
                                );
                                av++;
                        }
                    }
                    if (aA != "") {
                        aK.push(aA);
                        var at = aA.length;
                        aG.push(av - at);
                    }
                    var aO = new Array();
                    for (var ay = 0; ay < aM + 5; ay++) {
                        aO.push("\xa0");
                    }
                    for (var aJ = 0; aJ < aK.length; aJ++) {
                        var au = aG[aJ];
                        var aw = aK[aJ];
                        if (aw != "|") {
                            aw = r(aw);
                            aw = ac(aw, aP, aD);
                            aw = r(aw);
                            M(aw);
                            var ar = aw.split("");
                            for (var aH = 0; aH < ar.length; aH++) {
                                aO[au] = ar[aH];
                                au++;
                            }
                        } else {
                            aO[au] = "|";
                        }
                    }
                    var aN = "";
                    for (var aJ = 0; aJ < aO.length; aJ++) {
                        aN += aO[aJ];
                    }
                    aI += aN + "<br>";
                }
                aI += "<slide>";
            }
            return aI;
        }
        function M(aq) {
            var ar = aq;
            ar = ar.replace("/", "");
            var ap = p.indexOf(ar);
            if (ap == -1) {
                p.push(ar);
            }
        }
        function Z(ar) {
            var aq = new Array(
                "C",
                "C#",
                "Db",
                "D",
                "D#",
                "Eb",
                "E",
                "F",
                "F#",
                "Gb",
                "G",
                "G#",
                "Ab",
                "A",
                "A#",
                "Bb",
                "B"
            );
            clearSelectList("ch_key");
            var ap = aq.length;
            for (var at = 0; at < ap; at++) {
                var au = aq[at] + " " + ar;
                $("#ch_key").append(
                    '<option value="' + aq[at] + '" >' + au + "</option>"
                );
            }
        }
        function D(av) {
            var au = av.split("<slide>");
            var at = au[0].split("<br>");
            var ar = at[0].split("");
            var ax = ar.length;
            var aq = 0;
            var aw = 0;
            for (var ap = 0; ap < ax; ap++) {
                if (ar[ap].charCodeAt(0) != 32 && ar[ap].charCodeAt(0) != 160) {
                    if ($.isNumeric(ar[ap])) {
                        aq++;
                    } else {
                        aw++;
                    }
                }
            }
            if (aq > aw) {
                return true;
            } else {
                return false;
            }
        }
        function aa(ap) {
            var aw = "";
            var ar = ap.split("<slide>");
            var aB = ar.length;
            for (var aC = 0; aC < aB; aC++) {
                var au = ar[aC].split("<BR>");
                var ax = au.length;
                if (ax == 1) {
                    au = ar[aC].split("<br>");
                    ax = au.length;
                }
                for (var aA = 0; aA < ax; aA++) {
                    var av = au[aA].length;
                    var at = new Array();
                    for (var az = 0; az < av; az++) {
                        var aq = au[aA][az].charCodeAt(0);
                        switch (aq) {
                            case 160:
                                at.push("\xa0");
                                break;
                            case 32:
                                at.push("\xa0");
                                break;
                            case 49:
                                at.push("C");
                                break;
                            case 50:
                                at.push("Dm");
                                break;
                            case 51:
                                at.push("Em");
                                break;
                            case 52:
                                at.push("F");
                                break;
                            case 53:
                                at.push("G");
                                break;
                            case 54:
                                at.push("Am");
                                break;
                            case 55:
                                at.push("Bdim");
                                break;
                            case 77:
                                at.push("m");
                                break;
                        }
                    }
                    var ay = "";
                    for (var az = 0; az < av; az++) {
                        ay += at[az];
                    }
                    aw += ay + "<br>";
                }
                aw += "<slide>";
            }
            return aw;
        }
        function ac(au, ar, ap) {
            // TODO: find a better way to import teoria
            var aq = teoria.interval(teoria.note(ar), teoria.note(ap));
            var at;
            try {
                at = teoria.chord(au);
            } catch (av) {
                return " ";
            }
            var aw = at.interval(aq);
            return aw.toString();
        }
        function J() {
            var aq = p.length;
            var aw = "";
            var ax = "";
            var av = 0;
            for (var ap = 0; ap < aq; ap++) {
                var ar = 0;
                var au = true;
                ar = p[ap].search(/sus4/i);
                if (ar > -1) {
                    au = false;
                }
                ar = p[ap].search(/dim/i);
                if (ar > -1) {
                    au = false;
                }
                ar = p[ap].search(/m7/i);
                if (ar > -1) {
                    au = false;
                }
                if (au) {
                    aw += '<div class="row">';
                    aw += '<div class="col-33">' + p[ap] + "</div>";
                    var at = p[ap].replace("#", "sharp");
                    at = at.replace("sus", "");
                    ax = at.toLowerCase() + ".jpg";
                    aw +=
                        '<div class="col-66"><img src="./graphics/chords/guitar/' +
                        ax +
                        '" width=100 height=90 class="imgGuitar"></div>';
                    aw += "</div>";
                }
            }
            m_el_guitar.html(aw);
        }
        function ag() {
            var aq = p.length;
            var aw = "";
            var ax = "";
            var av = 0;
            for (var ap = 0; ap < aq; ap++) {
                var ar = 0;
                var au = true;
                ar = p[ap].search(/sus4/i);
                if (ar > -1) {
                    au = false;
                }
                ar = p[ap].search(/dim/i);
                if (ar > -1) {
                    au = false;
                }
                ar = p[ap].search(/m7/i);
                if (ar > -1) {
                    au = false;
                }
                if (au) {
                    aw += '<div class="row">';
                    aw += '<div class="col-33">' + p[ap] + "</div>";
                    var at = p[ap].replace("#", "sharp");
                    at = at.replace("sus", "");
                    ax = at.toLowerCase() + ".jpg";
                    aw +=
                        '<div class="col-66"><img src="./graphics/chords/piano/' +
                        ax +
                        '" width=200 height=50 class="imgGuitar"></div>';
                    aw += "</div>";
                }
            }
            m_el_piano.html(aw);
        }
        function r(ap) {
            var aq;
            aq = ap;
            aq = aq.replace("Cb", "B");
            aq = aq.replace("Fb", "E");
            aq = aq.replace("E#", "F");
            aq = aq.replace("B#", "C");
            aq = aq.replace("D#", "Eb");
            aq = aq.replace("A#", "Bb");
            aq = aq.replace("Cx", "D");
            aq = aq.replace("Dx", "E");
            aq = aq.replace("Ex", "F#");
            aq = aq.replace("Fx", "G");
            aq = aq.replace("Gx", "A");
            aq = aq.replace("Ax", "B");
            aq = aq.replace("Bx", "C#");
            aq = aq.replace("Bbb", "A");
            aq = aq.replace("Ebb", "D");
            return aq;
        }
        function ao(ap) {
            var aq = false;
            if (ap.indexOf("#") >= 0) {
                aq = true;
            }
            return aq;
        }
        function z(ap) {
            var ar = "";
            for (var aq = 1; aq <= ap; aq++) {
                ar = ar + "<option value=" + aq + ">Version " + aq + "</option>";
            }
            return ar;
        }
        function an(ap) {
            if (ap) {
                m_el_edit.hide();
            } else {
                m_el_edit.show();
            }
        }
        function __debug(ap) {
            if (m_isDebug) {
                air.trace("[Chords Navigation]...." + ap);
            }
        }
    }
}
