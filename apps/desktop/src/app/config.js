class RvwConfig {
    constructor() {
        let m_version1;
        let m_version2;
        let m_bkgndIndex;
        let m_topMargin;
        let m_bottomMargin;
        let m_leftMargin;
        let m_rightMargin;
        let m_singleVersion;
        let m_navduallang;
        let m_mainScreenEnable;
        let m_navFontSize;
        let m_screensel;
        let m_stagescreensel;
        let m_stageScreenEnable;
        let m_stagescreenstyle;
        let m_maxFontSize;
        let m_enableTransition;
        let m_enableShadow;
        let m_enableTitle;
        let m_textColor;
        let m_textColor2;
        let m_solidBkgndColor;
        let m_gradColor1;
        let m_gradColor2;
        let m_gradOrient;
        let m_motionBkgndIndex;
        let m_bkgndType;
        let m_textOrient;
        let m_justification;
        let m_version6;
        let m_songDBVersion;
        let m_bibleDBVersion;
        let m_chordsDBVersion;
        let m_versionNumber;
        let m_showdatetime;
        let m_showvvlogo;
        let m_showcustomlogo;
        let m_logotext1;
        let m_logotext2;
        let m_logoFilename;
        let m_songtextorient;
        let m_showprimaryfont;
        let m_svOpacity;
        let m_svHeight;
        let m_svFcolor;
        let m_svShowPrimary;
        let m_svShowSecondary;
        let m_svTextOutline;
        let m_svTextShadow;
        let m_svShowDate;
        let m_svMessage;
        let m_svWindow;
        let m_svGreenWindow;
        let m_svPosition;
        let m_svMaxFontSize;
        let m_svBcolor;
        let m_svAlignLeft;
        let m_svAlignCenter;
        let m_svAddTexture;
        let m_svShowHorizontal;
        let m_booknamestyle;
        let m_listinenglish;
        let m_presentationOnTop;
        let m_transparentEnable;
        let m_show2lines;
        let m_hideStanzaNumber;
        let m_p_format_multiplelines = true;
        let m_myhostname = "localhost";
        let m_taglist;
        let m_lastCheckForUpdateDate = null;

        let m_save_xyz_flag = true;
        let m_xv_interval = 1000;
        let m_saveCtr = 0;

        /*
        * Loads preferences from config.xml file.
        */
        this.load = function(callback, retry = 0) {
            const { File } = air;
            const { applicationStorageDirectory: appStorageDir } = File;

            _loadDefaults();

            // %APPDATA%\ReVerseVIEW\Local Store\xml\config.xml
            // it was copied there from app:/xml/config.xml
            const configPath = appStorageDir.resolvePath("xml/config.xml");

            $Y.io(configPath.url, {
                on: {
                    success: (x, o) => {
                        try {
                            const doc = $Y.XML.parse(o.responseText);
                            _loadFromDocument(doc);
                            (typeof callback === 'function') && callback();
                        } catch (e) {
                            if (retry < 2) {
                                this.save();
                                this.load(callback, retry + 1);
                            } else {
                                rvw.ui.Toast.show(
                                    "ReVerseVIEW",
                                    "Error parsing ReVerseVIEW config. Please restart VerseVIEW."
                                );
                            }
                        }
                    },
                    failure: (x, o) => {
                        rvw.ui.Toast.show(
                            "VerseVIEW",
                            "Error loading VerseVIEW database. Please restart VerseVIEW."
                        );
                    }
                }
            });
        }
        function _loadDefaults() {
            m_version1 = 1;
            m_version2 = 2;
            m_bkgndIndex = 0;
            m_topMargin = 50;
            m_bottomMargin = 50;
            m_leftMargin = 50;
            m_rightMargin = 50;
            m_singleVersion = false;
            m_navduallang = true;
            m_navFontSize = 14;
            m_mainScreenEnable = true;
            m_screensel = 0;
            m_stagescreensel = 0;
            m_stageScreenEnable = false;
            m_stagescreenstyle = 0;
            m_maxFontSize = 100;
            m_enableTransition = true;
            m_enableShadow = true;
            m_enableTitle = true;
            m_textColor = "#FFFFFF";
            m_textColor2 = "#FFFFFF";
            m_solidBkgndColor = "#000000";
            m_gradColor1 = "#000000";
            m_gradColor2 = "#FFFFFF";
            m_gradOrient = 0;
            m_motionBkgndIndex = 0;
            m_bkgndType = 1;
            m_textOrient = "0";
            m_justification = "center";
            m_version6 = 0;
            m_showdatetime = true;
            m_showvvlogo = true;
            m_showcustomlogo = false;
            m_logotext1 = "";
            m_logotext2 = "";
            m_logoFilename = "";
            m_songtextorient = "0";
            m_showprimaryfont = false;
            m_svOpacity = 0.3;
            m_svHeight = 20;
            m_svFcolor = 0;
            m_svWindow = true;
            m_svGreenWindow = true;
            m_svPosition = 0;
            m_svMaxFontSize = 30;
            m_svBcolor = 0;
            m_svShowPrimary = false;
            m_svShowSecondary = false;
            m_svTextOutline = true;
            m_svTextShadow = false;
            m_svShowDate = true;
            m_svMessage = "";
            m_svAlignLeft = false;
            m_svAlignCenter = false;
            m_svAddTexture = false;
            m_svShowHorizontal = false;
            m_songDBVersion = 2;
            m_bibleDBVersion = 2;
            m_chordsDBVersion = 2;
            m_versionNumber = 0;
            m_booknamestyle = 1;
            m_listinenglish = true;
            m_presentationOnTop = true;
            m_transparentEnable = false;
            m_show2lines = false;
            m_hideStanzaNumber = false;
            m_p_format_multiplelines = true;
            m_taglist = "";
            m_myhostname = "localhost";
            m_lastCheckForUpdateDate = null;
            m_save_xyz_flag = true;
            m_xv_interval = 1000;
            m_saveCtr = 0;
        }
        function _loadFromDocument(doc) {
            m_version1 = doc.getElementsByTagName("version1")[0].textContent;
            m_version2 = doc.getElementsByTagName("version2")[0].textContent;
            m_bkgndIndex = doc.getElementsByTagName("bkgndIndex")[0].textContent;
            m_topMargin = doc.getElementsByTagName("topMargin")[0].textContent;
            m_bottomMargin = doc.getElementsByTagName("bottomMargin")[0].textContent;
            m_leftMargin = doc.getElementsByTagName("leftMargin")[0].textContent;
            m_rightMargin = doc.getElementsByTagName("rightMargin")[0].textContent;
            m_singleVersion = _parse_bool_str(doc.getElementsByTagName("singleVersion")[0].textContent);
            m_navduallang = _parse_bool_str(doc.getElementsByTagName("navduallang")[0].textContent);
            m_navFontSize = doc.getElementsByTagName("navFontSize")[0].textContent;
            m_screensel = doc.getElementsByTagName("screensel")[0].textContent;
            m_stagescreensel = doc.getElementsByTagName("stagescreensel")[0];
            if (m_stagescreensel == null) {
                m_stagescreensel = 0;
            } else {
                m_stagescreensel = m_stagescreensel.textContent;
            }
            const stageScreenStyleValue = doc.getElementsByTagName("stagescreenstyle")[0];
            if (stageScreenStyleValue == null) {
                m_stagescreenstyle = 0;
            } else {
                m_stagescreenstyle = stageScreenStyleValue.textContent;
            }
            var aZ = doc.getElementsByTagName("mainScreenEnable")[0];
            if (aZ != null) {
                m_mainScreenEnable = _parse_bool_str(aZ.textContent);
            } else {
                m_mainScreenEnable = true;
            }
            var bj = doc.getElementsByTagName("stageScreenEnable")[0];
            if (bj != null) {
                m_stageScreenEnable = _parse_bool_str(bj.textContent);
            } else {
                m_stageScreenEnable = false;
            }
            var bg = doc.getElementsByTagName("maxFontSize")[0];
            if (bg != null) {
                m_maxFontSize = bg.textContent;
            }
            var aH = doc.getElementsByTagName("enableTransition")[0];
            if (aH != null) {
                m_enableTransition = _parse_bool_str(aH.textContent);
            } else {
                m_enableTransition = true;
            }
            var aU = doc.getElementsByTagName("enableShadow")[0];
            if (aU != null) {
                m_enableShadow = _parse_bool_str(aU.textContent);
            } else {
                m_enableShadow = true;
            }
            var a1 = doc.getElementsByTagName("enableTitle")[0];
            if (a1 != null) {
                m_enableTitle = _parse_bool_str(a1.textContent);
            } else {
                m_enableTitle = true;
            }
            var a5 = doc.getElementsByTagName("textColor")[0];
            if (a5 != null) {
                m_textColor = a5.textContent;
            } else {
                m_textColor = "FFFFFF";
            }
            var a5 = doc.getElementsByTagName("textColor2")[0];
            if (a5 != null) {
                m_textColor2 = a5.textContent;
            } else {
                m_textColor2 = "FFFFFF";
            }
            var aY = doc.getElementsByTagName("solidBkgndColor")[0];
            if (aY != null) {
                m_solidBkgndColor = aY.textContent;
            } else {
                m_solidBkgndColor = "000000";
            }
            var a7 = doc.getElementsByTagName("gradColor1")[0];
            if (a7 != null) {
                m_gradColor1 = a7.textContent;
            } else {
                m_gradColor1 = "000000";
            }
            var a9 = doc.getElementsByTagName("gradColor2")[0];
            if (a9 != null) {
                m_gradColor2 = a9.textContent;
            } else {
                m_gradColor2 = "FFFFFF";
            }
            var bd = doc.getElementsByTagName("gradOrient")[0];
            if (a9 != null) {
                m_gradOrient = bd.textContent;
            } else {
                m_gradOrient = 0;
            }
            var bf = doc.getElementsByTagName("motionBkgndIndex")[0];
            if (a9 != null) {
                m_motionBkgndIndex = bf.textContent;
            } else {
                m_motionBkgndIndex = 0;
            }
            var aQ = doc.getElementsByTagName("bkgndType")[0];
            if (a9 != null) {
                m_bkgndType = aQ.textContent;
            } else {
                m_bkgndType = 3;
            }
            var aS = doc.getElementsByTagName("textOrient")[0];
            if (a9 != null) {
                m_textOrient = aS.textContent;
            } else {
                m_textOrient = "0";
            }
            var aT = doc.getElementsByTagName("justification")[0];
            if (aT != null) {
                m_justification = aT.textContent;
            } else {
                m_justification = "center";
            }
            var aX = doc.getElementsByTagName("version6")[0];
            if (aX != null) {
                m_version6 = aX.textContent;
            } else {
                m_version6 = 0;
            }
            var aK = doc.getElementsByTagName("showdatetime")[0];
            if (aK != null) {
                if (aK.textContent == "false") {
                    m_showdatetime = false;
                } else {
                    m_showdatetime = true;
                }
            } else {
                m_showdatetime = true;
            }
            var ba = doc.getElementsByTagName("showvvlogo")[0];
            if (ba != null) {
                if (ba.textContent == "false") {
                    m_showvvlogo = false;
                } else {
                    m_showvvlogo = true;
                }
            } else {
                m_showvvlogo = true;
            }
            var aO = doc.getElementsByTagName("showcustomlogo")[0];
            if (aO != null) {
                if (aO.textContent == "false") {
                    m_showcustomlogo = false;
                } else {
                    m_showcustomlogo = true;
                }
            } else {
                m_showcustomlogo = true;
            }
            var bc = doc.getElementsByTagName("logotext1")[0];
            if (bc != null) {
                m_logotext1 = bc.textContent;
            } else {
                m_logotext1 = "";
            }
            var aW = doc.getElementsByTagName("logotext2")[0];
            if (aW != null) {
                m_logotext2 = aW.textContent;
            } else {
                m_logotext2 = "";
            }
            var aJ = doc.getElementsByTagName("logoFilename")[0];
            if (aJ != null) {
                m_logoFilename = aJ.textContent;
            } else {
                m_logoFilename = "";
            }
            var a6 = doc.getElementsByTagName("songtextorient")[0];
            if (a6 != null) {
                m_songtextorient = a6.textContent;
            } else {
                m_songtextorient = "0";
            }
            var aN = doc.getElementsByTagName("showprimaryfont")[0];
            if (aN != null) {
                m_showprimaryfont = aN.textContent;
            } else {
                m_showprimaryfont = false;
            }
            var a0 = doc.getElementsByTagName("svParameters")[0];
            if (a0 != null) {
                _loadSvParameters(a0.textContent);
            } else {
                m_svOpacity = 0.3;
                m_svHeight = 20;
                m_svFcolor = 0;
                m_svShowPrimary = false;
                m_svShowSecondary = false;
                m_svTextOutline = true;
                m_svTextShadow = false;
                m_svShowDate = true;
                m_svMessage = "";
                m_svWindow = false;
                m_svGreenWindow = true;
                m_svPosition = 0;
                m_svMaxFontSize = 30;
                m_svBcolor = 0;
                m_svAlignLeft = false;
                m_svAlignCenter = false;
                m_svAddTexture = false;
                m_svShowHorizontal = false;
            }
            var be = doc.getElementsByTagName("svMessage")[0];
            if (be != null) {
                m_svMessage = be.textContent;
            } else {
                m_svMessage = "";
            }
            var aL = doc.getElementsByTagName("songDBVersion")[0];
            if (aL != null) {
                m_songDBVersion = parseInt(aL.textContent);
            } else {
                m_songDBVersion = 1;
            }
            var bh = doc.getElementsByTagName("bibleDBVersion")[0];
            if (bh != null) {
                m_bibleDBVersion = parseInt(bh.textContent);
            } else {
                m_bibleDBVersion = 1;
            }
            var aV = doc.getElementsByTagName("chordsDBVersion")[0];
            if (aV != null) {
                m_chordsDBVersion = parseInt(aV.textContent);
            } else {
                m_chordsDBVersion = 1;
            }
            var aP = doc.getElementsByTagName("versionNumber")[0];
            if (aP != null) {
                m_versionNumber = parseInt(aP.textContent);
            } else {
                m_versionNumber = 0;
            }
            var a3 = doc.getElementsByTagName("booknamestyle")[0];
            if (a3 != null) {
                m_booknamestyle = parseInt(a3.textContent);
            } else {
                m_booknamestyle = 1;
            }
            var aM = doc.getElementsByTagName("listinenglish")[0];
            if (aM != null) {
                var a4 = aM.textContent;
                if (a4 == "true") {
                    m_listinenglish = true;
                } else {
                    m_listinenglish = false;
                }
            } else {
                m_listinenglish = true;
            }
            var bk = doc.getElementsByTagName("presentationOnTop")[0];
            if (bk != null) {
                var a8 = bk.textContent;
                if (a8 == "true") {
                    m_presentationOnTop = true;
                } else {
                    m_presentationOnTop = false;
                }
            } else {
                m_presentationOnTop = true;
            }
            var aR = doc.getElementsByTagName("transparentEnable")[0];
            if (aR != null) {
                var a8 = aR.textContent;
                if (a8 == "true") {
                    m_transparentEnable = true;
                } else {
                    m_transparentEnable = false;
                }
            } else {
                m_transparentEnable = false;
            }
            var bi = doc.getElementsByTagName("show2lines")[0];
            if (bi != null) {
                var a8 = bi.textContent;
                if (a8 == "true") {
                    m_show2lines = true;
                } else {
                    m_show2lines = false;
                }
            } else {
                m_show2lines = false;
            }
            var aI = doc.getElementsByTagName("hideStanzaNumber")[0];
            if (aI != null) {
                var a8 = aI.textContent;
                if (a8 == "true") {
                    m_hideStanzaNumber = true;
                } else {
                    m_hideStanzaNumber = false;
                }
            } else {
                m_hideStanzaNumber = false;
            }
            var bb = doc.getElementsByTagName("taglist")[0];
            if (bb != null) {
                m_taglist = bb.textContent;
            } else {
                m_taglist = "";
            }
            m_p_format_multiplelines = _parse_pref_fb(doc, "p_format_multiplelines", true);
            m_myhostname = _parse_pref_fb(doc, "myhostname", "localhost");
            m_lastCheckForUpdateDate = _parse_pref_fb(doc, "lastCheckForUpdateDate", null);
        }
        function _parse_pref_fb(m_elDoc, aH, aJ) {
            var aI = m_elDoc.getElementsByTagName(aH)[0];
            if (aI != null) {
                var aK = aI.textContent;
                if (aK == "true" || aK == "false") {
                    aK = _parse_bool_str(aK);
                }
                if (aK == "null") {
                    aK = aJ;
                }
                return aK;
            } else {
                return aJ;
            }
        }
        function _parse_bool_str(aH) {
            if (aH == "false") {
                return false;
            } else {
                return true;
            }
        }
        function _toXML() {
            let aH = '<?xml version="1.0" encoding="UTF-8"?>\n';
            aH += "<configuration>\n";
            aH += "  <version1>" + m_version1 + "</version1>\n";
            aH += "  <version2>" + m_version2 + "</version2>\n";
            aH += "  <bkgndIndex>" + m_bkgndIndex + "</bkgndIndex>\n";
            aH += "  <topMargin>" + m_topMargin + "</topMargin>\n";
            aH += "  <bottomMargin>" + m_bottomMargin + "</bottomMargin>\n";
            aH += "  <leftMargin>" + m_leftMargin + "</leftMargin>\n";
            aH += "  <rightMargin>" + m_rightMargin + "</rightMargin>\n";
            aH += "  <singleVersion>" + m_singleVersion + "</singleVersion>\n";
            aH += "  <navduallang>" + m_navduallang + "</navduallang>\n";
            aH += "  <navFontSize>" + m_navFontSize + "</navFontSize>\n";
            aH += "  <stageScreenEnable>" + m_stageScreenEnable + "</stageScreenEnable>\n";
            aH += "  <mainScreenEnable>" + m_mainScreenEnable + "</mainScreenEnable>\n";
            aH += "  <stagescreenstyle>" + m_stagescreenstyle + "</stagescreenstyle>\n";
            aH += "  <screensel>" + m_screensel + "</screensel>\n";
            aH += "  <stagescreensel>" + m_stagescreensel + "</stagescreensel>\n";
            aH += "  <maxFontSize>" + m_maxFontSize + "</maxFontSize>\n";
            aH += "  <enableTransition>" + m_enableTransition + "</enableTransition>\n";
            aH += "  <enableShadow>" + m_enableShadow + "</enableShadow>\n";
            aH += "  <enableTitle>" + m_enableTitle + "</enableTitle>\n";
            aH += "  <textColor>" + m_textColor + "</textColor>\n";
            aH += "  <textColor2>" + m_textColor2 + "</textColor2>\n";
            aH += "  <solidBkgndColor>" + m_solidBkgndColor + "</solidBkgndColor>\n";
            aH += "  <gradColor1>" + m_gradColor1 + "</gradColor1>\n";
            aH += "  <gradColor2>" + m_gradColor2 + "</gradColor2>\n";
            aH += "  <gradOrient>" + m_gradOrient + "</gradOrient>\n";
            aH += "  <motionBkgndIndex>" + m_motionBkgndIndex + "</motionBkgndIndex>\n";
            aH += "  <bkgndType>" + m_bkgndType + "</bkgndType>\n";
            aH += "  <textOrient>" + m_textOrient + "</textOrient>\n";
            aH += "  <justification>" + m_justification + "</justification>\n";
            aH += "  <version6>" + m_version6 + "</version6>\n";
            aH += "  <showdatetime>" + m_showdatetime + "</showdatetime>\n";
            aH += "  <showvvlogo>" + m_showvvlogo + "</showvvlogo>\n";
            aH += "  <showcustomlogo>" + m_showcustomlogo + "</showcustomlogo>\n";
            aH += "  <logotext1>" + m_logotext1 + "</logotext1>\n";
            aH += "  <logotext2>" + m_logotext2 + "</logotext2>\n";
            aH += "  <logoFilename>" + m_logoFilename + "</logoFilename>\n";
            aH += "  <songtextorient>" + m_songtextorient + "</songtextorient>\n";
            aH += "  <showprimaryfont>" + m_showprimaryfont + "</showprimaryfont>\n";
            aH += "  <svParameters>" + _toPipeString() + "</svParameters>\n";
            aH += "  <svMessage>" + m_svMessage + "</svMessage>\n";
            aH += "  <songDBVersion>" + m_songDBVersion + "</songDBVersion>\n";
            aH += "  <bibleDBVersion>" + m_bibleDBVersion + "</bibleDBVersion>\n";
            aH += "  <chordsDBVersion>" + m_chordsDBVersion + "</chordsDBVersion>\n";
            aH += "  <versionNumber>" + m_versionNumber + "</versionNumber>\n";
            aH += "  <booknamestyle>" + m_booknamestyle + "</booknamestyle>\n";
            aH += "  <listinenglish>" + m_listinenglish + "</listinenglish>\n";
            aH += "  <presentationOnTop>" + m_presentationOnTop + "</presentationOnTop>\n";
            aH += "  <transparentEnable>" + m_transparentEnable + "</transparentEnable>\n";
            aH += "  <show2lines>" + m_show2lines + "</show2lines>\n";
            aH += "  <hideStanzaNumber>" + m_hideStanzaNumber + "</hideStanzaNumber>\n";
            aH += "  <p_format_multiplelines>" + m_p_format_multiplelines + "</p_format_multiplelines>\n";
            aH += "  <taglist>" + m_taglist + "</taglist>\n";
            aH += "  <myhostname>" + m_myhostname + "</myhostname>\n";
            aH += "  <lastCheckForUpdateDate>" + m_lastCheckForUpdateDate + "</lastCheckForUpdateDate>\n";
            aH += "</configuration>\n";
            return aH;
        }

        this.save = function() {
            m_saveCtr++;
            if (m_save_xyz_flag) {
                m_save_xyz_flag = false;
                setTimeout(() => {
                    if (m_saveCtr > 0) {
                        _dumpXML();
                        m_saveCtr = 0;
                    }
                    m_save_xyz_flag = true;
                }, m_xv_interval);
                _dumpXML();
            }
        }

        function _dumpXML() {
            save2file(_toXML(), "./xml/config.xml", false);
            m_saveCtr--;
        }

        this.get_version1 = function () {
            return m_version1;
        };
        this.get_version2 = function () {
            return m_version2;
        };
        this.get_bkgndIndex = function () {
            return m_bkgndIndex;
        };
        this.get_p_topMargin = function () {
            return m_topMargin;
        };
        this.get_p_bottomMargin = function () {
            return m_bottomMargin;
        };
        this.get_p_leftMargin = function () {
            return m_leftMargin;
        };
        this.get_p_rightMargin = function () {
            return m_rightMargin;
        };
        this.get_singleVersion = function () {
            return m_singleVersion;
        };
        this.get_navDualLanguage = function () {
            return m_navduallang;
        };
        this.get_mainConfigEnable = function () {
            return m_mainScreenEnable;
        };
        this.get_navFontSize = function () {
            return m_navFontSize;
        };
        this.get_selectedScreenIndex = function () {
            return m_screensel;
        };
        this.get_selectedStageScreenIndex = function () {
            return m_stagescreensel;
        };
        this.get_stageConfigEnable = function () {
            return m_stageScreenEnable;
        };
        this.get_stageStyleVal = function () {
            return m_stagescreenstyle;
        };
        this.get_p_maxFontSize = function () {
            return m_maxFontSize;
        };
        this.get_p_enableTransition = function () {
            return m_enableTransition;
        };
        this.get_p_enableShadow = function () {
            return m_enableShadow;
        };
        this.get_p_showTitle = function () {
            return m_enableTitle;
        };
        this.get_p_textColor = function () {
            return m_textColor;
        };
        this.get_p_textColor2 = function () {
            return m_textColor2;
        };
        this.get_p_solidBkgndColor = function () {
            return m_solidBkgndColor;
        };
        this.get_p_bkgnd_color1 = function () {
            return m_gradColor1;
        };
        this.get_p_bkgnd_color2 = function () {
            return m_gradColor2;
        };
        this.get_p_bkgnd_grad_orient = function () {
            return m_gradOrient;
        };
        this.get_p_motion_bkgnd_index = function () {
            return m_motionBkgndIndex;
        };
        this.get_p_bkgnd_type = function () {
            return m_bkgndType;
        };
        this.get_p_text_orientation = function () {
            return m_textOrient;
        };
        this.get_p_align = function () {
            return m_justification;
        };
        this.get_version6 = function () {
            return m_version6;
        };
        this.get_showDateTime = function () {
            return m_showdatetime;
        };
        this.get_showVVLogo = function () {
            return m_showvvlogo;
        };
        this.get_showCustomLogo = function () {
            return m_showcustomlogo;
        };
        this.get_logoText1 = function () {
            return m_logotext1;
        };
        this.get_logoText2 = function () {
            return m_logotext2;
        };
        this.get_logoFilename = function () {
            return m_logoFilename;
        };
        this.get_song_text_orientation = function () {
            return m_songtextorient;
        };
        this.get_song_primaryOnly = function () {
            return m_showprimaryfont;
        };
        this.get_svOpacity = function () {
            return m_svOpacity;
        };
        this.get_svHeight = function () {
            return m_svHeight;
        };
        this.get_svWindow = function () {
            return m_svWindow;
        };
        this.get_svGreenWindow = function () {
            return m_svGreenWindow;
        };
        this.get_svPosition = function () {
            return m_svPosition;
        };
        this.get_svMaxFontSize = function () {
            return m_svMaxFontSize;
        };
        this.get_svBcolor = function () {
            return m_svBcolor;
        };
        this.get_svFcolor = function () {
            return m_svFcolor;
        };
        this.get_svShowPrimary = function () {
            return m_svShowPrimary;
        };
        this.get_svShowSecondary = function () {
            return m_svShowSecondary;
        };
        this.get_svTextOutline = function () {
            return m_svTextOutline;
        };
        this.get_svTextShadow = function () {
            return m_svTextShadow;
        };
        this.get_svShowDate = function () {
            return m_svShowDate;
        };
        this.get_svMessage = function () {
            return m_svMessage;
        };
        this.get_songDBVersion = function () {
            return m_songDBVersion;
        };
        this.get_bibleDBVersion = function () {
            return m_bibleDBVersion;
        };
        this.get_chordsDBVersion = function () {
            return m_chordsDBVersion;
        };
        this.get_versionNum = function () {
            return m_versionNumber;
        };
        this.get_booknamestyle = function () {
            return m_booknamestyle;
        };
        this.get_listinenglish = function () {
            return m_listinenglish;
        };
        this.get_presentationOnTop = function () {
            return m_presentationOnTop;
        };
        this.get_transparentEnable = function () {
            return m_transparentEnable;
        };
        this.get_show2lines = function () {
            return m_show2lines;
        };
        this.get_hideStanzaNumber = function () {
            return m_hideStanzaNumber;
        };
        this.get_svAlignLeft = function () {
            return m_svAlignLeft;
        };
        this.get_svAlignCenter = function () {
            return m_svAlignCenter;
        };
        this.get_svAddTexture = function () {
            return m_svAddTexture;
        };
        this.get_svShowHorizontal = function () {
            return m_svShowHorizontal;
        };
        this.get_taglist = function () {
            return m_taglist;
        };
        this.get_pformat_multiplelines = function () {
            return m_p_format_multiplelines;
        };
        this.get_myhostname = function () {
            return m_myhostname;
        };
        this.get_lastCheckForUpdateDate = function () {
            return m_lastCheckForUpdateDate;
        };
        this.set_version1 = function (aH) {
            m_version1 = aH;
            return true;
        };
        this.set_version2 = function (aH) {
            m_version2 = aH;
            return true;
        };
        this.set_bkgndIndex = function (aH) {
            m_bkgndIndex = aH;
            return true;
        };
        this.set_p_topMargin = function (aH) {
            m_topMargin = aH;
            return true;
        };
        this.set_p_bottomMargin = function (aH) {
            m_bottomMargin = aH;
            return true;
        };
        this.set_p_leftMargin = function (aH) {
            m_leftMargin = aH;
            return true;
        };
        this.set_p_rightMargin = function (aH) {
            m_rightMargin = aH;
            return true;
        };
        this.set_singleVersion = function (aH) {
            m_singleVersion = aH;
            return true;
        };
        this.set_navDualLanguage = function (aH) {
            m_navduallang = aH;
            return true;
        };
        this.set_mainConfigEnable = function (aH) {
            m_mainScreenEnable = aH;
            return true;
        };
        this.set_navFontSize = function (aH) {
            m_navFontSize = aH;
            return true;
        };
        this.set_selectedScreenIndex = function (aH) {
            m_screensel = aH;
            return true;
        };
        this.set_selectedStageScreenIndex = function (aH) {
            m_stagescreensel = aH;
            return true;
        };
        this.set_stageConfigEnable = function (aH) {
            m_stageScreenEnable = aH;
            return true;
        };
        this.set_stageStyleVal = function (aH) {
            m_stagescreenstyle = aH;
            return true;
        };
        this.set_p_maxFontSize = function (aH) {
            m_maxFontSize = aH;
            return true;
        };
        this.set_p_enableTransition = function (aH) {
            m_enableTransition = aH;
            return true;
        };
        this.set_p_enableShadow = function (aH) {
            m_enableShadow = aH;
            return true;
        };
        this.set_p_showTitle = function (aH) {
            m_enableTitle = aH;
            return true;
        };
        this.set_p_textColor = function (aH) {
            m_textColor = aH;
            return true;
        };
        this.set_p_textColor2 = function (aH) {
            m_textColor2 = aH;
            return true;
        };
        this.set_p_solidBkgndColor = function (aH) {
            m_solidBkgndColor = aH;
            return true;
        };
        this.set_p_bkgnd_color1 = function (aH) {
            m_gradColor1 = aH;
            return true;
        };
        this.set_p_bkgnd_color2 = function (aH) {
            m_gradColor2 = aH;
            return true;
        };
        this.set_p_bkgnd_grad_orient = function (aH) {
            m_gradOrient = aH;
            return true;
        };
        this.set_p_motion_bkgnd_index = function (aH) {
            m_motionBkgndIndex = aH;
            return true;
        };
        this.set_p_bkgnd_type = function (aH) {
            m_bkgndType = aH;
            return true;
        };
        this.set_p_text_orientation = function (aH) {
            m_textOrient = aH;
            return true;
        };
        this.set_p_align = function (aH) {
            m_justification = aH;
            return true;
        };
        this.set_version6 = function (aH) {
            m_version6 = aH;
            return true;
        };
        this.set_showDateTime = function (aH) {
            m_showdatetime = aH;
            return true;
        };
        this.set_showVVLogo = function (aH) {
            m_showvvlogo = aH;
            return true;
        };
        this.set_showCustomLogo = function (aH) {
            m_showcustomlogo = aH;
            return true;
        };
        this.set_logoText1 = function (aH) {
            m_logotext1 = aH;
            return true;
        };
        this.set_logoText2 = function (aH) {
            m_logotext2 = aH;
            return true;
        };
        this.set_logoFilename = function (aH) {
            m_logoFilename = aH;
            return true;
        };
        this.set_song_text_orientation = function (aH) {
            m_songtextorient = aH;
            return true;
        };
        this.set_song_primaryOnly = function (aH) {
            m_showprimaryfont = aH;
            return true;
        };
        this.set_svOpacity = function (aH) {
            m_svOpacity = aH;
            return true;
        };
        this.set_svHeight = function (aH) {
            m_svHeight = aH;
            return true;
        };
        this.set_svWindow = function (aH) {
            m_svWindow = aH;
            return true;
        };
        this.set_svGreenWindow = function (aH) {
            m_svGreenWindow = aH;
            return true;
        };
        this.set_svPosition = function (aH) {
            m_svPosition = aH;
            return true;
        };
        this.set_svMaxFontSize = function (aH) {
            m_svMaxFontSize = aH;
            return true;
        };
        this.set_svBcolor = function (aH) {
            m_svBcolor = aH;
            return true;
        };
        this.set_svFcolor = function (aH) {
            m_svFcolor = aH;
            return true;
        };
        this.set_svShowPrimary = function (aH) {
            m_svShowPrimary = aH;
            return true;
        };
        this.set_svShowSecondary = function (aH) {
            m_svShowSecondary = aH;
            return true;
        };
        this.set_svTextOutline = function (aH) {
            m_svTextOutline = aH;
            return true;
        };
        this.set_svTextShadow = function (aH) {
            m_svTextShadow = aH;
            return true;
        };
        this.set_svShowDate = function (aH) {
            m_svShowDate = aH;
            return true;
        };
        this.set_svMessage = function (aH) {
            m_svMessage = aH;
            return true;
        };
        this.set_songDBVersion = function (aH) {
            m_songDBVersion = aH;
            return true;
        };
        this.set_bibleDBVersion = function (aH) {
            m_bibleDBVersion = aH;
            return true;
        };
        this.set_chordsDBVersion = function (aH) {
            m_chordsDBVersion = aH;
            return true;
        };
        this.set_versionNum = function (aH) {
            m_versionNumber = aH;
            return true;
        };
        this.set_booknamestyle = function (aH) {
            m_booknamestyle = aH;
            return true;
        };
        this.set_listinenglish = function (aH) {
            m_listinenglish = aH;
            return true;
        };
        this.set_presentationOnTop = function (aH) {
            m_presentationOnTop = aH;
            return true;
        };
        this.set_transparentEnable = function (aH) {
            m_transparentEnable = aH;
            return true;
        };
        this.set_show2lines = function (aH) {
            m_show2lines = aH;
            return true;
        };
        this.set_hideStanzaNumber = function (aH) {
            m_hideStanzaNumber = aH;
            return true;
        };
        this.set_svAlignLeft = function (aH) {
            m_svAlignLeft = aH;
            return true;
        };
        this.set_svAlignCenter = function (aH) {
            m_svAlignCenter = aH;
            return true;
        };
        this.set_svAddTexture = function (aH) {
            m_svAddTexture = aH;
            return true;
        };
        this.set_svShowHorizontal = function (aH) {
            m_svShowHorizontal = aH;
            return true;
        };
        this.set_pformat_multiplelines = function (aH) {
            m_p_format_multiplelines = aH;
            return true;
        };
        this.set_myhostname = function (aH) {
            m_myhostname = aH;
            return true;
        };
        this.set_lastCheckForUpdateDate = function (aH) {
            m_lastCheckForUpdateDate = aH;
            return true;
        };
        this.set_taglist = function (aH) {
            m_taglist = aH;
            return true;
        };

        function _toPipeString() {
            let aH = "";
            aH = aH + m_svOpacity + "|" + m_svHeight + "|" + m_svShowPrimary + "|" + m_svTextOutline + "|" + m_svShowDate + "|" + m_svFcolor;
            aH = aH + "|" + m_svWindow + "|" + m_svPosition + "|" + m_svMaxFontSize + "|" + m_svBcolor;
            aH = aH + "|" + m_svGreenWindow + "|" + m_svTextShadow;
            aH = aH + "|" + m_svAlignLeft + "|" + m_svAlignCenter + "|" + m_svAddTexture + "|" + m_svShowHorizontal;
            aH = aH + "|" + m_svShowSecondary;
            return aH;
        }

        function _loadSvParameters(ps) {
            const aI = ps.split("|");
            m_svOpacity = aI[0];
            m_svHeight = aI[1];
            m_svShowPrimary = aI[2];
            m_svTextOutline = aI[3];
            m_svShowDate = aI[4];
            m_svFcolor = aI[5];
            if (aI[6] == null) {
                aI[6] = false;
            }
            if (aI[7] == null) {
                aI[7] = 0;
            }
            if (aI[8] == null) {
                aI[8] = 30;
            }
            if (aI[9] == null) {
                aI[9] = 0;
            }
            if (aI[10] == null) {
                aI[10] = true;
            }
            if (aI[11] == null) {
                aI[11] = false;
            }
            if (aI[12] == null) {
                aI[12] = false;
            }
            if (aI[13] == null) {
                aI[13] = false;
            }
            if (aI[14] == null) {
                aI[14] = false;
            }
            if (aI[15] == null) {
                aI[15] = false;
            }
            if (aI[16] == null) {
                aI[16] = false;
            }
            m_svWindow = aI[6];
            m_svPosition = aI[7];
            m_svMaxFontSize = aI[8];
            m_svBcolor = aI[9];
            m_svGreenWindow = aI[10];
            m_svTextShadow = aI[11];
            m_svAlignLeft = aI[12];
            m_svAlignCenter = aI[13];
            m_svAddTexture = aI[14];
            m_svShowHorizontal = aI[15];
            m_svShowSecondary = aI[16];
        }
    }
}

