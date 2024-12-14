import { Component } from 'preact';
import {useState, useEffect, useId, useRef} from 'preact/hooks';
import {
    showRemotePanel,
    localIpList,
    remoteEnabled,
    remoteCustomHostname,
    remoteListenPort,
    restoreRemoteStandby
} from "@stores/global";
import {useStoreState} from "@/utils/hooks";
import {$RvW} from "@/rvw";
import QRCode from "@app/ui/QRCode";
import {Toast} from "@app/toast";
import {console} from "@/platform/adapters/air";

function getAvailableNwIfs() {
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
        .map(e => ({
            name: e.name,
            addr: e.addresses
                .filter(([v, _]) => (v === 'IPv4'))
                .map(([_, a]) => a)[0],
            mac: e.macaddr,
        }))
}

function loadNetworkInterfaces() {
    const list = [
        ...getAvailableNwIfs(),
        {
            name: 'All Interfaces',
            addr: '0.0.0.0',
            mac: null,
        },
    ];
    list.reverse();

    localIpList.set(list);
}

loadNetworkInterfaces();

// TODO:
// - Add a Text field to insert theme of the view
// - List connected remote clients
// - Show port availability
const remoteItemList = [
    { id: 1,  label: 'Control'                , path: '/control.html'                   },

    { id: 2,  label: 'Stageview 1'            , path: '/stageview/fullscreen1/c.html'   },
    { id: 3,  label: 'Stageview 2'            , path: '/stageview/fullscreen2/c.html'   },
    { id: 4,  label: 'Stageview 3'            , path: '/stageview/fullscreen3/c.html'   },

    { id: 5,  label: 'Stage 1'                , path: '/stageview/stage/c.html'         },
    { id: 6,  label: 'Stage 2'                , path: '/stageview/stage2/c.html'        },
    { id: 7,  label: 'Stage 3'                , path: '/stageview/stage3/c.html'        },
    { id: 8,  label: 'Stage 4'                , path: '/stageview/stage4/c.html'        },

    { id: 9,  label: 'Lower Third A Primary'  , path: '/lowerthird/theme6/a/a.html'     },
    { id: 10, label: 'Lower Third A Secondary', path: '/lowerthird/theme6/a2/a.html'    },
    { id: 11, label: 'Lower Third B'          , path: '/lowerthird/theme6/b/b.html'     },
    { id: 12, label: 'Lower Third C'          , path: '/lowerthird/theme6/c/c.html'     },
    { id: 13, label: 'Lower Third C1'         , path: '/lowerthird/theme6/c1/c.html'    },
    { id: 14, label: 'Lower Third D'          , path: '/lowerthird/theme6/d/d.html'     },
    { id: 15, label: 'Lower Third D2'         , path: '/lowerthird/theme6/d2/d.html'    },
    { id: 16, label: 'Lower Third E2'         , path: '/lowerthird/theme6/e2/e.html'    },
    { id: 17, label: 'Lower Third G'          , path: '/lowerthird/theme6/g/g.html'     },
    { id: 18, label: 'Lower Third G2'         , path: '/lowerthird/theme6/g2/g.html'    },
    { id: 19, label: 'Lower Third H'          , path: '/lowerthird/theme6/h1/h.html'    },
    { id: 20, label: 'Lower Third Arabic'     , path: '/lowerthird/theme6/ga/g.html'    },
];

interface Props {

}

