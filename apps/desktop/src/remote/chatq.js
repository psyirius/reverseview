function testQClass() {
    $RvW.vvchatQObj.addMsg("Binu", "Bass volume down");
    $RvW.vvchatQObj.addMsg("Jisen", "Got it");
    $RvW.vvchatQObj.addMsg("Toby", "Headphone drum too high");
    document
        .getElementById("getMsgID")
        .addEventListener("click", testgetmessage, false);
    document
        .getElementById("addMsgID")
        .addEventListener("click", testaddmessage, false);
}
function testaddmessage() {
    var b = document.getElementById("msgS").value;
    var a = document.getElementById("msgM").value;
    $RvW.vvchatQObj.addMsg(b, a);
}
function testgetmessage() {
    var a = document.getElementById("msgID").value;
    alert($RvW.vvchatQObj.getMsgFromID(a));
}
class chatQ {
    constructor() {
        this.init = s;
        this.addMsg = t;
        this.getMsgFromID = k;
        this.getKeywords = j;
        this.updateFixedWords = f;
        var u = new Array();
        var b = new Array();
        var g = new Array();
        var p = 200;
        var h = 0;
        var e = 0;
        var r = new Array();
        var a = new Array();
        var m = true;
        function s() { }
        function t(v, w) {
            n(v, e, w);
            l(w);
        }
        function n(w, v, x) {
            u[v] = x;
            g[v] = w;
            b[v] = h;
            h++;
            e++;
            if (e >= p) {
                e = 0;
            }
            o();
        }
        function q(z) {
            var v = u[z];
            var x = g[z];
            var w = b[z];
            var y = w + "|" + x + "|" + v;
            return y;
        }
        function k(y) {
            var x = "";
            for (var w = y; w < h; w++) {
                var v = c(w);
                x += q(v) + "<br>";
            }
            return x;
        }
        function j() {
            var v = r + "," + a;
            return v;
        }
        function c(y) {
            var v = b.length;
            for (var x = 0; x < v; x++) {
                var w = b[x];
                if (w == y) {
                    return x;
                }
            }
            return false;
        }
        function l(x) {
            var w = x.split(" ");
            var v = w.length;
            for (var z = 0; z < v; z++) {
                var y = i(w[z]);
                if (!y) {
                    a.push(w[z]);
                }
            }
        }
        function i(x) {
            var A = r + "," + a;
            var z = A.split(",");
            var v = z.length;
            if (x == "" || x == " ") {
                return true;
            }
            if (x.length > 12) {
                return true;
            }
            for (var y = 0; y < v; y++) {
                if (x == z[y]) {
                    return true;
                }
            }
            return false;
        }
        function f(x) {
            var z = x.split(",");
            var v = z.length;
            for (var y = 0; y < v; y++) {
                r.push(z[y]);
            }
        }
        function o() {
            var x = "";
            var v = u.length;
            for (var w = 0; w < v; w++) {
                var y = b[w] + "|" + g[w] + "|" + u[w] + "<br>";
                x += y;
            }
        }
        function d(v) {
            if (m == true) {
                air.trace("VVChat: " + v);
            }
        }
    }
}