function showLogoChangeEvent() {
    const a = document.getElementById("presentConfigShowCustomLogo").checked;
    if (a) {
        document.getElementById("presentConfigShowVVLogo").checked = false;
    }
}
function stageEnableChangeEvent() {
    const a = $("#stageConfigEnable").is(":checked");
    $RvW.vvConfigObj.set_stageConfigEnable(a);
    $RvW.vvConfigObj.save();
}
function mainEnableChangeEvent() {
    const a = $("#mainConfigEnable").is(":checked");
    $RvW.vvConfigObj.set_mainConfigEnable(a);
    $RvW.vvConfigObj.save();
}
function svParameterSaveEvent() {
    var e = $("#thirdview_opacity").val();
    var g = $("#thirdview_height").val();
    var l = $("#thirdview_fcolor").val();
    var f = $("#thirdview_primary").is(":checked");
    var q = $("#thirdview_secondary").is(":checked");
    var k = $("#stageviewWindow").is(":checked");
    var m = $("#stageviewGreenWindow").is(":checked");
    var j = $("#thirdview_position").val();
    var p = $("#thirdview_maxFontSize").val();
    var d = $("#thirdview_bcolor").val();
    var c = $("#thirdview_outline").is(":checked");
    var b = $("#thirdview_shadow").is(":checked");
    var a = $("#stageSettingShowTime").is(":checked");
    var o = $("#thirdview_alignLeft").is(":checked");
    var n = $("#thirdview_alignCenter").is(":checked");
    var i = $("#thirdview_showTexture").is(":checked");
    var h = $("#thirdview_alignHorizontal").is(":checked");
    $RvW.vvConfigObj.set_svOpacity(e);
    $RvW.vvConfigObj.set_svHeight(g);
    $RvW.vvConfigObj.set_svFcolor(l);
    $RvW.vvConfigObj.set_svShowPrimary(f);
    $RvW.vvConfigObj.set_svShowSecondary(q);
    $RvW.vvConfigObj.set_svWindow(k);
    $RvW.vvConfigObj.set_svGreenWindow(m);
    $RvW.vvConfigObj.set_svPosition(j);
    $RvW.vvConfigObj.set_svMaxFontSize(p);
    $RvW.vvConfigObj.set_svBcolor(d);
    $RvW.vvConfigObj.set_svTextOutline(c);
    $RvW.vvConfigObj.set_svTextShadow(b);
    $RvW.vvConfigObj.set_svAlignLeft(o);
    $RvW.vvConfigObj.set_svAlignCenter(n);
    $RvW.vvConfigObj.set_svAddTexture(i);
    $RvW.vvConfigObj.set_svShowHorizontal(h);
    $RvW.vvConfigObj.set_svShowDate(a);
    $RvW.vvConfigObj.save();
}
function svPassMessage() {
    var a = $("#stageConfigMessage").val();
    if ($RvW.newStageWindow != null) {
        $RvW.newStageWindow.window.postMessage(a);
    }
}
function svClearMessage() {
    var a = "";
    if ($RvW.newStageWindow != null) {
        $RvW.newStageWindow.window.postMessage(a);
    }
}
function stageStyleChangeEvent() {
    air.trace("stage Style change.. ");
    var a = $("#selectStageStyle").val();
    setupStageViewOptions();
    $RvW.vvConfigObj.set_stageStyleVal(a);
    $RvW.vvConfigObj.save();
}
function setupStageViewOptions() {
    $("#stageviewOpacityDiv").hide();
    $("#stageviewHeightDiv").hide();
    $("#stageviewPrimaryDiv").show();
    $("#stageviewSecondaryDiv").hide();
    $("#stageviewOutlineDiv").hide();
    $("#stageviewTimeDiv").hide();
    $("#stageMessageDivID").hide();
    $("#stageviewAlignCenterDiv").hide();
    $("#stageviewShowTextureDiv").hide();
    $("#stageviewAlignHorizontalDiv").hide();
    $("#stageviewBackgroundColorDiv").hide();
    $("#stageviewPositionDiv").hide();
    switch ($("#selectStageStyle").val()) {
        case "0":
        case "1":
        default:
            $("#stageviewTimeDiv").show();
            $("#stageMessageDivID").show();
            break;
        case "3":
            $("#stageviewOpacityDiv").show();
            $("#stageviewHeightDiv").show();
            $("#stageviewOutlineDiv").show();
            $("#stageviewAsWindowDiv").show();
            $("#stageviewBackgroundColorDiv").show();
            $("#stageviewAlignCenterDiv").show();
            $("#stageviewSecondaryDiv").show();
            $("#stageviewAlignHorizontalDiv").show();
            break;
    }
}
function stageShowTimeChangeEvent() {}

