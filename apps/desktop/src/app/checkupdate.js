function checkForNewVersion() {
    this.init = n;
    this.checkForUpdates = f;
    var h = 30;
    var m = false;
    var l = 0;
    var j = 0;
    var o = "";
    var b = "";
    var a = "";
    var k = null;
    function n() {
        l = version_number * 1;
        k = Date.now();
        if (d()) {
            g(false);
        } else {
        }
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
            var s = new air.URLRequest(
                "http://reverseview.github.io/download/version_server.txt"
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
    function f() {
        g(true);
    }
    function c() {
        var p =
            "Version " +
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
