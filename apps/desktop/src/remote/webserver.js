// TODO: Implement an express fork using air apis

import {SongPresenter} from "@/song/present";
import {getAllVersesFromChapter} from "@/bible/manager";
import {$RvW} from "@/rvw";

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
    '.bin'  : 'application/octet-stream',
};

const CRLF = '\r\n';
const WS_PORT = 26302;

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
        const lines = raw.split(CRLF);

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
    constructor(connection, staticDir, ws) {
        this._ws = ws;
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

        // apply url normalization
        const pathSegments = req.path.split('/').filter(e => !!e.trim());

        if (pathSegments[0] === 'api') {
            this._handleApi(
                '/' + pathSegments.slice(1).join('/'),
                req.params,
            );
        } else {
            this._handleStatic(
                '/' + (pathSegments.join('/') || 'index.html')
            );
        }
    }

    _getContentType(filename) {
        const ext = filename.lastIndexOf(".");

        if (ext !== -1) {
            return mimeTypeMap[filename.substring(ext)];
        }

        return mimeTypeMap['.bin'];
    }

    _writeLine(socket, data = '') {
        socket.writeUTFBytes(data + CRLF);
    }

    _writeHeader(socket, key, value) {
        this._writeLine(socket, `${key}: ${value}`);
    }

    _handleStatic(path) {
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
            this._writeLine(clientSocket, "HTTP/1.1 200 OK");
            this._writeHeader(clientSocket, "Content-Type", this._getContentType(path));

            // DEV: {
            //     if (this._getContentType(path) === 'text/html') {
            //         this._writeHeader(clientSocket, "Access-Control-Allow-Origin", '*');
            //     }
            //     break DEV;
            // }

            this._writeLine(clientSocket);
            clientSocket.writeBytes(fileDat);
            clientSocket.flush();
        } else {
            this._writeLine(clientSocket, "HTTP/1.1 404 Not Found");
            this._writeHeader(clientSocket, "Content-Type", mimeTypeMap['.txt']);
            this._writeLine(clientSocket);
            clientSocket.flush();
        }
    }

    _sendText(text) {
        const clientSocket = this.m_clientSocket;

        if (text != null) {
            this._writeLine(clientSocket, "HTTP/1.1 200 OK");
            this._writeHeader(clientSocket, "Content-Type", mimeTypeMap['.txt']);
            // this._writeHeader(clientSocket, "Content-Length", text.length);
            this._writeLine(clientSocket);
            clientSocket.writeUTFBytes(text);
            clientSocket.flush();
        }
    }

    _sendJSON(data = {}) {
        const clientSocket = this.m_clientSocket;
        const json = JSON.stringify(data);

        this._writeLine(clientSocket, "HTTP/1.1 200 OK");
        this._writeHeader(clientSocket, "Content-Type", mimeTypeMap['.json']);
        // this._writeHeader(clientSocket, "Content-Length", json.length);
        this._writeLine(clientSocket);
        clientSocket.writeUTFBytes(json);
        clientSocket.flush();
    }

    _notFound() {
        const clientSocket = this.m_clientSocket;

        this._writeLine(clientSocket, "HTTP/1.1 404 Not Found");
        this._writeHeader(clientSocket, "Content-Type", mimeTypeMap['.txt']);
        this._writeLine(clientSocket);

        clientSocket.flush();
    }

    _handleApi(path, { data }) {
        if (path !== '/action') {
            this._debug_log(`Invalid URI: ${path}`);
            this._notFound();
            return;
        }

        const {cmd, ...args} = JSON.parse(atob(data));

        this._debug_log(`Command<${cmd}>: ${JSON.stringify(args, null, 2)}`);

        switch (parseInt(cmd)) {
            // NEW COMMANDS

            // Menu: Blank
            case 15: {
                $RvW.webEngineObj.blankPresentation();
                this._ws.sendALL(JSON.stringify({msg: 'Blank activated'}));
                this._sendJSON({
                    ok: true,
                    data: 'Blank activated',
                });
                break;
            }
            // Menu: Logo
            case 14: {
                $RvW.webEngineObj.logoPresentation();
                this._ws.sendALL(JSON.stringify({msg: 'Logo Activated'}));
                this._sendJSON({
                    ok: true,
                    data: "Logo Activated",
                });
                break;
            }
            // Menu: Close
            case 4: {
                $RvW.webEngineObj.closePresentation();
                this._ws.sendALL(JSON.stringify({msg: 'Close Activated'}));
                this._sendJSON({
                    ok: true,
                    data: "Close Activated",
                });
                break;
            }
            // Menu: Previous Verse/Slide
            case 3: {
                $RvW.webEngineObj.prevSlide();
                this._ws.sendALL(JSON.stringify({msg: 'Previous Slide'}));
                this._sendJSON({
                    ok: true,
                    data: "Previous Slide OK..",
                });
                break;
            }
            // Menu: Next Verse/Slide
            case 2: {
                $RvW.webEngineObj.nextSlide();
                this._ws.sendALL(JSON.stringify({msg: 'Next Slide'}));
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
                const spo = new SongPresenter();
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

            // Stage View: Get Content (9)
            case 9: {
                const res = $RvW.webEngineObj.stageViewContent() || "";

                air.trace('Stage View: ' + JSON.stringify(res));

                const [
                    title,
                    font1,
                    font2,
                    content1 = '',
                    content2= '',
                ] = res.split('<newelement>');

                this._sendJSON({
                    ok: true,
                    data: {
                        title,
                        font1,
                        font2,
                        content1,
                        content2,
                    },
                });

                break;
            }
            // Stage View: Get Settings (10)
            case 10: {
                this._sendJSON({
                    ok: true,
                    data: {
                        // TODO: load from settings
                        StageGreenScreen: false,
                        StageShowTime: false,
                        StageAlertMessage: '',
                    },
                });

                break;
            }
            // WebSockets: Get Config
            case 89: {
                this._sendJSON({
                    ok: true,
                    data: {
                        port: WS_PORT,
                    },
                });

                break;
            }

            default: {
                this._debug_log(`Unknown command: ${cmd}`);
                this._sendJSON({
                    ok: false,
                    error: `Unknown command: ${cmd}`
                });
                break;
            }
        }
    }

    _debug_log(msg) {
        if (this.m_debug) {
            air.trace(`[WebRequestHandler]: ${msg}`);
        }
    }
}

