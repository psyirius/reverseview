rvw.provide("rvw.ui").Prompt = {
    __instance: null,
    setup() {
        /*
        * <div id="promptDialog">
        *   <div class="hd"></div>
        *   <div class="bd"></div>
        * </div>
        * */

        const { Panel } = YAHOO.widget;

        const promptDialog = this.__instance = new Panel("promptDialog", {
            width: "400px",
            fixedcenter: true,
            modal: true,
            visible: false,
            constraintoviewport: true,
        });
        promptDialog.render();
    },
    exec(header, message, onOK = null, onCancel = null) {
        const dialog = this.__instance;

        dialog.setHeader(header);
        dialog.setBody(`${message} <br><br> <input id="yesButton" type="button" value=" YES "><input id="noButton" type="button" value=" NO "> `);
        dialog.show();

        document
            .getElementById("yesButton")
            .addEventListener("click", () => {
                dialog.hide();
                (typeof onYes === 'function') && onYes()
            }, false);

        document
            .getElementById("noButton")
            .addEventListener("click", () => {
                dialog.hide();
                (typeof onNo === 'function') && onNo()
            }, false);
    }
};