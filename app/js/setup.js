function bibleVersionSelClass() {
  this.init = g;
  this.show = a;
  var c = null;
  var f = null;
  function g(h) {
    f = h;
    e();
    d();
  }
  function e() {
    c = new YAHOO.widget.Panel("panelObj2", {
      width: "300px",
      fixedcenter: true,
      modal: true,
      visible: false,
      constraintoviewport: true,
    });
    c.render(document.body);
    c.setHeader("Bible Version Selection");
    c.setBody(f);
    c.hide();
    c.bringToTop();
  }
  function d() {}
  function a() {
    c.show();
    c.bringToTop();
  }
  function b() {
    c.hide();
  }
}
function updateVV_UI_Class() {
  this.init = g;
  this.show = a;
  var b = null;
  var f = null;
  function g(h) {
    f = h;
    e();
    d();
  }
  function e() {
    b = new YAHOO.widget.Panel("panelObj5", {
      width: "300px",
      fixedcenter: true,
      modal: true,
      visible: false,
      constraintoviewport: true,
    });
    b.render(document.body);
    b.setHeader("VerseVIEW Updates");
    b.setBody(f);
    b.hide();
    b.bringToTop();
  }
  function d() {}
  function a() {
    b.show();
    b.bringToTop();
  }
  function c() {
    b.hide();
  }
}