function vvhelpClass() {
  this.init = f;
  this.showHelp = d;
  var c = null;
  var a = null;
  function f(g) {
    c = g;
    e();
    $("#airVersionID").html("Adobe AIR Version " + air.NativeApplication.nativeApplication.runtimeVersion);
    $("#webkitVersionID").html("UserAgent " + window.htmlLoader.userAgent);
  }
  function e() {
    a = new YAHOO.widget.Panel("panelObjh", {
      width: "500px",
      fixedcenter: true,
      modal: true,
      visible: true,
      constraintoviewport: true,
    });
    a.render(document.body);
    a.setHeader("VerseVIEW Help");
    a.setBody(c);
    a.hide();
    a.bringToTop();
  }
  function d() {
    a.show();
  }
  function b() {
    a.hide();
  }
}
