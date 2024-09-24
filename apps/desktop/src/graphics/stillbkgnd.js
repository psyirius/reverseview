import {save2file} from "@app/common";
import {$RvW} from "@/rvw";

import $ from "jquery";

export class StillBackground {
    constructor() {
        this.init = init;
        this.setNumOfPicsInRow = setNumOfPicsInRow;
        this.getBkgndFilename = getBkgndFilename;
        this.getLogoFilename = getLogoFilename;
        this.getMotionFlag = getMotionFlag;
        this.getShadeFlag = getShadeFlag;
        this.getTransparentFlag = getTransparentFlag;

        var d = null;
        var v = 0;
        var G = 0;
        var z = -1;
        var o = null;
        var E = null;
        var A = null;
        var J = 4;
        var w = "";
        var h = false;
        var S = false;
        var k = false;
        var g = false;
        var y = false;

        function init() {
            H();
            i();
        }
        function H() {
            B("Setting values...");
            G = $RvW.vvConfigObj.get_bkgndIndex();
            z = -1;
            o = new Array();
            E = new Array();
            A = new air.File();
            b();
            S = false;
            document.getElementById("still_animate").checked = S;
            h = false;
            document.getElementById("randomBackgroundID").checked = h;
            var T = $RvW.vvConfigObj.get_logoFilename();
            if (isNaN(T)) {
                T = 0;
            }
            w = "./background/thumbnail/" + E[T];
        }
        function i() {
            B("Set events...");
            document
                .getElementById("setAsLogoButtonID")
                .addEventListener("click", M, false);
            document
                .getElementById("setAsBackgroundButtonID")
                .addEventListener("click", F, false);
            document
                .getElementById("addStillBkgndButtonID")
                .addEventListener("click", l, false);
            document
                .getElementById("delStillBkgndButton")
                .addEventListener("click", K, false);
            document
                .getElementById("still_animate")
                .addEventListener("change", I, false);
            document
                .getElementById("randomBackgroundID")
                .addEventListener("change", P, false);
            document
                .getElementById("shadedBackgroundID")
                .addEventListener("change", u, false);
            document
                .getElementById("transparentBackgroundID")
                .addEventListener("change", N, false);
            A.addEventListener(air.Event.SELECT, t);
        }
        function t() {
            B("Process adding background");
            var ab = A.nativePath;
            var Z = ab.split("\\");
            var V = Z[Z.length - 1];
            var X = true;
            var T = E.length;
            for (var W = 0; W < T; W++) {
                if (E[W] == V) {
                    X = false;
                }
            }
            if (X) {
                E.push(V);
                o.push(V);
                var Y = e();
                B("Setting up storage file system");
                var aa = air.File.applicationStorageDirectory;
                B("Resolving path");
                aa = aa.resolvePath("background/" + V);
                B("About to copy to");
                A.copyTo(aa, true);
                B("Copy to complete");
                var U = air.File.applicationStorageDirectory;
                U = U.resolvePath("background/thumbnail/" + V);
                A.copyTo(U, true);
                var ac = "./xml/backgroundlist.xml";
                save2file(Y, ac, false);
                q();
            } else {
                alert("Background already exists.");
            }
        }
        function setNumOfPicsInRow(U) {
            var T = parseInt((U - 100) / 100);
            J = T;
            B("Available width... " + U);
            B("Number of pics in a row... " + J);
            B("Setting still_bkgnd_grid width to " + U);
            $("#still_bkgnd_grid").width(U - 100);
        }
        function D() {
            return J;
        }
        function b() {
            B("Load background list...");
            var V = null;
            var U = null;
            var T = "./xml/backgroundlist.xml";
            V = air.File.applicationStorageDirectory;
            V = V.resolvePath(T);
            U = new XMLHttpRequest();
            U.onreadystatechange = function () {
                if (U.readyState == 4) {
                    var X = U.responseXML.documentElement.getElementsByTagName("bkg");
                    for (var W = 0; W < X.length; W++) {
                        o[W] = X[W].getElementsByTagName("name")[0].textContent;
                        E[W] = X[W].getElementsByTagName("filename")[0].textContent;
                    }
                    q();
                }
            };
            U.open("GET", V.url, true);
            U.send(null);
        }
        function l() {
            B("Show browser window...");
            var T = E.length;
            B("Number of backgrounds: " + T);
            if (T < 50) {
                var U = new window.runtime.Array();
                U.push(new air.FileFilter("VerseVIEW Background", "*.jpg"));
                A.browseForOpen("Select Background", U);
            } else {
                alert(
                    "VerseVIEW supports a maximum of 50 backgrounds. Please delete backgrounds to add new ones."
                );
            }
        }
        function K() {
            B("Process deleting background...");
            var U = confirm("Are you sure you want to delete the selected Background?");
            if (U == true) {
                var W = v;
                if (G == v) {
                    G = 0;
                } else {
                    if (G > v) {
                        G--;
                    }
                }
                var X = $RvW.vvConfigObj.get_logoFilename();
                if (isNaN(X)) {
                    X = 0;
                }
                if (X == v) {
                    X = 0;
                } else {
                    if (X > v) {
                        X--;
                    }
                }
                $RvW.vvConfigObj.set_logoFilename(X);
                $RvW.vvConfigObj.save();
                E.splice(W, 1);
                o.splice(W, 1);
                var T = e();
                var V = "./xml/backgroundlist.xml";
                save2file(T, V, false);
                $RvW.vvConfigObj.set_bkgndIndex(G);
                $RvW.vvConfigObj.save();
                q();
            }
        }
        function s() {
            B("Process deleting background...");
            var V = confirm("Are you sure you want to delete the selected Background?");
            if (V == true) {
                var X = G;
                var T = E.length;
                if (X == T - 1) {
                    G = 0;
                }
                E.splice(X, 1);
                o.splice(X, 1);
                var U = e();
                var W = "./xml/backgroundlist.xml";
                save2file(U, W, false);
                $RvW.vvConfigObj.set_bkgndIndex(G);
                $RvW.vvConfigObj.save();
                q();
            }
        }
        function I() {
            S = document.getElementById("still_animate").checked;
        }
        function P() {
            h = document.getElementById("randomBackgroundID").checked;
        }
        function u() {
            k = $("#shadedBackgroundID").prop("checked");
        }
        function N() {
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
            B("Fill the bkgnd table...");
            var W = air.File.applicationStorageDirectory;
            var X = "./background/thumbnail/" + E[G];
            X = W.resolvePath(X);
            document.getElementById("selected_still_id").src = X.url;
            document.getElementById("selected_still_id").width = 100;
            document.getElementById("selected_still_id").height = 75;
            var T = $RvW.vvConfigObj.get_logoFilename();
            if (isNaN(T)) {
                T = 0;
            }
            w = "./background/thumbnail/" + E[T];
            X = W.resolvePath(w);
            document.getElementById("selected_logostill_id").src = X.url;
            document.getElementById("selected_logostill_id").width = 100;
            document.getElementById("selected_logostill_id").height = 75;
            var ab = E.length;
            var aa = D();
            var U = parseInt(ab / aa);
            var Y = 0;
            var ac = "";
            var Z = "";
            var V = document.getElementById("list_still_bkgnd");
            V.innerHTML = "";
            B("Rows: " + U + " Columns: " + aa);
            for (r = 0; r <= U; r++) {
                V.insertRow(r);
                for (c = 0; c < aa; c++) {
                    Y = r * aa + c;
                    V.rows[r].insertCell(c);
                    if (Y < ab) {
                        Z = "img" + Y;
                        ac = "./background/thumbnail/" + E[Y];
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
                        document.getElementById(Z).addEventListener("click", function () {
                            n(event);
                        });
                    }
                }
            }
        }
        function q() {
            B("Fill the bkgnd table...");
            var V = air.File.applicationStorageDirectory;
            var W = "./background/thumbnail/" + E[G];
            W = V.resolvePath(W);
            document.getElementById("selected_still_id").src = W.url;
            document.getElementById("selected_still_id").width = 150;
            document.getElementById("selected_still_id").height = 100;
            var T = $RvW.vvConfigObj.get_logoFilename();
            if (isNaN(T) || T == "") {
                T = 0;
            }
            w = "./background/thumbnail/" + E[T];
            W = V.resolvePath(w);
            document.getElementById("selected_logostill_id").src = W.url;
            document.getElementById("selected_logostill_id").width = 150;
            document.getElementById("selected_logostill_id").height = 100;
            var ae = E.length;
            var ad = D();
            var U = parseInt(ae / ad);
            var Y = 0;
            var af = "";
            var Z = "";
            var X = document.getElementById("still_bkgnd_grid");
            X.innerHTML = "";
            for (var aa = 0; aa < ae; aa++) {
                var ac = $("<div class='unit'></div>");
                ac.appendTo(X);
                af = "./background/thumbnail/" + E[aa];
                af = V.resolvePath(af);
                B(af.url);
                var ab = "<img src=" + af.url + " width=150 height=100>";
                ac.html(ab);
                ac.data("index", aa);
                ac.click(function () {
                    B("Handler for .click() called.");
                    var ah = document.getElementById("selectedx_still_id");
                    var ag = $(this).data("index");
                    var ai = "./background/thumbnail/" + E[ag];
                    ai = V.resolvePath(ai);
                    ah.src = ai.url;
                    ah.width = 150;
                    ah.height = 100;
                    v = $(this).data("index");
                });
                ac.dblclick(function () {
                    B("Handler for .dblclick() called." + $(this).data("index"));
                    v = $(this).data("index");
                    F();
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
            B("clicked on an image....");
            var W = U.currentTarget.id;
            B("ID:...", W);
            document.getElementById(W).style.background = "gray";
            var V = W.split("img");
            var T = V[1];
            v = T;
            setTimeout(function () {
                document.getElementById(W).style.background = "#edf5ff";
            }, 2000);
        }
        function e() {
            var T = E.length;
            var V = "<backgroundlist>\n";
            for (var U = 0; U < T; U++) {
                V = V + "  <bkg>\n";
                V = V + "    <name>" + o[U] + "</name>\n";
                V = V + "    <filename>" + E[U] + "</filename>\n";
                V = V + "  </bkg>\n";
            }
            V = V + "</backgroundlist>\n";
            return V;
        }
        function getBkgndFilename() {
            var U = new Array();
            var T = E.length;
            var W = "./background/" + E[G];
            U[0] = W;
            if (h) {
                var V = Math.floor(Math.random() * T);
                W = "./background/" + E[V];
                U[0] = W;
            }
            return U;
        }
        function F() {
            var T = air.File.applicationStorageDirectory;
            var U = "./background/thumbnail/" + E[v];
            U = T.resolvePath(U);
            document.getElementById("selected_still_id").src = U.url;
            document.getElementById("selected_still_id").width = 150;
            document.getElementById("selected_still_id").height = 100;
            z = v;
            if (z != -1) {
                G = z;
                S = false;
                document.getElementById("still_animate").checked = S;
                h = false;
                document.getElementById("randomBackgroundID").checked = h;
                $RvW.vvConfigObj.set_bkgndIndex(G);
                $RvW.vvConfigObj.save();
            } else {
            }
        }
        function M() {
            w = "";
            w = "./background/" + E[v];
            $RvW.vvConfigObj.set_logoFilename(v);
            $RvW.vvConfigObj.save();
            var T = air.File.applicationStorageDirectory;
            var U = "./background/thumbnail/" + E[v];
            U = T.resolvePath(U);
            document.getElementById("selected_logostill_id").src = U.url;
            document.getElementById("selected_logostill_id").width = 150;
            document.getElementById("selected_logostill_id").height = 100;
        }
        function getLogoFilename() {
            var T = new Array();
            if (w != "" && a()) {
                T[0] = w;
            } else {
                alert("Add and set LOGO file in the Graphics section");
                T[0] = "./background/" + E[0];
            }
            return T;
        }
        function a() {
            var T = air.File.applicationStorageDirectory;
            var U = w;
            U = T.resolvePath(U);
            return U.exists;
        }
        function B(T) {
            if (y) {
                air.trace("[Background]: " + T);
            }
        }
    }
}
