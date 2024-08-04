var bkgndFile = null;
var textColorHEX = 16777215;
var addBkgndIcon;
var delBkgndIcon;
bkgnd = {
  selectedIndex: 0,
  newSelectedIndex: -1,
  name: [],
  filename: [],
  newBkgndFile: null,
  numofPicsInRow: 4,
  randomBkgnd: false,
  init: function () {
    bkgnd.selectedIndex = vvConfigObj.get_bkgndIndex();
    bkgnd.newSelectedIndex = -1;
    bkgnd.name = new Array();
    bkgnd.filename = new Array();
    bkgnd.loadList();
    if (true) {
      bkgnd.randomBkgnd = true;
    }
  },
  getBkgndFilename: function () {
    var b = new Array();
    var a = bkgnd.filename.length;
    var f = "./background/" + bkgnd.filename[bkgnd.selectedIndex];
    b[0] = f;
    if (bkgnd.randomBkgnd) {
      for (var d = 0; d < a; d++) {
        var e = "./background/" + bkgnd.filename[d];
        b[d + 1] = e;
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
    var e = "./background/thumbnail/" + bkgnd.filename[bkgnd.selectedIndex];
    e = d.resolvePath(e);
    document.getElementById("bkgndSelected").rows[0].cells[0].innerHTML =
      '<div align="left"> <img src=' + e.url + " width=200 height=150> </div>";
    var i = bkgnd.filename.length;
    var h = bkgnd.numofPicsInRow;
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
          j = "./background/thumbnail/" + bkgnd.filename[f];
          j = d.resolvePath(j);
          b.rows[r].cells[c].innerHTML =
            '<div align="center" id=' +
            g +
            "> <br><img src=" +
            j.url +
            " width=100 height=75> <br><br></div>";
          b.rows[r].cells[c].addEventListener("mouseover", function () {
            bkgnd.processMouseOver(this);
          });
          b.rows[r].cells[c].addEventListener("mouseout", function () {
            bkgnd.processMouseOut(this);
          });
          document.getElementById(g).addEventListener("click", function () {
            bkgnd.processClick(event);
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
    var g = "./background/thumbnail/" + bkgnd.filename[d];
    g = a.resolvePath(g);
    document.getElementById("bkgndSelected").rows[0].cells[0].innerHTML =
      '<div align="left"> <img src=' + g.url + " width=200 height=150> </div>";
    bkgnd.newSelectedIndex = d;
    if (bkgnd.newSelectedIndex != -1) {
      bkgnd.selectedIndex = bkgnd.newSelectedIndex;
      vvConfigObj.set_bkgndIndex(bkgnd.selectedIndex);
      vvConfigObj.save();
      var b =
        "Background " + bkgnd.name[bkgnd.newSelectedIndex] + " selected.....";
    } else {
    }
  },
  showBrowse: function () {
    var a = bkgnd.filename.length;
    if (a < 50) {
      var b = new window.runtime.Array();
      b.push(new air.FileFilter("VerseVIEW Background", "*.jpg"));
      bkgnd.newBkgndFile.browseForOpen("Select Background", b);
    } else {
      vvDialog(
        "Background Graphics",
        "VerseVIEW supports a maximum of 50 backgrounds. Please delete backgrounds to add new ones."
      );
    }
  },
  processAdd: function () {
    var k = bkgnd.newBkgndFile.nativePath;
    var h = k.split("\\");
    var d = h[h.length - 1];
    var f = true;
    var a = bkgnd.filename.length;
    for (var e = 0; e < a; e++) {
      if (bkgnd.filename[e] == d) {
        f = false;
      }
    }
    if (f) {
      bkgnd.filename.push(d);
      bkgnd.name.push(d);
      var g = bkgnd.generateBkgndXML();
      var j = air.File.applicationStorageDirectory;
      j = j.resolvePath("background/" + d);
      bkgnd.newBkgndFile.copyTo(j, true);
      var b = air.File.applicationStorageDirectory;
      b = b.resolvePath("background/thumbnail/" + d);
      bkgnd.newBkgndFile.copyTo(b, true);
      var l = "./xml/backgroundlist.xml";
      save2file(g, l, false);
      bkgnd.fill();
    } else {
      vvDialog("Background Graphics", "Background already exists.");
    }
  },
  generateBkgndXML: function () {
    var a = bkgnd.filename.length;
    var d = "<backgroundlist>\n";
    for (var b = 0; b < a; b++) {
      d = d + "  <bkg>\n";
      d = d + "    <name>" + bkgnd.name[b] + "</name>\n";
      d = d + "    <filename>" + bkgnd.filename[b] + "</filename>\n";
      d = d + "  </bkg>\n";
    }
    d = d + "</backgroundlist>\n";
    return d;
  },
  setNumOfPicsInRow: function (a) {
    bkgnd.numofPicsInRow = a;
    bkgnd.fill();
  },
  delBkgnd: function () {
    var d = confirm("Are you sure you want to delete the selected Background?");
    if (d == true) {
      var f = bkgnd.selectedIndex;
      var a = bkgnd.filename.length;
      if (f == a - 1) {
        bkgnd.selectedIndex = 0;
      }
      bkgnd.filename.splice(f, 1);
      bkgnd.name.splice(f, 1);
      var b = bkgnd.generateBkgndXML();
      var e = "./xml/backgroundlist.xml";
      save2file(b, e, false);
      vvConfigObj.set_bkgndIndex(bkgnd.selectedIndex);
      vvConfigObj.save();
      bkgnd.fill();
    }
  },
};
function cp() {
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
        HUE_THUMB: "graphics/hue_thumb.png",
      },
    });
    (b = YAHOO.util.Event), d;
    d.on("rgbChange", a);
    YAHOO.namespace("example.container");
    YAHOO.example.container.tt1cp = new YAHOO.widget.Tooltip("tt1cp", {
      context: "cp_reset_id",
      text: "Set to White Text",
    });
    YAHOO.example.container.tt2cp = new YAHOO.widget.Tooltip("tt2cp", {
      context: "cp_save_id",
      text: "Save as Default",
    });
    document.getElementById("cp_reset_id").addEventListener("click", e, false);
    document.getElementById("cp_save_id").addEventListener("click", f, false);
  }
  function a(i) {
    var h = d.get("hex");
    textColorHEX = h;
  }
  function e() {
    d.setValue([255, 255, 255], false);
  }
  function f() {
    air.trace("Save as defualt");
  }
}