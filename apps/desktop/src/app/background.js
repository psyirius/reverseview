// TODO: yui-migrate
// - YAHOO.widget.ColorPicker
// - YAHOO.util.Event
// - YAHOO.example.container.tt1cp
// - YAHOO.example.container.tt2cp
// - YAHOO.widget.Tooltip

!(function (exports) {
    let textColorHEX = 16777215;
    let bkgnd = {
        selectedIndex: 0,
        newSelectedIndex: -1,
        name: [],
        filename: [],
        newBkgndFile: null,
        numofPicsInRow: 4,
        randomBkgnd: false,
        init: function () {
            rvw.bg.bkgnd.selectedIndex = $RvW.vvConfigObj.get_bkgndIndex();
            rvw.bg.bkgnd.newSelectedIndex = -1;
            rvw.bg.bkgnd.name = [];
            rvw.bg.bkgnd.filename = [];
            rvw.bg.bkgnd.loadList();
            rvw.bg.bkgnd.randomBkgnd = true;
        },
        getBkgndFilename: function () {
            var b = [];
            var a = rvw.bg.bkgnd.filename.length;
            b[0] = "./background/" + rvw.bg.bkgnd.filename[rvw.bg.bkgnd.selectedIndex];
            if (rvw.bg.bkgnd.randomBkgnd) {
                for (let d = 0; d < a; d++) {
                    b[d + 1] = "./background/" + rvw.bg.bkgnd.filename[d];
                }
            }
            return b;
        },
        loadList: function getBkgListFromFile() {
            var d = null;
            var b = null;
            var a = "./xml/backgroundlist.xml";
            d = air.File.applicationStorageDirectory;
            d = d.resolvePath(a);
            b = new XMLHttpRequest();
            b.onreadystatechange = function () {
                if (b.readyState == 4) {
                    var f = b.responseXML.documentElement.getElementsByTagName("bkg");
                    for (var e = 0; e < f.length; e++) {}
                }
            };
            b.open("GET", d.url, true);
            b.send(null);
        },
        fill: function () {
            var d = air.File.applicationStorageDirectory;
            var e = "./background/thumbnail/" + rvw.bg.bkgnd.filename[rvw.bg.bkgnd.selectedIndex];
            e = d.resolvePath(e);
            document.getElementById("bkgndSelected").rows[0].cells[0].innerHTML =
                '<div align="left"> <img src=' + e.url + " width=200 height=150> </div>";
            var i = rvw.bg.bkgnd.filename.length;
            var h = rvw.bg.bkgnd.numofPicsInRow;
            var a = parseInt(i / h);
            var f = 0;
            var j = "";
            var g = "";
            var b = document.getElementById("bkgndList");
            b.innerHTML = "";
            for (r = 0; r <= a; r++) {
                b.insertRow(r);
                for (c = 0; c < h; c++) {
                    f = r * h + c;
                    b.rows[r].insertCell(c);
                    if (f < i) {
                        g = "imgx" + f;
                        j = "./background/thumbnail/" + rvw.bg.bkgnd.filename[f];
                        j = d.resolvePath(j);
                        b.rows[r].cells[c].innerHTML =
                            '<div align="center" id=' +
                            g +
                            "> <br><img src=" +
                            j.url +
                            " width=100 height=75> <br><br></div>";
                        b.rows[r].cells[c].addEventListener("mouseover", function () {
                            rvw.bg.bkgnd.processMouseOver(this);
                        });
                        b.rows[r].cells[c].addEventListener("mouseout", function () {
                            rvw.bg.bkgnd.processMouseOut(this);
                        });
                        document.getElementById(g).addEventListener("click", function () {
                            rvw.bg.bkgnd.processClick(event);
                        });
                    }
                }
            }
        },
        processMouseOver: function (a) {
            a.style.background = "black";
        },
        processMouseOut: function (a) {
            a.style.background = "#edf5ff";
        },
        processClick: function (e) {
            var h = e.currentTarget.id;
            var f = h.split("img");
            var d = f[1];
            var a = air.File.applicationStorageDirectory;
            var g = "./background/thumbnail/" + rvw.bg.bkgnd.filename[d];
            g = a.resolvePath(g);
            document.getElementById("bkgndSelected").rows[0].cells[0].innerHTML =
                '<div align="left"> <img src=' + g.url + " width=200 height=150> </div>";
            rvw.bg.bkgnd.newSelectedIndex = d;
            if (rvw.bg.bkgnd.newSelectedIndex != -1) {
                rvw.bg.bkgnd.selectedIndex = rvw.bg.bkgnd.newSelectedIndex;
                $RvW.vvConfigObj.set_bkgndIndex(rvw.bg.bkgnd.selectedIndex);
                $RvW.vvConfigObj.save();
                var b =
                    "Background " + rvw.bg.bkgnd.name[rvw.bg.bkgnd.newSelectedIndex] + " selected.....";
            } else {
            }
        },
        showBrowse: function () {
            var a = rvw.bg.bkgnd.filename.length;
            if (a < 50) {
                var b = new window.runtime.Array();
                b.push(new air.FileFilter("VerseVIEW Background", "*.jpg"));
                rvw.bg.bkgnd.newBkgndFile.browseForOpen("Select Background", b);
            } else {
                rvw.ui.Toast.show(
                    "Background Graphics",
                    "VerseVIEW supports a maximum of 50 backgrounds. Please delete backgrounds to add new ones."
                );
            }
        },
        processAdd: function () {
            var k = rvw.bg.bkgnd.newBkgndFile.nativePath;
            var h = k.split("\\");
            var d = h[h.length - 1];
            var f = true;
            var a = rvw.bg.bkgnd.filename.length;
            for (var e = 0; e < a; e++) {
                if (rvw.bg.bkgnd.filename[e] == d) {
                    f = false;
                }
            }
            if (f) {
                rvw.bg.bkgnd.filename.push(d);
                rvw.bg.bkgnd.name.push(d);
                var g = rvw.bg.bkgnd.generateBkgndXML();
                var j = air.File.applicationStorageDirectory;
                j = j.resolvePath("background/" + d);
                rvw.bg.bkgnd.newBkgndFile.copyTo(j, true);
                var b = air.File.applicationStorageDirectory;
                b = b.resolvePath("background/thumbnail/" + d);
                rvw.bg.bkgnd.newBkgndFile.copyTo(b, true);
                var l = "./xml/backgroundlist.xml";
                rvw.common.save2file(g, l, false);
                rvw.bg.bkgnd.fill();
            } else {
                rvw.ui.Toast.show("Background Graphics", "Background already exists.");
            }
        },
        generateBkgndXML: function () {
            var a = rvw.bg.bkgnd.filename.length;
            var d = "<backgroundlist>\n";
            for (var b = 0; b < a; b++) {
                d = d + "  <bkg>\n";
                d = d + "    <name>" + rvw.bg.bkgnd.name[b] + "</name>\n";
                d = d + "    <filename>" + rvw.bg.bkgnd.filename[b] + "</filename>\n";
                d = d + "  </bkg>\n";
            }
            d = d + "</backgroundlist>\n";
            return d;
        },
        setNumOfPicsInRow: function (a) {
            rvw.bg.bkgnd.numofPicsInRow = a;
            rvw.bg.bkgnd.fill();
        },
        delBkgnd: function () {
            var d = confirm("Are you sure you want to delete the selected Background?");
            if (d == true) {
                var f = rvw.bg.bkgnd.selectedIndex;
                var a = rvw.bg.bkgnd.filename.length;
                if (f == a - 1) {
                    rvw.bg.bkgnd.selectedIndex = 0;
                }
                rvw.bg.bkgnd.filename.splice(f, 1);
                rvw.bg.bkgnd.name.splice(f, 1);
                var b = rvw.bg.bkgnd.generateBkgndXML();
                var e = "./xml/backgroundlist.xml";
                rvw.common.save2file(b, e, false);
                $RvW.vvConfigObj.set_bkgndIndex(rvw.bg.bkgnd.selectedIndex);
                $RvW.vvConfigObj.save();
                rvw.bg.bkgnd.fill();
            }
        },
    };

    class ColorPicker {
        constructor() {
            this.init = g;
            this.cp_reset = e;
            var d = null;
            var b = null;

            function g() {
                d = new YAHOO.widget.ColorPicker("colorPickerID", {
                    showcontrols: false,
                    showhexcontrols: false,
                    showhsvcontrols: false,
                    showwebsafe: true,
                    images: {
                        PICKER_THUMB: "graphics/picker_thumb.png",
                        HUE_THUMB: "graphics/hue_thumb.png"
                    }
                });
                (b = YAHOO.util.Event), d;
                d.on("rgbChange", a);
                YAHOO.namespace("example.container");
                YAHOO.example.container.tt1cp = new YAHOO.widget.Tooltip("tt1cp", {
                    context: "cp_reset_id",
                    text: "Set to White Text"
                });
                YAHOO.example.container.tt2cp = new YAHOO.widget.Tooltip("tt2cp", {
                    context: "cp_save_id",
                    text: "Save as Default"
                });
                document.getElementById("cp_reset_id").addEventListener("click", e, false);
                document.getElementById("cp_save_id").addEventListener("click", f, false);
            }

            function a(i) {
                textColorHEX = d.get("hex");
            }

            function e() {
                d.setValue([255, 255, 255], false);
            }

            function f() {
                air.trace("Save as defualt");
            }
        }
    }

    // exports
    exports.bkgnd = bkgnd;
}(rvw.provide('rvw.bg')));

// rvw.bg.
