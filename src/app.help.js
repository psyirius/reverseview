class vvhelpClass {
  constructor(bodyContent) {
    this.m_body = bodyContent;
    this.m_panel = null;

    this._setup();

    $("#airVersionID").html("Adobe AIR Version " + air.NativeApplication.nativeApplication.runtimeVersion);
  }
  
  _setup() {
    this.m_panel = new YAHOO.widget.Panel("panelObjh", {
      width: "500px",
      fixedcenter: true,
      modal: true,
      visible: false,
      constraintoviewport: true,
    });
    this.m_panel.render(document.body);
    this.m_panel.setHeader("About");
    this.m_panel.setBody(this.m_body);
    this.m_panel.bringToTop();
  }
  show() {
    this.m_panel.show();
  }
  hide() {
    this.m_panel.hide();
  }
}
