$RvW.songListRemote = null;

// TODO: Implement an express fork using air apis
class RvwWebServer {
  constructor() {
    this.init = init;
    this.remoteVVStatus = remoteVVStatus;

    let m_serverSocket = null;
    let m_content_types = {};
    let m_port = 50000;
    let m_hostname = null;
    let m_listening = false;
    let d;
    let n;
    let l;
    let __m_dbg = true;

    function init(port, hostname) {
      m_port = port;
      m_hostname = hostname;

      _load_content_types();
      _ensure_serving_dir();

      if (m_listening === false) {
        _startListening();
          const _isListening = m_serverSocket.listening;
          if (_isListening) {
          m_listening = true;
          return true;
        } else {
          m_serverSocket.close();
          alert("Remote VerseVIEW failed to initialize.");
          return false;
        }
      } else {
        m_listening = false;
        m_serverSocket.close();
        return true;
      }
    }

    function remoteVVStatus() {
      return m_listening;
    }

    function _startListening() {
      m_serverSocket = new air.ServerSocket();
      m_serverSocket.addEventListener(air.Event.CONNECT, _socketOnConnect);
      m_serverSocket.bind(m_port, m_hostname);
      m_serverSocket.listen();

      function _socketOnConnect(connection) {
          const clientSocket = connection.socket;

          clientSocket.addEventListener(air.ProgressEvent.SOCKET_DATA, _onIncoming);
        clientSocket.addEventListener(air.OutputProgressEvent.OUTPUT_PROGRESS, _onOutGoing);
        clientSocket.addEventListener(air.Event.CLOSE, _onClientSocketClose);

        function _onOutGoing() {
            if (clientSocket.bytesPending === 0) {
                clientSocket.close();
            }
        }
        function _onClientSocketClose() {
          clientSocket.close();
        }
        function _onIncoming(J) {
            const inBody = new air.ByteArray();
            clientSocket.readBytes(inBody);

            const bodyStr = String(inBody);

            // parse http header
            let path = bodyStr.substring(4, bodyStr.indexOf("HTTP/") - 1);
            const hasUrlParams = _hasUrlParams(path);
            if (!hasUrlParams) {
            if (path === "/") {
              path = "/index.html";
            }
            _sendFile(path);
          } else {
            C(path);
          }
        }
        function _hasUrlParams(path) {
            return path.split("?").length > 1;
        }
        function _sendFile(path) {
            const path1 = air.File.applicationStorageDirectory.resolvePath("webroot" + path);
            if (path1.exists && !path1.isDirectory) {
                const fz = new air.FileStream();
                fz.open(path1, air.FileMode.READ);
                const fileDat = new air.ByteArray();
                fz.readBytes(fileDat);
            fz.close();
            clientSocket.writeUTFBytes("HTTP/1.1 200 OK\n");
            clientSocket.writeUTFBytes("Content-Type: " + e(path) + "\n\n");
            clientSocket.writeBytes(fileDat);
            clientSocket.flush();
          } else {
            clientSocket.writeUTFBytes("HTTP/1.1 404 Not Found\n");
            clientSocket.writeUTFBytes("Content-Type: text/html\n\n");
            clientSocket.flush();
          }
        }
        function B(F) {
          if (F != null) {
            clientSocket.writeUTFBytes("HTTP/1.1 200 OK\n");
            clientSocket.writeUTFBytes("Content-Type: text/html\n\n");
            clientSocket.writeUTFBytes(F);
            clientSocket.flush();
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
                B($RvW.songListRemote);
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
    function _ensure_serving_dir() {
        const { File } = air;
        const appDir = File.applicationDirectory;
        const appStorageDir = File.applicationStorageDirectory;

        const dest = appStorageDir.resolvePath("webroot");
        if (!dest.exists) {
            appDir.resolvePath("webroot").copyTo(dest);
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
    function _load_content_types() {
      m_content_types[".css"] = "text/css";
      m_content_types[".gif"] = "image/gif";
      m_content_types[".htm"] = "text/html";
      m_content_types[".html"] = "text/html";
      m_content_types[".ico"] = "image/x-icon";
      m_content_types[".jpg"] = "image/jpeg";
      m_content_types[".js"] = "text/javascript";
      m_content_types[".png"] = "image/png";
    }
    function e(c) {
      var v;
      var b = c.lastIndexOf(".");
      if (b > -1) {
        v = m_content_types[c.substring(b)];
      }
      return v == null ? "text/html" : v;
    }
    function g(b) {
      if (__m_dbg) {
        air.trace("[WEB SERVER]: " + b);
      }
    }
  }
}
