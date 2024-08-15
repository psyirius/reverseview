function getNetworkInterfaceList() {
    const { NetworkInfo } = air;

    if (!NetworkInfo.isSupported) {
        throw new Error('NetworkInfo is not supported');
    }

    const interfaces = NetworkInfo.networkInfo.findInterfaces();

    const result = [];

    for (const nwi of interfaces) {
        const item = {};

        item['guid'] = nwi.name;
        item['name'] = nwi.displayName;
        item['active'] = nwi.active;
        item['macaddr'] = nwi.hardwareAddress;

        const addresses = [];
        for (const addr of nwi.addresses) {
            addresses.push([addr.ipVersion, addr.address]);
        }
        item['addresses'] = addresses;

        result.push(item);
    }

    return result;
}

// Remove Control Panel
function getAvailableNwIpList() {
    return getNetworkInterfaceList()
        .filter(e => e.active)
        .map(e => e.addresses
            .filter(([v, _]) => (v === 'IPv4'))
            .map(([_, a]) => a)[0]
        )
}

class RvwRemote {
    constructor(bodyContent) {
        this.configure = configure;
        this.show = show;

        let _panel = null;
        let m_body = bodyContent;
        const m_msgHints = [];
        let m_hostname = "";
        let m_port = "";
        let m_customHostName = "";
        let portNumber = 50000;
        let ipList = null;
        const m_debug = false;

        _setupUI();
        _setupHints();
        e();

        function _setupUI() {
            _panel = new YAHOO.widget.Panel("panelObj3", {
                width: "700px",
                fixedcenter: true,
                modal: true,
                visible: false,
                constraintoviewport: true,
            });
            _panel.render(document.body);
            _panel.setHeader("Remote VerseVIEW");
            _panel.setBody(m_body);
            _panel.hide();
            _panel.bringToTop();
        }

        function _setupHints() {
            m_msgHints[0] = "Use IP address 127.0.0.1 if VerseVIEW and live stream software on the same computer. <br> Use the other IP address if remote access is required with multiple computers and devices";
            m_msgHints[1] = "Enable this port numer with the firewall software";
            m_msgHints[2] = "Messenger feature can be used to easily communicate between choir team members";
            m_msgHints[3] = "The full address is displayed in the text box and the QR code";
            m_msgHints[4] = "Enter the host name of the computer and toggle the Use Host name field";
        }

        function m(index) {
            $("#remoteVVHint").html(m_msgHints[index]);
        }

        function configure() {
            n();
            x();
        }

        function x() {
            document
                .getElementById("saveRemoteVVSettings")
                .addEventListener("click", _onEnable);

            document
                .getElementById("updateFixedWords")
                .addEventListener("click", function () {
                    const B = document.getElementById("fixedWordList").value;
                    $RvW.vvchatQObj.updateFixedWords(B);
                });

            $("#configRemoteCopy").click(function () {
                const { Clipboard, ClipboardFormats } = air;

                const remoteLink = $("#configRemoteLink").val();
                Clipboard.generalClipboard.clear();
                Clipboard.generalClipboard.setData(ClipboardFormats.TEXT_FORMAT, remoteLink);
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
                const B = $("#remoteVVUseHostname").is(":checked");
                if (B) {
                    if (m_hostname === "127.0.0.1") {
                        m_customHostName = "localhost";
                    } else {
                        m_customHostName = $("#configRemoteHostname").val();
                        $RvW.vvConfigObj.set_myhostname(m_customHostName);
                        $RvW.vvConfigObj.save();
                    }
                } else {
                    m_customHostName = "";
                }
                _genLink();
            });
        }

        function show() {
            _panel.show();
            _panel.bringToTop();
        }

        function hide() {
            _panel.hide();
        }

        function n() {
            clearSelectList("configIPaddr");

            ipList = getAvailableNwIpList();
            const numIps = ipList.length;

            for (let i = 0; i < numIps; i++) {
                document.getElementById("configIPaddr").options[i] = new Option(ipList[i], String(i));
            }

            document.getElementById("configIPaddr").selectedIndex = 0;

            if (numIps === 0) {
                document.getElementById("configIPaddr").disabled = true;
                document.getElementById("configRemotePort").disabled = true;
                document.getElementById("saveRemoteVVSettings").disabled = true;
            }
        }

        function _getSelectedIp() {
            const B = document.getElementById("configIPaddr").selectedIndex;
            if (B != null) {
                return ipList[B];
            } else {
                return false;
            }
        }

        function _onEnable() {
            let _port = 50000;
            let _ipAddr = null;
            if ($RvW.webServerObj.isActive() === false) {
                _port = document.getElementById("configRemotePort").value;
                _ipAddr = _getSelectedIp();
                if (IsNumeric(_port)) {
                    if (withinRange(49152, 65535, _port)) {
                        portNumber = _port;
                        const B = $RvW.webServerObj.init(portNumber, _ipAddr);
                        if (B) {
                            _setBtnLabel("DISABLE");
                            document.getElementById("configRemotePort").disabled = true;
                            document.getElementById("configIPaddr").disabled = true;
                            if (_ipAddr != null) {
                                if (_ipAddr.indexOf(":") > -1) {
                                    _ipAddr = "[" + _ipAddr + "]";
                                }
                                m_hostname = _ipAddr;
                                m_port = portNumber;
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
                $RvW.webServerObj.init(portNumber);
                _setBtnLabel("ENABLE");
                document.getElementById("configRemotePort").disabled = false;
                document.getElementById("configIPaddr").disabled = false;
                e();
            }
        }

        function e() {
            m_customHostName = $RvW.vvConfigObj.get_myhostname();
            $("#configRemoteHostname").val(m_customHostName);
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
            _genLink();
            $("#remoteLinkList").show();
            $("#qrcode").show();
            $("#configRemoteLink").show();
            $("#configRemoteCopy").show();
        }

        function _genLink() {
            let hostname = m_hostname;
            const useLocalHost = $("#remoteVVUseHostname").is(":checked");

            if (useLocalHost) {
                if (m_hostname === "127.0.0.1") {
                    hostname = "localhost";
                } else {
                    if (m_customHostName !== "") {
                        hostname = m_customHostName;
                    }
                }
            }

            let remoteUrl = `http://${hostname}:${m_port}`;

            // TODO: make it auto-generated on build
            switch (parseInt($("#remoteVVRemoteFunc").val())) {
                default:        remoteUrl += `/404.html`;                       break;
                case 1:         remoteUrl += `/control.html`;                   break;
                case 2:         remoteUrl += `/stageview/fullscreen1/c.html`;   break;
                case 3:         remoteUrl += `/stageview/fullscreen2/c.html`;   break;
                case 4:         remoteUrl += `/lowerthird/theme6/a/a.html`;     break;
                case 5:         remoteUrl += `/lowerthird/theme6/b/b.html`;     break;
                case 6:         remoteUrl += `/lowerthird/theme6/c/c.html`;     break;
                case 7:         remoteUrl += `/lowerthird/theme6/d/d.html`;     break;
                case 8:         remoteUrl += `/lowerthird/theme6/e/e.html`;     break;
                case 9:         remoteUrl += `/lowerthird/theme6/e2/e.html`;    break;
                case 10:        remoteUrl += `/lowerthird/theme6/g/g.html`;     break;
            }

            $("#configRemoteLink").val(remoteUrl);
            $("#qrcode").html("");

            new QRCode(document.getElementById("qrcode"), remoteUrl);
        }

        function _setBtnLabel(B) {
            $("#saveRemoteVVSettings").html(B);
        }

        function y() {
            if ($("#fixedWordListDiv").is(":hidden")) {
                $("#fixedWordListDiv").show();
                _setKeywordsLabel("Hide Messenger Keywords");
            } else {
                $("#fixedWordListDiv").hide();
                _setKeywordsLabel("Show Messenger Keywords");
            }
        }

        function _setKeywordsLabel(B) {
            $("#remoteVVShowKeywords").html(B);
        }

        function _debug_log(msg) {
            if (m_debug) {
                air.trace("[RemoteUI]: " + msg);
            }
        }
    }
}