function configInit() {
    document
        .getElementById("navDualLanguageID")
        .addEventListener("click", $RvW.updateVerseContainer);
    document
        .getElementById("singleVersionBoxID")
        .addEventListener("click", processSingleVersion);
    document
        .getElementById("presentConfigSaveButton")
        .addEventListener("click", savePresentationMargin);
    document
        .getElementById("presentConfigShowVVLogo")
        .addEventListener("change", showLogoChangeEvent);
    document
        .getElementById("presentConfigShowCustomLogo")
        .addEventListener("change", showLogoChangeEvent);
    $("#mainConfigEnable").change(mainEnableChangeEvent);
    $("#stageConfigEnable").change(stageEnableChangeEvent);
    $("#selectStageStyle").change(stageStyleChangeEvent);
    $("#stageSettingShowTime").change(stageShowTimeChangeEvent);
    document.getElementById("presentConfigMarginTop").value =
        $RvW.vvConfigObj.get_p_topMargin();
    document.getElementById("presentConfigMarginBottom").value =
        $RvW.vvConfigObj.get_p_bottomMargin();
    document.getElementById("presentConfigMarginLeft").value =
        $RvW.vvConfigObj.get_p_leftMargin();
    document.getElementById("presentConfigMarginRight").value =
        $RvW.vvConfigObj.get_p_rightMargin();
    document.getElementById("presentConfigMaxFontSize").value =
        $RvW.vvConfigObj.get_p_maxFontSize();
    document.getElementById("stageConfigEnable").checked = !!$RvW.vvConfigObj.get_stageConfigEnable();
    document.getElementById("mainConfigEnable").checked = !!$RvW.vvConfigObj.get_mainConfigEnable();
    if ($RvW.vvConfigObj.get_stageStyleVal() != null) {
        $("#selectStageStyle").val($RvW.vvConfigObj.get_stageStyleVal());
    } else {
        $("#selectStageStyle").val(0);
    }
    setupStageViewOptions();
    document.getElementById("presentConfigEnableTransition").checked = !!$RvW.vvConfigObj.get_p_enableTransition();
    document.getElementById("presentConfigOntop").checked = !!$RvW.vvConfigObj.get_presentationOnTop();
    document.getElementById("presentConfigEnableSongTitle").checked = !!$RvW.vvConfigObj.get_p_showTitle();
    document.getElementById("presentConfigEnableShadow").checked = !!$RvW.vvConfigObj.get_p_enableShadow();
    if ($RvW.vvConfigObj.get_singleVersion()) {
        document.getElementById("singleVersionBoxID").checked = true;
        document.getElementById("version2Menu").disabled = true;
    }
    document.getElementById("navDualLanguageID").checked = !!$RvW.vvConfigObj.get_navDualLanguage();
    const a = $RvW.vvConfigObj.get_p_align();
    document.getElementById("justify_left").checked = false;
    document.getElementById("justify_center").checked = false;
    document.getElementById("justify_right").checked = false;
    if (a === "left") {
        document.getElementById("justify_left").checked = true;
    }
    if (a === "center") {
        document.getElementById("justify_center").checked = true;
    }
    if (a === "right") {
        document.getElementById("justify_right").checked = true;
    }
    const j = $RvW.vvConfigObj.get_p_text_orientation();
    document.getElementById("porient_hori").checked = false;
    document.getElementById("porient_vert").checked = false;
    if (j === 0) {
        document.getElementById("porient_hori").checked = true;
    }
    if (j === 1) {
        document.getElementById("porient_vert").checked = true;
    }
    const f = $RvW.vvConfigObj.get_song_text_orientation();
    document.getElementById("porient_song_hori").checked = false;
    document.getElementById("porient_song_vert").checked = false;
    if (f === 0) {
        document.getElementById("porient_song_hori").checked = true;
    }
    if (f === 1) {
        document.getElementById("porient_song_vert").checked = true;
    }
    const h = $RvW.vvConfigObj.get_song_primaryOnly();
    document.getElementById("showPrimaryFont").checked = h == "true";
    document.getElementById("show2LinesSlides").checked = !!$RvW.vvConfigObj.get_show2lines();
    document.getElementById("hideStanzaNumber").checked = !!$RvW.vvConfigObj.get_hideStanzaNumber();
    document.getElementById("fitLineSetup").checked = $RvW.vvConfigObj.get_pformat_multiplelines();
    var d = $RvW.vvConfigObj.get_logoText1();
    document.getElementById("customLogoText1").value = d;
    var c = $RvW.vvConfigObj.get_logoText2();
    document.getElementById("customLogoText2").value = c;
    var k = $RvW.vvConfigObj.get_showDateTime();
    var g = $RvW.vvConfigObj.get_showVVLogo();
    var b = $RvW.vvConfigObj.get_showCustomLogo();

    document.getElementById("presentConfigShowDateTime").checked = k === true;
    document.getElementById("presentConfigShowVVLogo").checked = !!g;
    document.getElementById("presentConfigShowCustomLogo").checked = !!b;

    $RvW.remoteVV_UI_Obj.configure();

    {
        fillScreenList('selectScreenID', $RvW.rvwPreferences.get("app.settings.screen.main.index", 0));
        fillScreenList('selectStageScreenID', $RvW.rvwPreferences.get("app.settings.screen.stage.index", 0));
        addScreenSelectionEvent();
    }

    // Refreshes the screens list on clicking the select menus
    {
        document.getElementById("refresh-screens-main").addEventListener('click', function () {
            fillScreenList('selectScreenID', $RvW.rvwPreferences.get("app.settings.screen.main.index", 0));
        });
        document.getElementById("refresh-screens-stage").addEventListener('click', function () {
            fillScreenList('selectStageScreenID', $RvW.rvwPreferences.get("app.settings.screen.stage.index", 0));
        });
    }

    const e = new fontSizeSlider();
    e.init();

    const i = new vvupdate();
    i.init();

    document.getElementById("thirdview_opacity").value =
        $RvW.vvConfigObj.get_svOpacity();
    document.getElementById("thirdview_height").value =
        $RvW.vvConfigObj.get_svHeight();
    document.getElementById("thirdview_fcolor").value =
        $RvW.vvConfigObj.get_svFcolor();
    document.getElementById("thirdview_position").value =
        $RvW.vvConfigObj.get_svPosition();
    document.getElementById("thirdview_maxFontSize").value =
        $RvW.vvConfigObj.get_svMaxFontSize();
    document.getElementById("thirdview_bcolor").value =
        $RvW.vvConfigObj.get_svBcolor();
    document.getElementById("thirdview_primary").checked =
        $RvW.vvConfigObj.get_svShowPrimary();
    document.getElementById("thirdview_secondary").checked =
        $RvW.vvConfigObj.get_svShowSecondary();
    document.getElementById("stageSettingShowTime").checked =
        $RvW.vvConfigObj.get_svShowDate();
    document.getElementById("stageConfigMessage").value =
        $RvW.vvConfigObj.get_svMessage();

    $("#thirdview_opacity").change(svParameterSaveEvent);
    $("#thirdview_height").change(svParameterSaveEvent);
    $("#thirdview_fcolor").change(svParameterSaveEvent);

    $("#thirdview_primary").change(function () {
        if (!$RvW.vvConfigObj.get_svShowPrimary()) {
            document.getElementById("thirdview_secondary").checked = false;
        }
        svParameterSaveEvent();
    });

    $("#thirdview_secondary").change(function () {
        if (!$RvW.vvConfigObj.get_svShowSecondary()) {
            document.getElementById("thirdview_primary").checked = false;
        }
        svParameterSaveEvent();
    });

    $("#stageviewWindow").change(svParameterSaveEvent);
    $("#stageviewGreenWindow").change(svParameterSaveEvent);
    $("#thirdview_position").change(svParameterSaveEvent);
    $("#thirdview_maxFontSize").change(svParameterSaveEvent);
    $("#thirdview_bcolor").change(svParameterSaveEvent);
    $("#thirdview_shadow").change(svParameterSaveEvent);
    $("#thirdview_outline").change(svParameterSaveEvent);
    $("#stageSettingShowTime").change(svParameterSaveEvent);
    $("#stageMessageShow").click(svPassMessage);
    $("#stageMessageHide").click(svClearMessage);
    $("#thirdview_alignLeft").change(svParameterSaveEvent);
    $("#thirdview_alignCenter").change(svParameterSaveEvent);
    $("#thirdview_showTexture").change(svParameterSaveEvent);
    $("#thirdview_alignHorizontal").change(svParameterSaveEvent);

    getTags2Array();
    fillTagList();
}