class WebSocketHandler {
    constructor(server) {
        this._server = server;
        this._debug = false;
    }

    init() {
        const { ServerEvent, ClientEvent } = window.runtime.air.net.websockets.events;

        this._server.addEventListener(
            ServerEvent.SERVER_BOUND_SUCCESS, (e) => this._onServerIsReady(e));
        this._server.addEventListener(
            ClientEvent.CLIENT_CONNECT_EVENT, (e) => this._onClientConnect(e));
        this._server.addEventListener(
            ClientEvent.CLIENT_MESSAGE_EVENT, (e) => this._onClientMessage(e));
        this._server.addEventListener(
            ClientEvent.CLIENT_DISCONNECT_EVENT, (e) => this._onClientDisconnect(e));
    }

    _debug_log(...msg) {
        if (this._debug_log) {
            air.trace(`[WebSocketHandler]: `, ...msg);
        }
    }

    _onServerIsReady(e) {
        this._debug_log("Ready!");
    }

    _onClientConnect(e) {
        this._debug_log("Connected: ", `${e.socket.remoteAddress}:${e.socket.remotePort}`);
    }

    _onClientMessage(e) {
        const location = this._server.getClientKeyBySocket(e.socket);
        this._debug_log("Client message from ", location, e.msg);
    }

    _onClientDisconnect(e) {
        this._debug_log("Disconnected: ", `${e.socket.remoteAddress}:${e.socket.remotePort}`);
    }
}

export class WebServer {
    constructor(staticDir) {
        this.m_port = null;
        this.m_hostname = null;

        this.m_serverSocket = null;
        this.m_serverWebSocket = null;
        this.m_listening = false;
        this.m_staticDir = staticDir;
    }

    init(port, hostname) {
        this.m_port = port;
        this.m_hostname = hostname;

        this._ensure_serving_dir();

        if (this.m_listening === false) {
            this._startListening();
            if (this.m_serverSocket.listening && this.m_serverWebSocket.listening) {
                this.m_listening = true;
                return true;
            } else {
                this.m_serverSocket.close();
                this.m_serverWebSocket.close();
                alert("Remote VerseVIEW failed to initialize.");
                return false;
            }
        } else {
            this.m_listening = false;
            this.m_serverSocket.close();
            this.m_serverWebSocket.close();
            return true;
        }
    }

    stop() {
        if (this.isActive()) {
            try {
                if (this.m_serverSocket.listening) this.m_serverSocket.close();
                // if (this.m_serverWebSocket.listening) this.m_serverWebSocket.close();
            } catch (e) {
                // FIXME: crashes when there is an active client connected to the ws server
                air.trace(e);
            }
            this.m_listening = false;
        }
    }

    isActive() {
        return this.m_listening;
    }

    _startListening() {
        if (!this.m_serverWebSocket || !this.m_serverWebSocket.listening) {
            const { WebSocketServer } = window.runtime.air.net.websockets;

            this.m_serverWebSocket = new WebSocketServer();
            this.m_serverWebSocket.attemptBind(WS_PORT, this.m_hostname);

            this.m_serverWebSocket_ = new WebSocketHandler(this.m_serverWebSocket);
            this.m_serverWebSocket_.init();
        }

        {
            this.m_serverSocket = new air.ServerSocket();
            this.m_serverSocket.addEventListener(air.Event.CONNECT, (connection) => {
                new WebRequestHandler(connection, this.m_staticDir, this.m_serverWebSocket);
            });
            this.m_serverSocket.bind(this.m_port, this.m_hostname);
            this.m_serverSocket.listen();
        }
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
}
