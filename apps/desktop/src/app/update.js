import {version_number} from "@/versionupdate";
import {$RvW} from "@/rvw";

const INNER_HTML = `<div class="generalPanelDIV">
    <div class="generalheading2">Bible Update</div><br>
    <div class="style2">
    <table id="updateTableID" border="0">
        <tr height="100px">
            <td>
                <select size="5" id="updateListID" class="updateListStyle"></select><br>
            </td>
            <td>
                <div id="updateStatusID" class="updateStatusClass"></div>
            </td>
        </tr>
        <tr><td>
            <input type="button" id="checkUpdateBut" value=" CHECK "> | 
            <input type="button" id="loadSelectedBut" value=" LOAD ">
        </td></tr>
    </table>
    </div>
</div>`;

export class AppUpdateUi {
    constructor() {
        this.show = show;
        this.hide = hide;

        let b = null;
        const m_body = INNER_HTML;

        _setupUI();

        function _setupUI() {
            b = new YAHOO.widget.Panel("panelObj5", {
                width: "300px",
                fixedcenter: true,
                modal: true,
                visible: false,
                constraintoviewport: true,
            });
            b.render(document.body);
            b.setHeader("VerseVIEW Updates");
            b.setBody(m_body);
            b.hide();
            b.bringToTop();
        }

        function show() {
            b.show();
            b.bringToTop();
        }

        function hide() {
            b.hide();
        }
    }
}

export class AppUpdater {
    constructor() {
        this.checkForUpdates = checkForUpdates;

        var h = 30;
        var m = false;
        var l = 0;
        var j = 0;
        var o = "";
        var b = "";
        var a = "";
        var k = null;

        l = Number(version_number);
        k = Date.now();
        if (d()) {
            g(false);
        }

        function d() {
            var r = $RvW.vvConfigObj.get_lastCheckForUpdateDate();
            if (r == null) {
                $RvW.vvConfigObj.set_lastCheckForUpdateDate(k);
            } else {
                var q = k - r;
                var p = q / 86400000;
                if (p > h) {
                    $RvW.vvConfigObj.set_lastCheckForUpdateDate(k);
                    return true;
                }
            }
            return false;
        }

        function g(u) {
            var t = air.NetworkInfo.networkInfo.findInterfaces();
            m = false;
            if (t != null) {
                if (t.length > 1) {
                    m = true;
                }
            }
            if (m) {
                const s = new air.URLRequest(
                    "https://github.com/rvw/desktop/releases/latest/download/version.txt"
                );
                var p = new air.URLLoader();
                p.addEventListener(air.Event.COMPLETE, r);
                p.addEventListener(air.IOErrorEvent.IO_ERROR, q);
                p.load(s);

                function r(x) {
                    p.removeEventListener(air.Event.COMPLETE, r);
                    p.removeEventListener(air.IOErrorEvent.IO_ERROR, q);
                    var w = x.target.data;
                    var v = w.split("|");
                    j = v[0] * 1;
                    o = v[1];
                    b = v[2];
                    a = v[3];
                    if (j > l) {
                        c();
                    } else {
                        if (u) {
                            e();
                        }
                    }
                }

                function q(v) {
                    p.removeEventListener(air.Event.COMPLETE, r);
                    p.removeEventListener(air.IOErrorEvent.IO_ERROR, q);
                    i();
                }
            } else {
                i();
            }
        }

        function checkForUpdates() {
            g(true);
        }

        function c() {
            var p = "Version " +
                o +
                " is now available for download from the VerseVIEW website.";
            air.trace("New Version Available: " + p);
        }

        function i() {
            var p = "Please check VerseVIEW website for updates.";
            air.trace("VerseVIEW Update: " + p);
        }

        function e() {
            var p = "No new updates are available. You have the latest version.";
            air.trace("VerseVIEW Update: " + p);
        }
    }
}