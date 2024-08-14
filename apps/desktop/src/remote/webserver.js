$RvW.songListRemote = null;

// TODO: Implement an express fork using air apis

const mimeTypeMap = {
    '.txt'  : 'text/plain',
    '.css'  : 'text/css',
    '.gif'  : 'image/gif',
    '.htm'  : 'text/html',
    '.html' : 'text/html',
    '.ico'  : 'image/x-icon',
    '.jpg'  : 'image/jpeg',
    '.png'  : 'image/png',
    '.js'   : 'text/javascript',
};

class WebRequestHandler {
    constructor(connection, staticDir) {
        this.m_clientSocket = connection.socket;
        this.m_staticDir = staticDir;

        this.m_clientSocket.addEventListener(air.ProgressEvent.SOCKET_DATA, () => this._onIncoming());
        this.m_clientSocket.addEventListener(air.OutputProgressEvent.OUTPUT_PROGRESS, () => this._onOutGoing());

        this.m_clientSocket.addEventListener(air.Event.CLOSE, () => this._onClientSocketClose());

        this.m_debug = false;
    }

    _onOutGoing() {
        if (this.m_clientSocket.bytesPending === 0) {
            this.m_clientSocket.close();
        }
    }

    _onClientSocketClose() {
        this.m_clientSocket.close();
    }

    _onIncoming() {
        const inBody = new air.ByteArray();
        this.m_clientSocket.readBytes(inBody);

        const bodyStr = String(inBody);

        // parse http header
        let urlPath = bodyStr.substring(4, bodyStr.indexOf("HTTP/") - 1);
        if (!this._isApiPath(urlPath)) {
            if (urlPath === "/") {
                urlPath = "/index.html";
            }
            this._handleStaticFileRequest(urlPath);
        } else {
            this._handleApiRequest(urlPath);
        }
    }

    _getContentType(filename) {
        const ext = filename.lastIndexOf(".");

        if (ext !== -1) {
            return mimeTypeMap[filename.substring(ext)];
        }

        return mimeTypeMap['.txt'];
    }

    _isApiPath(path) {
        return path.split("?").length > 1;
    }

    _handleStaticFileRequest(path) {
        const clientSocket = this.m_clientSocket;

        const { File } = air;
        const appStorageDir = File.applicationStorageDirectory;

        const fxp = appStorageDir.resolvePath(this.m_staticDir + path);

        if (fxp.exists && !fxp.isDirectory) {
            const fz = new air.FileStream();
            fz.open(fxp, air.FileMode.READ);
            const fileDat = new air.ByteArray();
            fz.readBytes(fileDat);
            fz.close();
            clientSocket.writeUTFBytes("HTTP/1.1 200 OK\n");
            clientSocket.writeUTFBytes("Content-Type: " + this._getContentType(path) + "\n\n");
            clientSocket.writeBytes(fileDat);
            clientSocket.flush();
        } else {
            clientSocket.writeUTFBytes("HTTP/1.1 404 Not Found\n");
            clientSocket.writeUTFBytes("Content-Type: text/html\n\n");
            clientSocket.flush();
        }
    }

    _sendTextHtml(text) {
        const clientSocket = this.m_clientSocket;

        if (text != null) {
            clientSocket.writeUTFBytes("HTTP/1.1 200 OK\n");
            clientSocket.writeUTFBytes("Content-Type: text/html\n\n");
            clientSocket.writeUTFBytes(text);
            clientSocket.flush();
        }
    }

