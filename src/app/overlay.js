rvw.provide("rvw.ui").Overlay = { // overlay panel
    __instance: null,
    setup() {
        this.__instance = new $Y.Overlay({
            width: "400px",
            height: "300px",
            visible: false,
            render: "#overlay",
            buttons    : {
                header: ['close'],
            }
        });
    },
    show(header, message, xy = null) {
        const overlay = this.__instance;

        overlay.setStdModContent($Y.WidgetStdMod.HEADER, header, $Y.WidgetStdMod.REPLACE);
        overlay.setStdModContent($Y.WidgetStdMod.BODY, message, $Y.WidgetStdMod.REPLACE);

        if (xy) {
            const [x, y] = xy;
            overlay.set("xy", [x + 0, y + 38]);
        }

        if (header === "Suggestions") {
            setTimeout(() => overlay.hide(), 6000);
        }

        overlay.show();
    },
    close() {
        const overlay = this.__instance;
        overlay.hide();
    },
    toggle() {
        const overlay = this.__instance;
        overlay.get("visible") ? overlay.hide() : overlay.show();
    }
};