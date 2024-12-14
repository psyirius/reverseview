import {saveFileInAppStorage} from "@app/common";
import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";
import $ from "jquery";

export class StillBackground {
    constructor() {
        this.setNumOfPicsInRow = setNumOfPicsInRow;
        this.getBkgndFilename = getBkgndFilename;
        this.getLogoFilename = getLogoFilename;
        this.getMotionFlag = getMotionFlag;
        this.getShadeFlag = getShadeFlag;
        this.getTransparentFlag = getTransparentFlag;

        var v = 0;
        let _bgIndex = 0;
        var z = -1;
        var o = null;
        var _backgrounds = null;
        var selectBGFile = null;
        var numPicsPerRow = 4;
        var logoFile = "";
        var h = false;
        var S = false;
        var k = false;
        var g = false;
        const IS_DEBUG = false;

        setupState();
        setupEvents();

        function setupState() {
            __debug("Setting values...");
            _bgIndex = $RvW.vvConfigObj.get_bkgndIndex();
            z = -1;
            o = [];
            _backgrounds = [];
            selectBGFile = new air.File();
            b();
            S = false;
            document.getElementById("still_animate").checked = S;
            h = false;
            document.getElementById("randomBackgroundID").checked = h;
            let logoIndex = $RvW.vvConfigObj.get_logoFilename();
            if (isNaN(logoIndex)) {
                logoIndex = 0;
            }
            logoFile = `./background/thumbnail/${_backgrounds[logoIndex]}`;
        }

        function setupEvents() {
            __debug("Set events...");
            document
                .getElementById("setAsLogoButtonID")
                .addEventListener("click", setAsLogo, false);
            document
                .getElementById("setAsBackgroundButtonID")
                .addEventListener("click", setAsBackground, false);
            document
                .getElementById("addStillBkgndButtonID")
                .addEventListener("click", addStillBg, false);
            document
                .getElementById("delStillBkgndButton")
                .addEventListener("click", delStillBg, false);
            document
                .getElementById("still_animate")
                .addEventListener("change", still_animate, false);
            document
                .getElementById("randomBackgroundID")
                .addEventListener("change", randomBg, false);
            document
                .getElementById("shadedBackgroundID")
                .addEventListener("change", shadedBg, false);
            document
                .getElementById("transparentBackgroundID")
                .addEventListener("change", transparentBg, false);

            selectBGFile.addEventListener(air.Event.SELECT, onSelectBg);
        }

        function onSelectBg() {
            __debug("Process adding background");
            var ab = selectBGFile.nativePath;
            var Z = ab.split("\\");
            var V = Z[Z.length - 1];
            var X = true;
            var T = _backgrounds.length;
            for (var W = 0; W < T; W++) {
                if (_backgrounds[W] === V) {
                    X = false;
                }
            }
            if (X) {
                _backgrounds.push(V);
                o.push(V);
                var Y = e();
                __debug("Setting up storage file system");
                var aa = air.File.applicationStorageDirectory;
                __debug("Resolving path");
                aa = aa.resolvePath("background/" + V);
                __debug("About to copy to");
                selectBGFile.copyTo(aa, true);
                __debug("Copy to complete");
                var U = air.File.applicationStorageDirectory;
                U = U.resolvePath("background/thumbnail/" + V);
                selectBGFile.copyTo(U, true);
                var ac = "./xml/backgroundlist.xml";
                saveFileInAppStorage(Y, ac);
                q();
            } else {
                alert("Background already exists.");
            }
        }

        function setNumOfPicsInRow(U) {
            numPicsPerRow = parseInt((U - 100) / 100);
            __debug("Available width... " + U);
            __debug("Number of pics in a row... " + numPicsPerRow);
            __debug("Setting still_bkgnd_grid width to " + U);
            // $("#still_bkgnd_grid").width(U - 100);
        }
        function get_numPicsPerRow() {
            return numPicsPerRow;
        }
        function b() {
            __debug("Load background list...");
            let V;
            let U = null;
            const T = "./xml/backgroundlist.xml";
            V = air.File.applicationStorageDirectory;
            V = V.resolvePath(T);
            U = new XMLHttpRequest();
            U.onreadystatechange = function () {
                if (U.readyState === U.DONE) {
                    const X = U.responseXML.documentElement.getElementsByTagName("bkg");
                    for (let i = 0; i < X.length; i++) {
                        o[i] = X[i].getElementsByTagName("name")[0].textContent;
                        _backgrounds[i] = X[i].getElementsByTagName("filename")[0].textContent;
                    }
                    q();
                }
            };
            U.open("GET", V.url, true);
            U.send(null);
        }
        function addStillBg() {
            __debug("Show browser window...");
            const T = _backgrounds.length;
            __debug("Number of backgrounds: " + T);
            if (T < 50) {
                const filters = [
                    new air.FileFilter("JPEG", "*.jpg"),
                    new air.FileFilter("PNG", "*.png"),
                ];
                selectBGFile.browseForOpen("Select Background", filters);
            } else {
                alert(
                    "VerseVIEW supports a maximum of 50 backgrounds. Please delete backgrounds to add new ones."
                );
            }
        }
        function delStillBg() {
            __debug("Process deleting background...");
            const U = confirm("Are you sure you want to delete the selected Background?");
            if (!!U) {
                const W = v;
                if (_bgIndex === v) {
                    _bgIndex = 0;
                } else {
                    if (_bgIndex > v) {
                        _bgIndex--;
                    }
                }
                let X = $RvW.vvConfigObj.get_logoFilename();
                if (isNaN(X)) {
                    X = 0;
                }
                if (X === v) {
                    X = 0;
                } else {
                    if (X > v) {
                        X--;
                    }
                }
                $RvW.vvConfigObj.set_logoFilename(X);
                $RvW.vvConfigObj.save();
                _backgrounds.splice(W, 1);
                o.splice(W, 1);
                saveFileInAppStorage(e(), "./xml/backgroundlist.xml");
                $RvW.vvConfigObj.set_bkgndIndex(_bgIndex);
                $RvW.vvConfigObj.save();
                q();
            }
        }
        function s() {
            __debug("Process deleting background...");
            const V = confirm("Are you sure you want to delete the selected Background?");
            if (!!V) {
                const X = _bgIndex;
                const T = _backgrounds.length;
                if (X === T - 1) {
                    _bgIndex = 0;
                }
                _backgrounds.splice(X, 1);
                o.splice(X, 1);
                saveFileInAppStorage(e(), "./xml/backgroundlist.xml");
                $RvW.vvConfigObj.set_bkgndIndex(_bgIndex);
                $RvW.vvConfigObj.save();
                q();
            }
        }
        function still_animate() {
            S = document.getElementById("still_animate").checked;
        }
        function randomBg() {
            h = document.getElementById("randomBackgroundID").checked;
        }
        function shadedBg() {
            k = $("#shadedBackgroundID").prop("checked");
        }
        function transparentBg() {
            g = $("#transparentBackgroundID").prop("checked");
        }
        function getMotionFlag() {
            return S;
        }
        function getShadeFlag() {
            return k;
        }
        function getTransparentFlag() {
            return g;
        }
        function m() {
            __debug("Fill the bkgnd table...");
            const W = air.File.applicationStorageDirectory;
            let X = "./background/thumbnail/" + _backgrounds[_bgIndex];
            X = W.resolvePath(X);
            document.getElementById("selected_still_id").src = X.url;
            document.getElementById("selected_still_id").width = 100;
            document.getElementById("selected_still_id").height = 75;
            let T = $RvW.vvConfigObj.get_logoFilename();
            if (isNaN(T)) {
                T = 0;
            }
            logoFile = "./background/thumbnail/" + _backgrounds[T];
            X = W.resolvePath(logoFile);
            document.getElementById("selected_logostill_id").src = X.url;
            document.getElementById("selected_logostill_id").width = 100;
            document.getElementById("selected_logostill_id").height = 75;
            var ab = _backgrounds.length;
            var aa = get_numPicsPerRow();
            var U = parseInt(ab / aa);
            var Y = 0;
            var ac = "";
            var Z = "";
            var V = document.getElementById("list_still_bkgnd");
            V.innerHTML = "";
            __debug("Rows: " + U + " Columns: " + aa);
            for (let r = 0; r <= U; r++) {
                V.insertRow(r);
                for (let c = 0; c < aa; c++) {
                    Y = r * aa + c;
                    V.rows[r].insertCell(c);
                    if (Y < ab) {
                        Z = "img" + Y;
                        ac = "./background/thumbnail/" + _backgrounds[Y];
                        ac = W.resolvePath(ac);
                        V.rows[r].cells[c].innerHTML =
                            '<div align="center" id=' +
                            Z +
                            "> <br><img src=" +
                            ac.url +
                            " width=100 height=75> <br><br></div>";
                        V.rows[r].cells[c].addEventListener("mouseover", function () {
                            p(this);
                        });
                        V.rows[r].cells[c].addEventListener("mouseout", function () {
                            Q(this);
                        });
                        document.getElementById(Z).addEventListener("click", function (e) {
                            n(e);
                        });
                    }
                }
            }
        }
        function q() {
            __debug("Fill the bkgnd table...");
            var V = air.File.applicationStorageDirectory;
            var W = "./background/thumbnail/" + _backgrounds[_bgIndex];
            W = V.resolvePath(W);
            document.getElementById("selected_still_id").src = W.url;
            document.getElementById("selected_still_id").width = 150;
            document.getElementById("selected_still_id").height = 100;
            var T = $RvW.vvConfigObj.get_logoFilename();
            if (isNaN(T) || T === "") {
                T = 0;
            }
            logoFile = "./background/thumbnail/" + _backgrounds[T];
            W = V.resolvePath(logoFile);
            document.getElementById("selected_logostill_id").src = W.url;
            document.getElementById("selected_logostill_id").width = 150;
            document.getElementById("selected_logostill_id").height = 100;
            var ae = _backgrounds.length;
            var ad = get_numPicsPerRow();
            var U = parseInt(ae / ad);
            var Y = 0;
            var af = "";
            var Z = "";
            var X = document.getElementById("still_bkgnd_grid");
            // if (!X) return;
            X.innerHTML = "";
            for (var aa = 0; aa < ae; aa++) {
                var ac = $("<div class='unit'></div>");
                ac.appendTo(X);
                af = "./background/thumbnail/" + _backgrounds[aa];
                af = V.resolvePath(af);
                __debug(af.url);
                var ab = "<img src=" + af.url + " width=150 height=100>";
                ac.html(ab);
                ac.data("index", aa);
                ac.click(function () {
                    __debug("Handler for .click() called.");
                    var ah = document.getElementById("selectedx_still_id");
                    var ag = $(this).data("index");
                    var ai = "./background/thumbnail/" + _backgrounds[ag];
                    ai = V.resolvePath(ai);
                    ah.src = ai.url;
                    ah.width = 150;
                    ah.height = 100;
                    v = $(this).data("index");
                });
                ac.dblclick(function () {
                    __debug("Handler for .dblclick() called." + $(this).data("index"));
                    v = $(this).data("index");
                    setAsBackground();
                });
            }
        }
        function p(T) {
            T.style.background = "black";
        }
        function Q(T) {
            T.style.background = "#edf5ff";
        }
        function n(U) {
            __debug("clicked on an image....");
            var W = U.currentTarget.id;
            __debug("ID:...", W);
            document.getElementById(W).style.background = "gray";
            var V = W.split("img");
            var T = V[1];
            v = T;
            setTimeout(function () {
                document.getElementById(W).style.background = "#edf5ff";
            }, 2000);
        }
        function e() {
            var T = _backgrounds.length;
            var V = "<backgroundlist>\n";
            for (var U = 0; U < T; U++) {
                V = V + "  <bkg>\n";
                V = V + "    <name>" + o[U] + "</name>\n";
                V = V + "    <filename>" + _backgrounds[U] + "</filename>\n";
                V = V + "  </bkg>\n";
            }
            V = V + "</backgroundlist>\n";
            return V;
        }
        function getBkgndFilename() {
            var U = [];
            var T = _backgrounds.length;
            var W = "./background/" + _backgrounds[_bgIndex];
            U[0] = W;
            if (h) {
                var V = Math.floor(Math.random() * T);
                W = "./background/" + _backgrounds[V];
                U[0] = W;
            }
            return U;
        }
        function setAsBackground() {
            var T = air.File.applicationStorageDirectory;
            var U = "./background/thumbnail/" + _backgrounds[v];
            U = T.resolvePath(U);
            document.getElementById("selected_still_id").src = U.url;
            document.getElementById("selected_still_id").width = 150;
            document.getElementById("selected_still_id").height = 100;
            z = v;
            if (z !== -1) {
                _bgIndex = z;
                S = false;
                document.getElementById("still_animate").checked = S;
                h = false;
                document.getElementById("randomBackgroundID").checked = h;
                $RvW.vvConfigObj.set_bkgndIndex(_bgIndex);
                $RvW.vvConfigObj.save();
            } else {
            }
        }
        function setAsLogo() {
            logoFile = "";
            logoFile = "./background/" + _backgrounds[v];
            $RvW.vvConfigObj.set_logoFilename(v);
            $RvW.vvConfigObj.save();
            var T = air.File.applicationStorageDirectory;
            var U = "./background/thumbnail/" + _backgrounds[v];
            U = T.resolvePath(U);
            document.getElementById("selected_logostill_id").src = U.url;
            document.getElementById("selected_logostill_id").width = 150;
            document.getElementById("selected_logostill_id").height = 100;
        }
        function getLogoFilename() {
            var T = [];
            if (logoFile !== "" && a()) {
                T[0] = logoFile;
            } else {
                alert("Add and set LOGO file in the Graphics section");
                T[0] = "./background/" + _backgrounds[0];
            }
            return T;
        }
        function a() {
            return air.File.applicationStorageDirectory.resolvePath(logoFile).exists;
        }

        function __debug(...messages) {
            if (IS_DEBUG) {
                console.trace("[StillBackground]:", ...messages);
            }
        }
    }
}
