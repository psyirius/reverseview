function chordsObjClass() {
  this.init = r;
  this.id = n;
  this.title = u;
  this.lyrics = d;
  this.chords = f;
  this.key = t;
  this.chordsby = v;
  this.timestamp = c;
  this.bpm = a;
  this.notes = i;
  this.timesignature = g;
  this.rhythm = e;
  this.complexity = j;
  this.tags = k;
  this.rating = h;
  this.original = q;
  this.usagecount = m;
  this.category = p;
  this.additional = b;
  var s = new Array("EASY", "INTERMEDATE", "ADVANCED");
  var n = "";
  var u = "";
  var d = "";
  var f = "";
  var t = "";
  var v = "";
  var c = "";
  var a = 100;
  var i = "";
  var g = "";
  var e = "";
  var j = s[0];
  var k = "";
  var h = "";
  var q = true;
  var m = 0;
  var p = "";
  var b = "";
  var o = false;
  function r() {
    l("Initialize Chords Object");
    n = "";
    u = "";
    d = "";
    f = "";
    t = "";
    v = "";
    c = "";
    a = 100;
    i = "";
    g = "";
    e = "";
    j = s[0];
    k = "";
    h = "";
    q = true;
    m = 0;
    p = "";
    b = "";
  }
  function l(w) {
    if (o) {
      air.trace("[Chords OBJECT]...." + w);
    }
  }
}
