class chordsWebInterfaceClass {
  constructor() {
    this.init = g;
    this.getsong = e;
    var h = "";
    var b = 0;
    var d = null;
    var a = true;
    function g(j) {
      h = "";
      b = 0;
      var i = j.split("|");
      h = i[0];
      c("Song title : " + h);
      c("Song version : " + i[1]);
      if (i[1] != null) {
        b = i[1] * 1;
      }
    }
    function e() {
      d = $RvW.chordsManagerObj.getChordsByTitle(h);
      c("Number of versions : " + d.length);
      if (d[b] == null) {
        if (d[0] == null) {
          return "Chords are not available for this song";
        } else {
          b = 0;
        }
      }
      c("Test print ..chords by  : " + d[b].chordsby);
      var i = f(d[b]);
      return i;
    }
    function f(i) {
      var j = "";
      j += i.lyrics + "<|>";
      j += i.chords + "<|>";
      j += i.key + "<|>";
      j += i.chordsby + "<|>";
      j += i.bpm + "<|>";
      j += i.timesignature + "<|>";
      return j;
    }
    function c(i) {
      if (a) {
        air.trace("[Chords Web Interface]...." + i);
      }
    }
  }
}