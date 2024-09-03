import {IsNumeric, withinRange} from "@app/common";
import {showRemotePanel, localIpList} from "@stores/global";
import {mount as mountRemoteSetupDialog} from "@app/ui/RemoteSetupDialog";
import {$RvW} from "@/rvw";

export function getAvailableNwIpList() {
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

    return getNetworkInterfaceList()
        .filter(e => e.active)
        .map(e => e.addresses
            .filter(([v, _]) => (v === 'IPv4'))
            .map(([_, a]) => a)[0]
        )
}

const INNER_HTML = `
<div class="ui form container segment">
    <div id="generalPanelDIV_delete" class="ui grid remoteVVDIV">
        <!-- LEFT COLUMN -->
        <div class="seven wide column">
            <div class="form-group row field">
                <label>IP Address</label>
                <select name="select" class="form-control" id="configIPaddr">
                </select>
            </div>

            <div class="form-group row field">
                <label>Port</label>
                <div class="ui grid">
                    <div class="six wide column" data-tooltip="Select Port (49152 to 65535)"
                        data-position="right center" data-variation="basic small">
                        <input type="text" class="form-control form-control-sm" id="configRemotePort" value="50000"
                            placeholder="Enter Port Number">
                    </div>
                    <div class="ten wide column">
                        <button class="ui primary button" id="saveRemoteVVSettings" data-tooltip="Enable/Disable Remote"
                            data-position="right center" data-variation="basic small">ENABLE</button>
                    </div>
                </div>
            </div>

            <div class="form-group row field" id="remote-custom-hostname">
                <label>Enter Hostname</label>
                <div class="ui grid" data-tooltip="Enter hostname of the computer" data-position="right center" data-variation="basic small">
                    <div class="six wide column">
                        <input type="text" class="form-control form-control-sm" id="configRemoteHostname">
                    </div>

                    <div class="ten wide column field">
                        <div class="inline field">
                            <div class="ui toggle checkbox">
                                <input type="checkbox" tabindex="0" id="remoteVVUseHostname"> 
                                <label>Use Hostname</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="two wide column"></div>

        <!-- RIGHT COLUMN -->
        <div class="seven wide column">
            <div class="form-group row field">
                <span id="remoteVVStatus">Remote VerseVIEW Disabled</span>
            </div>

            <div class="form-group row field" id="remoteLinkList">
                <label>Remote Link</label>
                <div data-tooltip="Select the remote function for the corresponding QR code and link"
                    data-position="bottom right" data-variation="basic small">
                    <select name="select" class="form-control" id="remoteVVRemoteFunc">
                        <option value="1">Control</option>
                        <option value="2">Stageview 1</option>
                        <option value="3">Stageview 2</option>
                        <option value="4">Stageview 3</option>
                        <option value="5">Stage 1</option>
                        <option value="6">Stage 2</option>
                        <option value="7">Stage 3</option>
                        <option value="8">Stage 4</option>
                        <option value="9">Lower Third A Primary</option>
                        <option value="10">Lower Third A Secondary</option>
                        <option value="11">Lower Third B</option>
                        <option value="12">Lower Third C</option>
                        <option value="13">Lower Third C1</option>
                        <option value="14">Lower Third D</option>
                        <option value="15">Lower Third D2</option>
                        <option value="16">Lower Third E2</option>
                        <option value="17">Lower Third G</option>
                        <option value="18">Lower Third G2</option>
                        <option value="19">Lower Third H</option>
                        <option value="20">Lower Third Arabic</option>
                    </select>
                </div>
            </div>

            <div class="form-group row field">
                <div id="qrcode"></div>
            </div>

            <div class="form-group row field">
                <div class="ui grid">
                    <div class="ten wide column">
                        <input type="text" class="form-control form-control-sm" id="configRemoteLink" value=""
                            placeholder="Link to remote">
                    </div>
                    <div class="four wide column">
                        <button
                            class="ui primary button"
                            id="configRemoteCopy"
                            data-tooltip="Copy remote link to clipboard"
                            data-position="left center"
                            data-variation="basic small">COPY</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

export class RemoteSetupUIPanel {
    constructor() {
        this.configure = configure;
        this.show = show;

        let _panel = null;
        let m_body = INNER_HTML;
        let m_hostname = "";
        let m_port = "";
        let m_customHostName = null;
        let portNumber = 50000;
        let ipList = null;
        const m_debug = false;

        _setupUI();
        _updateInactiveStatus();

        // mountRemoteSetupDialog('modals');
        
        localIpList.set([
            ...getAvailableNwIpList(),
            '0.0.0.0',
        ]);

        function _setupUI() {
            _panel = new $Y.Panel({
                headerContent   : 'Remote',
                bodyContent     : m_body,
                width           : '60%',
                height          : 'auto',
                zIndex          : 100,
                centered        : true,
                modal           : true,
                visible         : false, // make visible explicitly with .show()
            });
            _panel.render(document.body);

            _panel.on('visibleChange', function (e) {
                showRemotePanel.set(e.newVal);
            });
        }

        function configure() {
            _setupIpList();
            _setupEvents();
        }

        function _setupEvents() {
            document
                .getElementById("saveRemoteVVSettings")
                .addEventListener("click", _onEnable);

            $("#configRemoteCopy").click(function () {
                const { Clipboard, ClipboardFormats } = air;

                const remoteLink = $("#configRemoteLink").val();
                Clipboard.generalClipboard.clear();
                Clipboard.generalClipboard.setData(ClipboardFormats.TEXT_FORMAT, remoteLink);
            });

            $("#remoteVVRemoteFunc").change(function () {
                _updateRemoteDetailsEnabled();
            });

            $("#remoteVVUseHostname").change(function () {
                const B = $("#remoteVVUseHostname").is(":checked");

                if (B) {
                    if (m_hostname === "127.0.0.1" || m_hostname === '0.0.0.0') {
                        m_customHostName = "localhost";
                    } else {
                        m_customHostName = $("#configRemoteHostname").val();
                        $RvW.vvConfigObj.set_myhostname(m_customHostName);
                        $RvW.vvConfigObj.save();
                    }
                } else {
                    m_customHostName = null;
                }

                _genLink();
            });
        }

        function show() {
            _panel.show();
        }

        function hide() {
            _panel.hide();
        }

        function _setupIpList() {
            /** @type {HTMLSelectElement} */
            const ipListSelect = document.getElementById('configIPaddr');

            // clear the list
            ipListSelect.innerHTML = ""

            ipList = localIpList.get();
            ipList.reverse();

            ipList.forEach((ip, i) => {
                ipListSelect.options[i] = new Option(ip, String(i));
            });

            ipListSelect.selectedIndex = 0;

            if (ipList.length === 0) {
                ipListSelect.disabled = true;
                document.getElementById("configRemotePort").disabled = true;
                document.getElementById("saveRemoteVVSettings").disabled = true;
            }
        }

        function _getSelectedIp() {
            const { selectedIndex } = document.getElementById("configIPaddr");

            if (selectedIndex != null) {
                return ipList[selectedIndex];
            } else {
                return false;
            }
        }

        function _onEnable() {
            let _port = 50000;
            let _ipAddr = null;

            if (!$RvW.webServerObj.isActive()) {
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
                                    _ipAddr = `[${_ipAddr}]`;
                                }
                                m_hostname = _ipAddr;
                                m_port = portNumber;
                                _updateRemoteDetailsEnabled();
                            } else {
                                _updateInactiveStatus();
                            }
                        } else {
                            _updateInactiveStatus();
                        }
                    } else {
                        Toast.show(
                            "Remote VerseVIEW",
                            "Port Number: Out of Range. Valid range is 49152 to 65535."
                        );
                        document.getElementById("configRemotePort").value = portNumber;
                        _updateInactiveStatus();
                    }
                } else {
                    Toast.show(
                        "Remote VerseVIEW",
                        "Invalid Port Number. Valid range is 49152 to 65535."
                    );
                    document.getElementById("configRemotePort").value = portNumber;
                    _updateInactiveStatus();
                }
            } else {
                $RvW.webServerObj.stop();
                _setBtnLabel("ENABLE");
                document.getElementById("configRemotePort").disabled = false;
                document.getElementById("configIPaddr").disabled = false;
                _updateInactiveStatus();
            }
        }

        function _updateInactiveStatus() {
            m_customHostName = $RvW.vvConfigObj.get_myhostname();
            $("#configRemoteHostname").val(m_customHostName);
            document.getElementById("remoteVVStatus").innerHTML = "Remote is DISABLED";
            $("#remoteLinkList").hide();
            $("#qrcode").hide();
            $("#configRemoteLink").hide();
            $("#configRemoteCopy").hide();
        }

        function _updateRemoteDetailsEnabled() {
            document.getElementById("remoteVVStatus").innerHTML = "Remote is ENABLED";
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
                if (m_hostname === "127.0.0.1" || m_hostname === "0.0.0.0") {
                    hostname = "localhost";
                } else if (!!m_customHostName) {
                    hostname = m_customHostName;
                }
            }

            let remoteUrl = `http://${hostname}:${m_port}`;

            // TODO: make it auto-generated on build
            switch (parseInt($("#remoteVVRemoteFunc").val())) {
                default:        remoteUrl += `/404.html`;                       break;

                case 1:         remoteUrl += `/control.html`;                   break;

                case 2:         remoteUrl += `/stageview/fullscreen1/c.html`;   break;
                case 3:         remoteUrl += `/stageview/fullscreen2/c.html`;   break;
                case 4:         remoteUrl += `/stageview/fullscreen3/c.html`;   break;

                case 5:         remoteUrl += `/stageview/stage/c.html`;         break;
                case 6:         remoteUrl += `/stageview/stage2/c.html`;        break;
                case 7:         remoteUrl += `/stageview/stage3/c.html`;        break;
                case 8:         remoteUrl += `/stageview/stage4/c.html`;        break;

                case 9:         remoteUrl += `/lowerthird/theme6/a/a.html`;     break;
                case 10:        remoteUrl += `/lowerthird/theme6/a2/a.html`;    break;
                case 11:        remoteUrl += `/lowerthird/theme6/b/b.html`;     break;
                case 12:        remoteUrl += `/lowerthird/theme6/c/c.html`;     break;
                case 13:        remoteUrl += `/lowerthird/theme6/c1/c.html`;    break;
                case 14:        remoteUrl += `/lowerthird/theme6/d/d.html`;     break;
                case 15:        remoteUrl += `/lowerthird/theme6/d2/d.html`;    break;
                case 16:        remoteUrl += `/lowerthird/theme6/e2/e.html`;    break;
                case 17:        remoteUrl += `/lowerthird/theme6/g/g.html`;     break;
                case 18:        remoteUrl += `/lowerthird/theme6/g2/g.html`;    break;
                case 19:        remoteUrl += `/lowerthird/theme6/h1/h.html`;    break;
                case 20:        remoteUrl += `/lowerthird/theme6/ga/g.html`;    break;
            }

            $("#configRemoteLink").val(remoteUrl);
            $("#qrcode").html("");

            new QRCode(document.getElementById("qrcode"), remoteUrl);
        }

        function _setBtnLabel(B) {
            $("#saveRemoteVVSettings").html(B);
        }

        function _debug_log(msg) {
            if (m_debug) {
                air.trace("[Remote]: " + msg);
            }
        }
    }
}
