function wordlearner() {
  this.addWord = a;
  this.finishLearning = h;
  this.printWordList = g;
  this.cancelLearning = e;
  var i = null;
  var c = 25;
  var b = null;
  function d() {
    i = new Array();
    c = 25;
  }
  function a(j) {
    if (i == null) {
      d();
    }
    i.push(j);
    if (b != null) {
      clearTimeout(b);
      b = null;
    }
    b = setTimeout(e, c * 1000);
  }
  function e() {
    i = null;
  }
  function h() {
    if (i != null) {
      f();
      i = null;
    }
  }
  function f() {
    var l = i.pop();
    var k = i.length;
    var q = new Array();
    for (var n = 0; n < k; n++) {
      var o = true;
      var p = q.length;
      if (i[n].length > 1) {
        for (var m = 0; m < p; m++) {
          if (i[n] == q[m]) {
            o = false;
            break;
          }
        }
      } else {
        o = false;
      }
      if (o) {
        q.push(i[n]);
        wordbrain.addRecordBy_wordin_wordout(i[n], l);
      }
    }
  }
  function g() {
    var j = i.length;
    air.trace("**** WORD LIST FOR LEARNING ****");
    for (var k = 0; k < j; k++) {
      air.trace(i[k]);
    }
  }
}
