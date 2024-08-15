// TODO: Implement an express fork using air apis

const mimeTypeMap = {
    '.txt'  : 'text/plain',
    '.css'  : 'text/css',
    '.gif'  : 'image/gif',
    '.htm'  : 'text/html',
    '.html' : 'text/html',
    '.ttf'  : 'font/ttf',
    '.woff' : 'font/woff',
    '.woff2': 'font/woff2',
    '.ico'  : 'image/x-icon',
    '.jpg'  : 'image/jpeg',
    '.png'  : 'image/png',
    '.svg'  : 'image/svg+xml',
    '.js'   : 'text/javascript',
    '.json' : 'application/json',
};

class HttpHeaders {
    /**
     * @param {string[]} lines
     */
    constructor(lines) {
        /** @type {Record<string, string | string[]>} */
        this._headers = {};

        lines.forEach(line => {
            const [key, value] = line.split(": ");
            const values = value.split(";").map(e => e.trim());

            this.add(key.toLowerCase(), values.length > 1 ? values : values[0]);
        })
    }

    add(key, value) {
        this._headers[key.toLowerCase()] = value;
    }

    get(key) {
        return this._headers[key.toLowerCase()];
    }

    get headers() {
        return {...this._headers};
    }
}

// TODO: Implement a proper http request parser
class HttpRequest {
    /**
     * @param {string} raw
     */
    constructor(raw) {
        this._request = null;

        this._parse(raw);
    }

    get method() {
        return this._request?.method;
    }

    get path() {
        return this._request?.url.path;
    }

    get fullpath() {
        return this._request?.fullpath;
    }

    get params() {
        return this._request?.url.params;
    }

    get protocol() {
        return this._request?.protocol;
    }

    get headers() {
        return this._request?.headers;
    }

    get(header) {
        return this._request?.headers.get(header);
    }

    get body() {
        return this._request?.body;
    }

    _parseUrl(url) {
        const [pathWithParams, hash] = url.split("#");
        const [path, paramString] = pathWithParams.split("?");

        const params = {};
        if (paramString) {
            paramString.split("&").forEach(param => {
                const [key, value] = param.split("=");
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            });
        }

        return {
            path: decodeURIComponent(path),
            params,
            hash: hash ? decodeURIComponent(hash) : null
        };
    }

    _parse(raw) {
        const lines = raw.split("\r\n");

        if (lines.length > 0) {
            const [requestLine, ...headerLines] = lines;

            const [method, fullpath, version] = requestLine.split(" ");

            const headers = [];
            let body = "";
            let isBody = false;

            headerLines.forEach(line => {
                if (line === "") {
                    isBody = true;
                } else if (isBody) {
                    body += line;
                } else {
                    headers.push(line);
                }
            });

            this._request = {
                method,
                fullpath,
                url: this._parseUrl(fullpath),
                version,
                headers: new HttpHeaders(headers),
                body,
            };
        }
    }
}

class WebRequestHandler {
    constructor(connection, staticDir) {
        this.m_clientSocket = connection.socket;
        this.m_staticDir = staticDir;

        this.m_clientSocket.addEventListener(air.ProgressEvent.SOCKET_DATA, () => this._onIncoming());
        this.m_clientSocket.addEventListener(air.OutputProgressEvent.OUTPUT_PROGRESS, () => this._onOutGoing());

        this.m_clientSocket.addEventListener(air.Event.CLOSE, () => this._onClientSocketClose());

        this.m_debug = true;
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

        const req = new HttpRequest(bodyStr);

        this._debug_log(`${req.method}: ${req.fullpath}${(() => {
            if (Object.keys(req.params).length > 0) {
                return '\n' + JSON.stringify(req.params);
            }
            return '';
        })()}`);

        switch (req.path) {
            case "/action": {
                this._handleApiRequest(req.params);
                break;
            }
            default: {
                let path = req.path;
                if (path === "/") { path = "/index.html" }
                this._handleStaticFileRequest(path);
                break;
            }
        }
    }

