class remoteVV_UI_Class {
  constructor() {
    this.init = w;
    this.configure = A;
    this.show = z;
    var q = null;
    var v = null;
    var f = new Array();
    var r = "";
    var p = "";
    var g = "";
    var s = true;
    function w(B) {
      v = B;
      k();
      u();
      e();
    }
    function k() {
      q = new YAHOO.widget.Panel("panelObj3", {
        width: "700px",
        fixedcenter: true,
        modal: true,
        visible: false,
        constraintoviewport: true,
      });
      q.render(document.body);
      q.setHeader("Remote VerseVIEW");
      q.setBody(v);
      q.hide();
      q.bringToTop();
    }
    function u() {
      f[0] =
        "Use IP address 127.0.0.1 if VerseVIEW and live stream software on the same computer. <br> Use the other IP address if remote access is required with multiple computers and devices";
      f[1] = "Enable this port numer with the firewall software";
      f[2] =
        "Messenger feature can be used to easily communicate between choir team members";
      f[3] = "The full address is displayed in the text box and the QR code";
      f[4] =
        "Enter the host name of the computer and toggle the Use Host name field";
    }
    function m(B) {
      $("#remoteVVHint").html(f[B]);
    }
    function A() {
      n();
      x();
    }
    function x() {
      document
        .getElementById("saveRemoteVVSettings")
        .addEventListener("click", b);
      document
        .getElementById("updateFixedWords")
        .addEventListener("click", function () {
          var B = document.getElementById("fixedWordList").value;
          vvchatQObj.updateFixedWords(B);
        });
      $("#configRemoteCopy").click(function () {
        var B = $("#configRemoteLink").val();
        air.Clipboard.generalClipboard.clear();
        air.Clipboard.generalClipboard.setData(
          air.ClipboardFormats.TEXT_FORMAT,
          B
        );
      });
      $("#configIPaddr").click(function () {
        m(0);
      });
      $("#configRemotePort").click(function () {
        m(1);
      });
      $("#configRemoteHostname").click(function () {
        m(4);
      });
      $("#remoteVVShowKeywords").click(function () {
        m(2);
        y();
      });
      $("#remoteVVRemoteFunc").click(function () {
        m(3);
      });
      $("#remoteVVRemoteFunc").change(function () {
        m(3);
        d();
      });
      $("#remoteVVUseHostname").change(function () {
        var B = $("#remoteVVUseHostname").is(":checked");
        if (B) {
          if (r == "127.0.0.1") {
            g = "localhost";
          } else {
            g = $("#configRemoteHostname").val();
            vvConfigObj.set_myhostname(g);
            vvConfigObj.save();
          }
        } else {
          g = "";
        }
        l();
      });
    }
    function z() {
      q.show();
      q.bringToTop();
    }
    function j() {
      q.hide();
    }
    function n() {
      clearSelectList("configIPaddr");
      IPList = remoteVV_IPList();
      var B = IPList.length;
      for (i = 0; i < B; i++) {
        document.getElementById("configIPaddr").options[i] = new Option(
          IPList[i],
          i
        );
      }
      document.getElementById("configIPaddr").selectedIndex = 0;
      if (B == 0) {
        document.getElementById("configIPaddr").disabled = true;
        document.getElementById("configRemotePort").disabled = true;
        document.getElementById("saveRemoteVVSettings").disabled = true;
      }
    }
    function c() {
      var B = document.getElementById("configIPaddr").selectedIndex;
      if (B != null) {
        return IPList[B];
      } else {
        return false;
      }
    }
    function b() {
      var C = 50000;
      var D = null;
      if (webServerObj.remoteVVStatus() == false) {
        C = document.getElementById("configRemotePort").value;
        D = c();
        if (IsNumeric(C)) {
          if (withinRange(49152, 65535, C)) {
            portNumber = C;
            var B = webServerObj.init(portNumber, D);
            if (B) {
              t("DISABLE");
              document.getElementById("configRemotePort").disabled = true;
              document.getElementById("configIPaddr").disabled = true;
              if (D != null) {
                if (D.indexOf(":") > -1) {
                  D = "[" + D + "]";
                }
                r = D;
                p = portNumber;
                d();
              } else {
                e();
              }
            } else {
              e();
            }
          } else {
            rvw.ui.Toast.show(
              "Remote VerseVIEW",
              "Port Number: Out of Range. Valid range is 49152 to 65535."
            );
            document.getElementById("configRemotePort").value = portNumber;
            e();
          }
        } else {
          rvw.ui.Toast.show(
            "Remote VerseVIEW",
            "Invalid Port Number. Valid range is 49152 to 65535."
          );
          document.getElementById("configRemotePort").value = portNumber;
          e();
        }
      } else {
        webServerObj.init(portNumber);
        t("ENABLE");
        document.getElementById("configRemotePort").disabled = false;
        document.getElementById("configIPaddr").disabled = false;
        e();
      }
    }
    function e() {
      g = vvConfigObj.get_myhostname();
      $("#configRemoteHostname").val(g);
      document.getElementById("remoteVVStatus").innerHTML = "Remote is DISABLED";
      $("#remoteVVShowKeywords").show();
      $("#fixedWordListDiv").hide();
      $("#remoteLinkList").hide();
      $("#qrcode").hide();
      $("#configRemoteLink").hide();
      $("#configRemoteCopy").hide();
    }
    function d() {
      document.getElementById("remoteVVStatus").innerHTML = "Remote is ENABLED";
      $("#remoteVVShowKeywords").show();
      $("#fixedWordListDiv").hide();
      l();
      $("#remoteLinkList").show();
      $("#qrcode").show();
      $("#configRemoteLink").show();
      $("#configRemoteCopy").show();
    }
    function l() {
      var F = r;
      var E = $("#remoteVVUseHostname").is(":checked");
      if (E) {
        if (r == "127.0.0.1") {
          F = "localhost";
        } else {
          if (g != "") {
            F = g;
          }
        }
      }
      var B = "";
      var D = "http://" + F + ":" + p + "/";
      var C = $("#remoteVVRemoteFunc").val();
      switch (C) {
        case "1":
          B = D;
          break;
        case "2":
          B = D + "stageview/fullscreen1/c.html";
          break;
        case "3":
          B = D + "stageview/fullscreen2/c.html";
          break;
        case "4":
          B = D + "lowerthird/theme6/a/a.html";
          break;
        case "5":
          B = D + "lowerthird/theme6/b/b.html";
          break;
        case "6":
          B = D + "lowerthird/theme6/c/c.html";
          break;
        case "7":
          B = D + "lowerthird/theme6/d/d.html";
          break;
        case "8":
          B = D + "lowerthird/theme6/e/e.html";
          break;
        case "9":
          B = D + "lowerthird/theme6/e2/e.html";
          break;
        case "10":
          B = D + "lowerthird/theme6/g/g.html";
          break;
        case "11":
          B = D + "stageview/chords/c.html";
          break;
        default:
          B = D;
      }
      $("#configRemoteLink").val(B);
      $("#qrcode").html("");
      new QRCode(document.getElementById("qrcode"), B);
    }
    function t(B) {
      $("#saveRemoteVVSettings").html(B);
    }
    function a(B) { }
    function y() {
      var B = $("#fixedWordListDiv").is(":hidden");
      if (B) {
        $("#fixedWordListDiv").show();
        o("Hide Messenger Keywords");
      } else {
        $("#fixedWordListDiv").hide();
        o("Show Messenger Keywords");
      }
    }
    function o(B) {
      $("#remoteVVShowKeywords").html(B);
    }
    function h(B) {
      if (s) {
        air.trace("REMOTE VV UI: " + B);
      }
    }
  }
}
