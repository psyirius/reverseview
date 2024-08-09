var songListRemote = null;

class vvWebServer {
  constructor() {
    this.init = q;
    this.remoteVVStatus = o;
    var a = null;
    var x = new Object();
    var j = 50000;
    var h = null;
    var r = false;
    var w;
    var t;
    var k;
    var d;
    var n;
    var l;
    var u = true;
    var m = true;
    function q(v, c) {
      j = v;
      h = c;
      p();
      i();
      if (r == false) {
        s();
        var b = a.listening;
        if (b) {
          r = true;
          return true;
        } else {
          a.close();
          alert("Remote VerseVIEW failed to initialize.");
          return false;
        }
      } else {
        r = false;
        a.close();
        return true;
      }
    }
    function o() {
      return r;
    }
    function s() {
      a = new air.ServerSocket();
      a.addEventListener(air.Event.CONNECT, b);
      a.bind(j, h);
      a.listen();
      function b(c) {
        var E = c.socket;
        E.addEventListener(air.ProgressEvent.SOCKET_DATA, A);
        E.addEventListener(air.OutputProgressEvent.OUTPUT_PROGRESS, D);
        E.addEventListener(air.Event.CLOSE, z);
        function D(G) {
          var F = E.bytesPending;
          if (F == 0) {
            E.close();
          }
        }
        function z() {
          E.close();
        }
        function A(J) {
          var G = new air.ByteArray();
          E.readBytes(G);
          var I = "" + G;
          var H = I.substring(4, I.indexOf("HTTP/") - 1);
          var F = y(H);
          if (!F) {
            if (H == "/") {
              H = "/index.html";
            }
            v(H);
          } else {
            C(H);
          }
        }
        function y(H) {
          var F = false;
          var G = H.split("?");
          if (G.length > 1) {
            return true;
          } else {
            return false;
          }
        }
        function v(F) {
          var G = air.File.applicationStorageDirectory.resolvePath(
            "network/webroot" + F
          );
          if (G.exists && !G.isDirectory) {
            var I = new air.FileStream();
            I.open(G, air.FileMode.READ);
            var H = new air.ByteArray();
            I.readBytes(H);
            I.close();
            E.writeUTFBytes("HTTP/1.1 200 OK\n");
            E.writeUTFBytes("Content-Type: " + e(F) + "\n\n");
            E.writeBytes(H);
            E.flush();
          } else {
            E.writeUTFBytes("HTTP/1.1 404 Not Found\n");
            E.writeUTFBytes("Content-Type: text/html\n\n");
            E.flush();
          }
        }
        function B(F) {
          if (F != null) {
            E.writeUTFBytes("HTTP/1.1 200 OK\n");
            E.writeUTFBytes("Content-Type: text/html\n\n");
            E.writeUTFBytes(F);
            E.flush();
          }
        }
        function C(N) {
          f(N);
          switch (d) {
            case "1":
              var R = $RvW.bibleRefObj.init(n);
              if (R) {
                $RvW.bibleRefObj.present();
                B("Presenting verse...");
              } else {
                B($RvW.bibleRefObj.getErrorMessage());
              }
              break;
            case "2":
              $RvW.webEngineObj.nextSlide();
              B("Next slide OK....");
              break;
            case "3":
              $RvW.webEngineObj.prevSlide();
              B("Previous Slide OK..");
              break;
            case "4":
              $RvW.webEngineObj.closePresentation();
              B("Close Activated");
              break;
            case "13":
              $RvW.webEngineObj.themePresentation();
              B("Blank Activated");
              break;
            case "14":
              $RvW.webEngineObj.logoPresentation();
              B("Blank Activated");
              break;
            case "15":
              $RvW.webEngineObj.blankPresentation();
              B("Blank Activated");
              break;
            case "6":
              var S = $RvW.scheduleObj.getScheduleText(parseInt(n));
              B(S);
              break;
            case "10":
              $RvW.scheduleObj.processRemotePresent(n);
              B("Presenting from Schedule");
              break;
            case "7":
              var R = $RvW.bibleRefObj.init(n);
              if (R) {
                var K = $RvW.bibleRefObj.getVerseFont();
                var O = $RvW.bibleRefObj.getBook();
                var M = $RvW.bibleRefObj.getChapter();
                var Q = getAllVersesFromChapter(O, M - 1);
                var J = $RvW.webEngineObj.processVerses(Q, K, O, M);
                B(J);
              } else {
                B($RvW.bibleRefObj.getErrorMessage());
              }
              break;
            case "16":
              var P = $RvW.scheduleObj.getSongIndexFromSch(n);
              var H = $RvW.songManagerObj.getSongObjWithID(P);
              var J = $RvW.webEngineObj.processSong(H);
              B(J);
              break;
            case "17":
              $RvW.scheduleObj.processRemotePresent(n, l);
              B("Presenting song slide");
              break;
            case "8":
              var I = n.split(":");
              $RvW.present_external(I[0], I[1], I[2]);
              B("Presenting Verse...");
              break;
            case "9":
              B($RvW.webEngineObj.stageViewContent());
              break;
            case "19":
              B("19<command>" + $RvW.vvchatQObj.getKeywords());
              break;
            case "11":
              B("11<command>" + $RvW.vvchatQObj.getMsgFromID(n));
              break;
            case "12":
              var G = n.split("|");
              $RvW.vvchatQObj.addMsg(G[0], G[1]);
              B("12<command>Mission Accomplished");
              break;
            case "18":
              $RvW.songManagerObj.getAllTitlesForWeb(n);
              $("#command18").on("click", function () {
                B(songListRemote);
              });
              break;
            case "20":
              var F = new chordsWebInterfaceClass();
              F.init(n);
              var L = F.getsong();
              F = null;
              B(L);
              break;
            default:
              break;
          }
        }
      }
    }
    function i() {
      var b = air.File.applicationStorageDirectory.resolvePath("network");
      if (!b.exists) {
        air.File.applicationDirectory.resolvePath("network/webroot").copyTo(b);
      }
    }
    function f(c) {
      var b = c.split("\n");
      b = b[0].split("?");
      b = b[1].split("&");
      d = b[0].split("=")[1];
      n = b[1].split("=")[1];
      n = n.replace(/%20/g, " ");
      if (b[2] != null) {
        l = b[2].split("=")[1];
        l = l.replace(/%20/g, " ");
      }
    }
    function p() {
      x[".css"] = "text/css";
      x[".gif"] = "image/gif";
      x[".htm"] = "text/html";
      x[".html"] = "text/html";
      x[".ico"] = "image/x-icon";
      x[".jpg"] = "image/jpeg";
      x[".js"] = "text/javascript";
      x[".png"] = "image/png";
    }
    function e(c) {
      var v;
      var b = c.lastIndexOf(".");
      if (b > -1) {
        v = x[c.substring(b)];
      }
      return v == null ? "text/html" : v;
    }
    function g(b) {
      if (m) {
        air.trace("[WEB SERVER]: " + b);
      }
    }
  }
}
