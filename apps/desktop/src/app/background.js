// TODO: yui-migrate
// - YAHOO.widget.ColorPicker
// - YAHOO.util.Event

import {Toast} from "@app/toast";
import {save2file} from "@app/common";
import {$RvW} from "@/rvw";

export const BgContext = {
    selectedIndex: 0,
    newSelectedIndex: -1,
    name: [],
    filename: [],
    newBkgndFile: null,
    numofPicsInRow: 4,
    randomBkgnd: false,
    init: function () {
        BgContext.selectedIndex = $RvW.vvConfigObj.get_bkgndIndex();
        BgContext.newSelectedIndex = -1;
        BgContext.name = [];
        BgContext.filename = [];
        BgContext.loadList();
        BgContext.randomBkgnd = true;
    },
    getBkgndFilename: function () {
        var b = [];
        var a = BgContext.filename.length;
        b[0] = "./background/" + BgContext.filename[BgContext.selectedIndex];
        if (BgContext.randomBkgnd) {
            for (let d = 0; d < a; d++) {
                b[d + 1] = "./background/" + BgContext.filename[d];
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
        var e = "./background/thumbnail/" + BgContext.filename[BgContext.selectedIndex];
        e = d.resolvePath(e);
        document.getElementById("bkgndSelected").rows[0].cells[0].innerHTML =
            '<div align="left"> <img src=' + e.url + " width=200 height=150> </div>";
        var i = BgContext.filename.length;
        var h = BgContext.numofPicsInRow;
        var a = parseInt(i / h);
        var f = 0;
        var j = "";
        var g = "";
        var b = document.getElementById("bkgndList");
        b.innerHTML = "";
        for (let r = 0; r <= a; r++) {
            b.insertRow(r);
            for (let c = 0; c < h; c++) {
                f = r * h + c;
                b.rows[r].insertCell(c);
                if (f < i) {
                    g = "imgx" + f;
                    j = "./background/thumbnail/" + BgContext.filename[f];
                    j = d.resolvePath(j);
                    b.rows[r].cells[c].innerHTML =
                        '<div align="center" id=' +
                        g +
                        "> <br><img src=" +
                        j.url +
                        " width=100 height=75> <br><br></div>";
                    b.rows[r].cells[c].addEventListener("mouseover", function () {
                        BgContext.processMouseOver(this);
                    });
                    b.rows[r].cells[c].addEventListener("mouseout", function () {
                        BgContext.processMouseOut(this);
                    });
                    document.getElementById(g).addEventListener("click", function () {
                        BgContext.processClick(event);
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
        var g = "./background/thumbnail/" + BgContext.filename[d];
        g = a.resolvePath(g);
        document.getElementById("bkgndSelected").rows[0].cells[0].innerHTML =
            '<div align="left"> <img src=' + g.url + " width=200 height=150> </div>";
        BgContext.newSelectedIndex = d;
        if (BgContext.newSelectedIndex != -1) {
            BgContext.selectedIndex = BgContext.newSelectedIndex;
            $RvW.vvConfigObj.set_bkgndIndex(BgContext.selectedIndex);
            $RvW.vvConfigObj.save();
            var b =
                "Background " + BgContext.name[BgContext.newSelectedIndex] + " selected.....";
        } else {
        }
    },
    showBrowse: function () {
        var a = BgContext.filename.length;
        if (a < 50) {
            var b = new window.runtime.Array();
            b.push(new air.FileFilter("VerseVIEW Background", "*.jpg"));
            BgContext.newBkgndFile.browseForOpen("Select Background", b);
        } else {
            Toast.show(
                "Background Graphics",
                "VerseVIEW supports a maximum of 50 backgrounds. Please delete backgrounds to add new ones."
            );
        }
    },
    processAdd: function () {
        var k = BgContext.newBkgndFile.nativePath;
        var h = k.split("\\");
        var d = h[h.length - 1];
        var f = true;
        var a = BgContext.filename.length;
        for (var e = 0; e < a; e++) {
            if (BgContext.filename[e] == d) {
                f = false;
            }
        }
        if (f) {
            BgContext.filename.push(d);
            BgContext.name.push(d);
            var g = BgContext.generateBkgndXML();
            var j = air.File.applicationStorageDirectory;
            j = j.resolvePath("background/" + d);
            BgContext.newBkgndFile.copyTo(j, true);
            var b = air.File.applicationStorageDirectory;
            b = b.resolvePath("background/thumbnail/" + d);
            BgContext.newBkgndFile.copyTo(b, true);
            var l = "./xml/backgroundlist.xml";
            save2file(g, l, false);
            BgContext.fill();
        } else {
            Toast.show("Background Graphics", "Background already exists.");
        }
    },
    generateBkgndXML: function () {
        let d = "<backgroundlist>\n";
        for (let i = 0; i < BgContext.filename.length; i++) {
            d += "  <bkg>\n";
            d += "    <name>" + BgContext.name[i] + "</name>\n";
            d += "    <filename>" + BgContext.filename[i] + "</filename>\n";
            d += "  </bkg>\n";
        }
        d += "</backgroundlist>\n";
        return d;
    },
    setNumOfPicsInRow: function (a) {
        BgContext.numofPicsInRow = a;
        BgContext.fill();
    },
    delBkgnd: function () {
        var d = confirm("Are you sure you want to delete the selected Background?");
        if (d == true) {
            var f = BgContext.selectedIndex;
            var a = BgContext.filename.length;
            if (f == a - 1) {
                BgContext.selectedIndex = 0;
            }
            BgContext.filename.splice(f, 1);
            BgContext.name.splice(f, 1);
            var b = BgContext.generateBkgndXML();
            var e = "./xml/backgroundlist.xml";
            save2file(b, e, false);
            $RvW.vvConfigObj.set_bkgndIndex(BgContext.selectedIndex);
            $RvW.vvConfigObj.save();
            BgContext.fill();
        }
    },
};

class ColorPicker {
    constructor() {
        this.init = init;
        this.cp_reset = cp_reset;
        var d = null;

        function init() {
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
            d.on("rgbChange", a);
            document.getElementById("cp_reset_id").addEventListener("click", cp_reset, false);
            document.getElementById("cp_reset_id").setAttribute('data-tooltip', 'Set to White Text');
            document.getElementById("cp_save_id").addEventListener("click", f, false);
            document.getElementById("cp_save_id").setAttribute('data-tooltip', 'Save as Default');
        }

        function a(i) {
            let textColorHEX = d.get("hex");
        }

        function cp_reset() {
            d.setValue([255, 255, 255], false);
        }

        function f() {
            air.trace("Save as default");
        }
    }
}
