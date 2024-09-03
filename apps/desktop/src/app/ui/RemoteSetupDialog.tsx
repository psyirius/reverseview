import {useState, useEffect, useId, useRef} from '@lib/zrx/hooks';
import { Component, render } from '@lib/zrx/preact';
import { showRemotePanel, localIpList, remoteEnabled } from "@stores/global";
import {useStoreState} from "@/utils/hooks";

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
    // const id = useId();
    const id = 'remote-setup-modal';

    const qrRef = useRef(null);

    const open = useStoreState(showRemotePanel);
    const ipList = useStoreState(localIpList);
    const enabled = useStoreState(remoteEnabled);

    // const [port, setPort] = useState(50000);
    // const [remoteLink, setRemoteLink] = useState('');
    // const [hostname, setHostname] = useState('localhost');

    const updateQRCode = () => {
        if (qrRef.current) {
            qrRef.current.innerHTML = '';
            // linked lib: QRCode
            // @ts-ignore
            new QRCode(qrRef.current, 'remoteUrl');
        }
    };

    // return (
    //     open && (
    //         <div id={id} class="xui dialog center">
    //             <div class="header">
    //                 <p class="caption dm-sans">Remote</p>
    //
    //                 <div class="buttons">
    //                     <button class="close" onClick={() => showRemotePanel.set(false)}>&times;</button>
    //                 </div>
    //             </div>
    //
    //             <div class="body dm-sans">
    //                 <div class="ui form container segment">
    //                     <div class="ui grid">
    //                         {/* LEFT COLUMN */}
    //                         <div class="seven wide column">
    //                             <div class="form-group row field">
    //                                 <label>IP Address</label>
    //
    //                                 <select name="select" class="form-control">
    //                                     {ipList.map((text: string, i: number) => (
    //                                         <option value={i} key={i}>{text}</option>
    //                                     ))}
    //                                 </select>
    //                             </div>
    //
    //                             <div class="form-group row field">
    //                                 <label>Port</label>
    //
    //                                 <div class="ui grid">
    //                                     <div
    //                                         class="six wide column"
    //                                         data-tooltip="Select Port (49152 to 65535)"
    //                                         data-position="right center"
    //                                         data-variation="basic small"
    //                                     >
    //                                         <input
    //                                             type="number"
    //                                             class="form-control form-control-sm"
    //                                             value={port}
    //                                             min={49152}
    //                                             max={65535}
    //                                             placeholder="Enter Port Number"
    //                                         />
    //                                     </div>
    //                                 </div>
    //
    //                                 <div class="ten wide column">
    //                                     <button
    //                                         class="ui primary button"
    //                                         data-tooltip="Enable/Disable Remote"
    //                                         data-position="right center"
    //                                         data-variation="basic small"
    //                                         onClick={updateQRCode}
    //                                     >ENABLE
    //                                     </button>
    //                                 </div>
    //                             </div>
    //
    //                             <div class="form-group row field">
    //                                 <label>Enter Hostname</label>
    //
    //                                 <div
    //                                     class="ui grid"
    //                                     data-tooltip="Enter hostname of the computer"
    //                                     data-position="right center"
    //                                     data-variation="basic small"
    //                                 >
    //                                     <div class="six wide column">
    //                                         <input
    //                                             type="text"
    //                                             class="form-control form-control-sm"
    //                                         />
    //                                     </div>
    //
    //                                     <div class="ten wide column field">
    //                                         <div class="inline field">
    //                                             <div class="ui toggle checkbox">
    //                                                 <input type="checkbox" tabIndex={0}/>
    //                                                 <label>Use Hostname</label>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //
    //                         <div class="two wide column"></div>
    //
    //                         {/* RIGHT COLUMN */}
    //                         <div class="seven wide column">
    //                             <div class="form-group row field">
    //                                 <span id="remoteVVStatus">Remote Disabled</span>
    //                             </div>
    //
    //                             <div class="form-group row field">
    //                                 <label>Remote Link</label>
    //
    //                                 <div
    //                                     data-tooltip="Select the remote function for the corresponding QR code and link"
    //                                     data-position="bottom right"
    //                                     data-variation="basic small"
    //                                 >
    //                                     <select name="select" class="form-control">
    //                                         {remoteItemList.map((item, i) => (
    //                                             <option value={item.id} key={i}>{item.label}</option>
    //                                         ))}
    //                                     </select>
    //                                 </div>
    //                             </div>
    //
    //                             <div class="form-group row field">
    //                                 <div ref={qrRef}></div>
    //                             </div>
    //
    //                             <div class="form-group row field">
    //                                 <div class="ui grid">
    //                                     <div class="ten wide column">
    //                                         <input
    //                                             type="text"
    //                                             class="form-control form-control-sm"
    //                                             value={remoteLink}
    //                                             placeholder="Link to remote"
    //                                             readOnly={true}
    //                                         />
    //                                     </div>
    //
    //                                     <div class="four wide column">
    //                                         <button
    //                                             class="ui primary button"
    //                                             id="configRemoteCopy"
    //                                             data-tooltip="Copy remote link to clipboard"
    //                                             data-position="left center"
    //                                             data-variation="basic small"
    //                                         >COPY
    //                                         </button>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // );

    return (
        <div id={id} class="ui form container segment">
            <div id="generalPanelDIV_delete" class="ui grid remoteVVDIV">
                {/* LEFT COLUMN */}
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
                                       placeholder="Enter Port Number"/>
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
                                <input type="text" class="form-control form-control-sm" id="configRemoteHostname"/>
                            </div>

                            <div class="ten wide column field">
                                <div class="inline field">
                                    <div class="ui toggle checkbox">
                                        <input type="checkbox" tabIndex={0} id="remoteVVUseHostname"/>
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

                    <div class="form-group row field" id="remoteLinkList">
                        <label>Remote Link</label>
                        <div data-tooltip="Select the remote function for the corresponding QR code and link"
                             data-position="bottom right" data-variation="basic small">
                            <select name="select" class="form-control" id="remoteVVRemoteFunc">
                                {remoteItemList.map((item, i) => (
                                    <option value={item.id} key={i}>{item.label}</option>
                                ))}
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
                                       placeholder="Link to remote"/>
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
    );
}

export function mount(at: string) {
    render(<RemoteSetupDialog/>, document.getElementById(at)!);
}