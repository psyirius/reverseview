function remoteVV_IPList() {
  var d = new Array();
  var f = air.NetworkInfo.networkInfo.findInterfaces();
  if (f != null) {
    var c = 0;
    for (var b = 0; b < f.length; b++) {
      var e = f[b].active;
      if (e) {
        var a;
        a = f[b].addresses[0].address;
        if (a != "::1") {
          d[c] = a;
          c++;
        }
      }
    }
    d[c] = "127.0.0.1";
    return d;
  } else {
    alert("No interface found");
    return null;
  }
}