    _getContentType(filename) {
        const ext = filename.lastIndexOf(".");

        if (ext !== -1) {
            return mimeTypeMap[filename.substring(ext)];
        }

        return mimeTypeMap['.txt'];
    }

    _handleStaticFileRequest(path) {
        const clientSocket = this.m_clientSocket;

        const { File } = air;
        const appStorageDir = File.applicationStorageDirectory;

        const fxp = appStorageDir.resolvePath(this.m_staticDir + path);

        // this._debug_log(`Serving static file: ${fxp.nativePath} | ${fxp.exists}`);

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

    _sendJSON(data = {}) {
        const clientSocket = this.m_clientSocket;

        clientSocket.writeUTFBytes("HTTP/1.1 200 OK\n");
        clientSocket.writeUTFBytes(`Content-Type: ${mimeTypeMap['.json']}\n\n`);
        clientSocket.writeUTFBytes(JSON.stringify(data));
        clientSocket.flush();
    }

    _handleApiRequest({ data }) {
        const {cmd, ...args} = JSON.parse(atob(data));

        this._debug_log(`Command<${cmd}>: ${JSON.stringify(args, null, 2)}`);

        switch (parseInt(cmd)) {
            // NEW COMMANDS

            // Menu: Blank
            case 15: {
                $RvW.webEngineObj.blankPresentation();
                this._sendJSON({
                    ok: true,
                    data: 'Blank activated',
                });
                break;
            }
            // Menu: Logo
            case 14: {
                $RvW.webEngineObj.logoPresentation();
                this._sendJSON({
                    ok: true,
                    data: "Logo Activated",
                });
                break;
            }
            // Menu: Close
            case 4: {
                $RvW.webEngineObj.closePresentation();
                this._sendJSON({
                    ok: true,
                    data: "Close Activated",
                });
                break;
            }
            // Menu: Previous Verse/Slide
            case 3: {
                $RvW.webEngineObj.prevSlide();
                this._sendJSON({
                    ok: true,
                    data: "Previous Slide OK..",
                });
                break;
            }
            // Menu: Next Verse/Slide
            case 2: {
                $RvW.webEngineObj.nextSlide();
                this._sendJSON({
                    ok: true,
                    data: "Next slide OK..",
                });
                break;
            }

            // Bible Ref : Search Chapter
            case 7: {
                if ($RvW.bibleRefObj.init(args.ref)) {
                    const font = $RvW.bibleRefObj.getVerseFont();
                    const book = $RvW.bibleRefObj.getBook();
                    const chapter = $RvW.bibleRefObj.getChapter();
                    const verses = getAllVersesFromChapter(book, chapter - 1);

                    this._sendJSON({
                        ok: true,
                        data: {
                            verses,
                            book,
                            font,
                            chapter,
                        }
                    });
                } else {
                    this._sendJSON(({
                        ok: false,
                        error: $RvW.bibleRefObj.getErrorMessage()
                    }));
                }

                break;
            }
            // Bible Ref : Present Verse
            case 8: {
                const [book, chapter, verse] = args.ref;

                // convert to indexes
                $RvW.present_external(book - 1, chapter - 1, verse - 1);

                this._sendJSON({
                    ok: true,
                    data: 'Presenting verse...'
                });

                break;
            }

            // Songs: Search
            case 20: {
                $RvW.songManagerObj.getAllTitlesForWeb(args.query, (err, res) => {
                    if (err) {
                        this._sendJSON({
                            ok: false,
                            error: err,
                        });
                    } else {
                        air.trace(JSON.stringify(res));

                        this._sendJSON({
                            ok: true,
                            data: res,
                        });
                    }
                });

                break;
            }
            // Songs: Get Content
            case 21: {
                const song = $RvW.songManagerObj.getSongObjWithID(args.id);

                this._sendJSON({
                    ok: true,
                    data: {
                        id: song.id,
                        name: song.name,
                        font: song.font,
                        font2: song.font2,
                        slides: song.slides,
                        slides2: song.slides2,
                    },
                });

                break;
            }
            // Songs: Add to Schedule
            case 22: {
                $RvW.scheduleObj.processAddSong(args.id);

                this._sendJSON({
                    ok: true,
                    data: 'Song added to schedule...',
                });
                break;
            }
            // Songs: Present Slide
            case 17: { // Present Song Slide
                const song = $RvW.songManagerObj.getSongObjWithID(args.id);
                air.trace('Song: ' + JSON.stringify(song));
                const spo = new songPresentObj();
                spo.init(song);
                spo.present(args.index);

                this._sendJSON({
                    ok: true,
                    data: 'Presenting song slide...'
                });
                break;
            }

            // Schedule: Fetch
            case 30: {
                const res = $RvW.scheduleObj.getScheduleList(0 /* All */);

                this._sendJSON({
                    ok: true,
                    data: res,
                });
                break;
            }
            // Schedule: Get Content
            case 31: { // Only for lyrics
                const songId = $RvW.scheduleObj.getSongIndexFromSch(args.index);
                const song = $RvW.songManagerObj.getSongObjWithID(songId);

                this._sendJSON({
                    ok: true,
                    data: {
                        id: song.id,
                        name: song.name,
                        font: song.font,
                        font2: song.font2,
                        slides: song.slides,
                        slides2: song.slides2,
                    },
                });
                break;
            }

            default: {
                this._debug_log(`Unknown command: ${cmd}`);
                break;
            }

            // OLD COMMANDS
            case "1": { // Present Bible Verse
                if ($RvW.bibleRefObj.init(cmd_arg1)) {
                    $RvW.bibleRefObj.present();
                    this._sendTextHtml("Presenting verse...");
                } else {
                    this._sendTextHtml($RvW.bibleRefObj.getErrorMessage());
                }
                break;
            }
            case "13": { // Theme Slide
                $RvW.webEngineObj.themePresentation();
                this._sendTextHtml("Theme Activated");
                break;
            }
            case "10": { // Present Schedule
                $RvW.scheduleObj.processRemotePresent(cmd_arg1);
                this._sendTextHtml("Presenting from Schedule");
                break;
            }
            case "7": { // Present Bible Chapter
                if ($RvW.bibleRefObj.init(cmd_arg1)) {
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
            case "9": { // Get Stage View Content
                this._sendTextHtml($RvW.webEngineObj.stageViewContent());
                break;
            }
            case "19": { // Get Chat Keywords
                this._sendTextHtml("19<command>" + $RvW.vvchatQObj.getKeywords());
                break;
            }
            case "11": { // Send Chat Message
                this._sendTextHtml("11<command>" + $RvW.vvchatQObj.getMsgFromID(cmd_arg1));
                break;
            }
            case "12": { // Add Chat Message
                const msgXY = cmd_arg1.split("|");
                $RvW.vvchatQObj.addMsg(msgXY[0], msgXY[1]);
                this._sendTextHtml("12<command>Mission Accomplished");
                break;
            }
            case "20": { // Get Chords
                const cwi = new ChordsWebInterface(cmd_arg1);
                this._sendTextHtml(cwi.getsong());
                break;
            }
        }
    }

    getPathValue(urlPath) {
        let b = urlPath.split("\n");
        b = b[0].split("?");
        b = b[1].split("&");

        const action = b[0].split("=")[1];

        let arg1 = b[1].split("=")[1];
        arg1 = arg1.replace(/%20/g, " ");

        let arg2 = null;
        if (b[2] != null) {
            arg2 = b[2].split("=")[1];
            arg2 = arg2.replace(/%20/g, " ");
        }

        return [action, arg1, arg2];
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
