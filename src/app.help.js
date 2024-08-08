class RvwHelp {
  constructor(bodyTemplate) {
    $Y.Handlebars.compile(bodyTemplate);

    this.m_body = bodyTemplate /*$Y.Handlebars.compile(bodyTemplate)({
      app: {
        name: 'ReVerseVIEW',
        version: '8.5.0',
        website: {
          text: "reverseview.github.io",
          url : "https://reverseview.github.io"
        },
      },
      runtime: {
        name: 'Adobe Air',
        version: air.NativeApplication.nativeApplication.runtimeVersion,
      },
    });*/
    this.m_panel = null;

    this._setup();
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