export default function RemoteSetupDialog({}: Props) {
    const container = useRef(null);

    if (!remoteCustomHostname.get()) {
        remoteCustomHostname.set($RvW.vvConfigObj.get_myhostname());
    }

    const ipSelectRef = useRef<HTMLSelectElement>(null);
    const hostnameToggleRef = useRef<HTMLInputElement>(null);
    const hostnameInputRef = useRef<HTMLInputElement>(null);

    const open = useStoreState(showRemotePanel);
    const ipList = useStoreState(localIpList);
    const enabled = useStoreState(remoteEnabled);
    const restoreStandby = useStoreState(restoreRemoteStandby);
    const customHostname = useStoreState(remoteCustomHostname);
    const port = useStoreState(remoteListenPort);

    const [remoteLink, setRemoteLink] = useState('');
    const [useHostname, setUseHostname] = useState(false);
    const [selectedIp, setSelectedIp] = useState(0);
    const [selectedView, setSelectedView] = useState(1);
    const [panel, setPanel] = useState(null);

    // TODO: fix this later
    useEffect(() => {
        const restoreStandby = $RvW.rvwPreferences.get("app.settings.remote.restore.standby", false);
        // restoreRemoteStandby.set(restoreStandby);

        const enabled = $RvW.rvwPreferences.get("app.settings.remote.enabled", false);
        // remoteEnabled.set(enabled);

        console.log('Remote Restore Standby:', restoreStandby);
        console.log('Remote Enabled:', enabled);

        if (!restoreStandby && enabled) {
            remoteEnabled.set(false);
        }
    }, []);

    // Init Dialog Panel
    useEffect(() => {
        const panel = new $Y.Panel({
            headerContent   : 'Remote',
            srcNode         : container.current!,
            width           : '60%',
            height          : 'auto',
            zIndex          : 100,
            centered        : true,
            modal           : true,
            render          : true,
            visible         : false, // make visible explicitly with .show()
        });

        panel.on('visibleChange', function (e: any) {
            showRemotePanel.set(e.newVal);
        });

        setPanel(panel);
    }, []);

    // panel visibility
    useEffect(() => {
        if (open) {
            panel?.show();
        } else {
            panel?.hide();
        }
    }, [open]);

    // link updater
    useEffect(() => {
        setRemoteLink(generateRemoteLink());
    }, [useHostname, selectedView, customHostname, enabled]);

    // server control
    useEffect(() => {
        if (!$RvW.webServerObj) return;

        if (enabled) {
            console.trace('Remote Enabled');

            // if ($RvW.webServerObj.isActive()) {
            //     Toast.show(
            //         "Remote ReVerseVIEW",
            //         "Remote is already enabled!",
            //     );
            //     return;
            // }

            if (isNaN(port)) {
                Toast.show(
                    "Remote ReVerseVIEW",
                    "Invalid port number!",
                );
                remoteEnabled.set(false);
                return;
            }

            if (port < 49152 || port > 65535) {
                Toast.show(
                    "Remote ReVerseVIEW",
                    "Port number must be between 49152 and 65535!",
                );
                remoteEnabled.set(false);
                return;
            }

            const ipInfo = ipList[selectedIp];
            const _ipAddr = ipInfo.addr;

            const ok = $RvW.webServerObj.init(port, _ipAddr);
            if (!ok) {
                Toast.show(
                    "Remote ReVerseVIEW",
                    "Failed to start remote server!",
                );
                remoteEnabled.set(false);
                return;
            }
        } else {
            console.trace('Remote Disabled');

            // if (!$RvW.webServerObj.isActive()) {
            //     Toast.show(
            //         "Remote ReVerseVIEW",
            //         "Remote is already disabled!",
            //     );
            //     return;
            // }

            $RvW.webServerObj.stop();
        }
    }, [enabled]);

    // config save
    useEffect(() => {
        $RvW.vvConfigObj.set_myhostname(customHostname);
        $RvW.vvConfigObj.save();
    }, [customHostname]);

    function generateRemoteLink(viewId = selectedView) {
        const protocol = 'http';
        const hostname = getHost();

        let path: string = '/404.html';

        remoteItemList.forEach(e => {
            if (e.id === viewId) {
                path = e.path;
            }
        });

        return `${protocol}://${hostname}:${port}${path}`;
    }

    function copyRemoteLink() {
        const { Clipboard, ClipboardFormats } = air;
        const { generalClipboard } = Clipboard;

        generalClipboard.clear();
        generalClipboard.setData(ClipboardFormats.TEXT_FORMAT, remoteLink);
    }

    function onPortChange(e: Event) {
        remoteListenPort.set(
            parseInt((e.target as HTMLInputElement).value)
        );
    }

    function onHostnameChange(e: Event) {
        remoteCustomHostname.set(
            (e.target as HTMLInputElement).value
        );
    }

    function onUseHostnameChange(e: Event) {
        setUseHostname(
            (e.target as HTMLInputElement).checked
        );
    }

    function onNetworkInterfaceChange() {
        const ipSelect = ipSelectRef.current!;
        const selectedIndex = ipSelect.selectedIndex;
        const ipInfo = ipList[selectedIndex];

        setSelectedIp(selectedIndex);

        const _selectedIp = ipInfo.addr;

        // loopback can only be accessed via localhost
        hostnameInputRef.current!.disabled = (_selectedIp === '127.0.0.1');
    }

    function getHost() {
        const ipInfo = ipList[selectedIp];
        const _selectedIp = ipInfo.addr;

        let _customHostname = customHostname;

        if (_selectedIp === '127.0.0.1') {
            _customHostname = 'localhost';
        }

        if (useHostname) {
            return _customHostname;
        }

        if (_selectedIp === '0.0.0.0') {
            return useHostname ? 'localhost' : '127.0.0.1';
        }

        return _selectedIp;
    }

    function getHostname() {
        if (ipList.length === 0) {
            return '-';
        }
        const ipInfo = ipList[selectedIp];
        const _selectedIp = ipInfo.addr;

        // loopback can only be accessed via localhost
        if (_selectedIp === '127.0.0.1') {
            return 'localhost';
        }

        return customHostname;
    }

    function onRemoteViewChange(e: Event) {
        const viewId = parseInt((e.target as HTMLSelectElement).value);

        console.trace('Selected View:', viewId);

        setSelectedView(viewId);
    }

    function onRemoteEnableToggle() {
        remoteEnabled.update(e => !e);
    }

    return (
        <div ref={container}>
            <div class="yui3-widget-bd">
                <div class="ui form container segment">
                    <div id="generalPanelDIV_delete" class="ui grid remoteVVDIV">
                        {/* LEFT COLUMN */}
                        <div class="seven wide column">
                            <div class="form-group row field">
                                <label>Network Interface</label>

                                <select
                                    name="select"
                                    class="form-control"
                                    ref={ipSelectRef}
                                    onChange={onNetworkInterfaceChange}
                                    value={selectedIp}
                                    disabled={enabled}
                                >
                                    {ipList.map(({name, addr}, i: number) => (
                                        <option value={i} key={i}>{addr} ({name})</option>
                                    ))}
                                </select>

                                <button
                                    class="ui icon button mini"
                                    onClick={loadNetworkInterfaces}
                                    disabled={enabled}
                                >
                                    <i class="sync icon"></i> Refresh
                                </button>
                            </div>

                            <div class="form-group row field">
                                <label>Port</label>

                                <div class="ui grid">
                                    <div
                                        class="six wide column"
                                        data-tooltip="Select Port (49152 to 65535)"
                                        data-position="right center"
                                        data-variation="basic small"
                                    >
                                        {/* FIXME: Entering non-numeric crashing (if number type input is used) */}
                                        <input
                                            type="text"
                                            class="form-control form-control-sm"
                                            id="configRemotePort"
                                            value={port}
                                            // min={49152}
                                            // max={65535}
                                            onChange={onPortChange}
                                            placeholder="Enter Port Number"
                                            disabled={(ipList.length === 0) || enabled}
                                        />
                                    </div>

                                    <div class="ten wide column">
                                        <button
                                            class="ui primary button"
                                            id="saveRemoteVVSettings"
                                            data-tooltip="Enable/Disable Remote"
                                            data-position="right center"
                                            data-variation="basic small"
                                            onClick={onRemoteEnableToggle}
                                        >{enabled ? 'Disable' : 'Enable'}</button>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group row field" id="remote-custom-hostname">
                                <label>Enter Hostname</label>

                                <div
                                    class="ui grid"
                                    data-tooltip="Enter hostname of the computer"
                                    data-position="right center"
                                    data-variation="basic small"
                                >
                                    <div class="six wide column">
                                        <input
                                            type="text"
                                            class="form-control form-control-sm"
                                            ref={hostnameInputRef}
                                            value={getHostname()}
                                            onChange={onHostnameChange}
                                            disabled={ipList.length === 0}
                                        />
                                    </div>

                                    <div class="ten wide column field">
                                        <div class="inline field">
                                            <div class="ui toggle checkbox">
                                                <input
                                                    type="checkbox"
                                                    tabIndex={0}
                                                    ref={hostnameToggleRef}
                                                    disabled={ipList.length === 0}
                                                    checked={useHostname}
                                                    onChange={onUseHostnameChange}
                                                />
                                                <label>Use Hostname</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="two wide column"></div>

                        {/* RIGHT COLUMN */}
                        <div class="seven wide column">
                            {/* Status Text */}
                            <div class="form-group row field">
                            <span>{
                                enabled
                                    ? 'Remote is Enabled'
                                    : 'Remote is Disabled'
                            }</span>
                            </div>

                            {enabled && <>
                                <div class="form-group row field" id="remoteLinkList">
                                    <label>Remote Link</label>

                                    <div
                                        data-tooltip="Select the remote function for the corresponding QR code and link"
                                        data-position="bottom right"
                                        data-variation="basic small"
                                    >
                                        <select
                                            name="select"
                                            class="form-control"
                                            id="remoteVVRemoteFunc"
                                            value={selectedView}
                                            onChange={onRemoteViewChange}
                                        >
                                            {remoteItemList.map((item, i) => (
                                                <option value={item.id} key={i}>{item.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group row field">
                                    <QRCode text={remoteLink}/>
                                </div>

                                <div class="form-group row field">
                                    <div class="ui grid">
                                        <div class="ten wide column">
                                            <input
                                                type="text"
                                                class="form-control form-control-sm"
                                                id="configRemoteLink"
                                                value={remoteLink}
                                                readOnly={true}
                                                placeholder="Url to access the remote UI or View"
                                            />
                                        </div>
                                        <div class="four wide column">
                                            <button
                                                class="ui primary button"
                                                onClick={copyRemoteLink}
                                                data-tooltip="Copy remote link to clipboard"
                                                data-position="left center"
                                                data-variation="basic small"
                                            >Copy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}