    _handleApiRequest(urlPath) {
        const [cmd_action, cmd_args, slide_num] = this._parseCommand(urlPath);

        this._debug_log(`Command: '${cmd_action}' Args: '${cmd_args}' XYZ: '${slide_num}'`);

        switch (cmd_action) {
            case "1": { // Present Bible Verse
                if ($RvW.bibleRefObj.init(cmd_args)) {
                    $RvW.bibleRefObj.present();
                    this._sendTextHtml("Presenting verse...");
                } else {
                    this._sendTextHtml($RvW.bibleRefObj.getErrorMessage());
                }
                break;
            }
            case "2": { // Next Slide
                $RvW.webEngineObj.nextSlide();
                this._sendTextHtml("Next slide OK....");
                break;
            }
            case "3": { // Previous Slide
                $RvW.webEngineObj.prevSlide();
                this._sendTextHtml("Previous Slide OK..");
                break;
            }
            case "4": { // Close Presentation
                $RvW.webEngineObj.closePresentation();
                this._sendTextHtml("Close Activated");
                break;
            }
            case "13": { // Theme Slide
                $RvW.webEngineObj.themePresentation();
                this._sendTextHtml("Theme Activated");
                break;
            }
            case "14": { // Logo Slide
                $RvW.webEngineObj.logoPresentation();
                this._sendTextHtml("Logo Activated");
                break;
            }
            case "15": { // Blank Slide
                $RvW.webEngineObj.blankPresentation();
                this._sendTextHtml("Blank Activated");
                break;
            }
            case "6": { // Get Schedule
                this._sendTextHtml($RvW.scheduleObj.getScheduleText(parseInt(cmd_args)));
                break;
            }
            case "10": { // Present Schedule
                $RvW.scheduleObj.processRemotePresent(cmd_args);
                this._sendTextHtml("Presenting from Schedule");
                break;
            }
            case "7": { // Present Bible Chapter
                if ($RvW.bibleRefObj.init(cmd_args)) {
                    const vf = $RvW.bibleRefObj.getVerseFont();
                    const book = $RvW.bibleRefObj.getBook();
                    const chapter = $RvW.bibleRefObj.getChapter();
                    const versesFromChapter = getAllVersesFromChapter(book, chapter - 1);
                    const verses = $RvW.webEngineObj.processVerses(versesFromChapter, vf, book, chapter);
                    this._sendTextHtml(verses);
                } else {
                    this._sendTextHtml($RvW.bibleRefObj.getErrorMessage());
                }
                break;
            }
            case "16": { // Present Schedule Song
                const songId = $RvW.scheduleObj.getSongIndexFromSch(cmd_args);
                const song = $RvW.songManagerObj.getSongObjWithID(songId);
                const songDate = $RvW.webEngineObj.processSong(song);
                this._sendTextHtml(songDate);
                break;
            }
            case "17": { // Present Song Slide
                $RvW.scheduleObj.processRemotePresent(cmd_args, slide_num);
                this._sendTextHtml("Presenting song slide");
                break;
            }
            case "8": { // Present Verse
                const bibleRef = cmd_args.split(":");
                $RvW.present_external(bibleRef[0], bibleRef[1], bibleRef[2]);
                this._sendTextHtml("Presenting Verse...");
                break;
            }
            case "9": { // Get Stage View Content
                this._sendTextHtml($RvW.webEngineObj.stageViewContent());
                break;
            }
            case "19": { // Get Chat Keywords
                this._sendTextHtml("19<command>" + $RvW.vvchatQObj.getKeywords());
                break;
            }
            case "11": { // Send Chat Message
                this._sendTextHtml("11<command>" + $RvW.vvchatQObj.getMsgFromID(cmd_args));
                break;
            }
            case "12": { // Add Chat Message
                const msgXY = cmd_args.split("|");
                $RvW.vvchatQObj.addMsg(msgXY[0], msgXY[1]);
                this._sendTextHtml("12<command>Mission Accomplished");
                break;
            }
            case "18": { // Get All Songs
                $RvW.songManagerObj.getAllTitlesForWeb(cmd_args);
                $("#command18").on("click", () => {
                    this._sendTextHtml($RvW.songListRemote);
                });
                break;
            }
            case "20": { // Get Chords
                const cwi = new ChordsWebInterface(cmd_args);
                this._sendTextHtml(cwi.getsong());
                break;
            }
        }
    }

    _parseCommand(urlPath) {
        let b = urlPath.split("\n");
        b = b[0].split("?");
        b = b[1].split("&");

        const action = b[0].split("=")[1];

        let argz = b[1].split("=")[1];
        argz = argz.replace(/%20/g, " ");

        let extraArg = null;
        if (b[2] != null) {
            extraArg = b[2].split("=")[1];
            extraArg = extraArg.replace(/%20/g, " ");
        }

        return [action, argz, extraArg];
    }

    _debug_log(msg) {
        if (this.m_debug) {
            air.trace(`[WebRequestHandler]: ${msg}`);
        }
    }
}

class RvwWebServer {
    constructor(staticDir) {
        this.m_port = 50000;
        this.m_hostname = null;

        this.m_serverSocket = null;
        this.m_listening = false;
        this.m_staticDir = staticDir;

        this.m_debug = false;
    }

    init(port, hostname) {
        this.m_port = port;
        this.m_hostname = hostname;

        this._ensure_serving_dir();

        if (this.m_listening === false) {
            this._startListening();
            if (this.m_serverSocket.listening) {
                this.m_listening = true;
                return true;
            } else {
                this.m_serverSocket.close();
                alert("Remote VerseVIEW failed to initialize.");
                return false;
            }
        } else {
            this.m_listening = false;
            this.m_serverSocket.close();
            return true;
        }
    }

    isActive() {
        return this.m_listening;
    }

    _startListening() {
        this.m_serverSocket = new air.ServerSocket();
        this.m_serverSocket.addEventListener(air.Event.CONNECT, (c) => new WebRequestHandler(c, this.m_staticDir));
        this.m_serverSocket.bind(this.m_port, this.m_hostname);
        this.m_serverSocket.listen();
    }

    _ensure_serving_dir() {
        const { File } = air;
        const appDir = File.applicationDirectory;
        const appStorageDir = File.applicationStorageDirectory;

        const dest = appStorageDir.resolvePath(this.m_staticDir);
        if (!dest.exists) {
            appDir.resolvePath(this.m_staticDir).copyTo(dest);
        }
    }

    _debug_log(msg) {
        if (this.m_debug) {
            air.trace(`[WebServer]: ${msg}`);
        }
    }
}
