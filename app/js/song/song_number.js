function songNumber() {
  var a = new Array(1, 1, 1, 1, 1, 1, 1);
  this.setMaxMalayalam = f;
  this.setMaxHindi = c;
  this.getUniqueSongNumber = i;
  this.assignSongNumber = d;
  function g(j) {}
  function e(j) {}
  function f(j) {
    a[0] = parseInt(j) + 1;
  }
  function c(j) {
    a[1] = parseInt(j) + 1;
  }
  function b() {}
  function i(j) {}
  function d(k, l) {
    var j = h(k);
    var m = "";
    switch (j) {
      case 0:
        m = j + a[0];
        a[0]++;
        break;
      case 5000:
        m = j + a[1];
        a[1]++;
        break;
      case 10000:
        m = j + a[2];
        a[2]++;
        break;
      case 15000:
        m = j + a[3];
        a[3]++;
        break;
      case 20000:
        m = j + a[4];
        a[4]++;
        break;
      case 25000:
        m = j + a[5];
        a[5]++;
        break;
      case 100000:
        m = j + a[6];
        a[6]++;
        break;
      default:
        alert("Should have never come here...");
    }
    return m;
  }
  function h(j) {
    switch (j) {
      case "VV Malayalam 2021":
        return 0;
      case "VV Hindi 2021":
        return 5000;
      case "VV Tamil 2021":
        return 10000;
      case "Telugu":
        return 15000;
      case "Kannada":
        return 20000;
      case "Bengali":
        return 25000;
      default:
        return 100000;
    }
  }
}