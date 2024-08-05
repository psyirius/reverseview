rvw.provide("rvw.ui").Prompt = {
    __instance: null,
    setup() {
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
    exec(header, message, { onYes, onNo } = { onYes: null, onNo: null }) {
        const promptDialog = this.__instance;

        promptDialog.setHeader(header);
        promptDialog.setBody(`${message} <br><br> <input id="yesButton" type="button" value=" YES "><input id="noButton" type="button" value=" NO "> `);
        promptDialog.show();

        document
            .getElementById("yesButton")
            .addEventListener("click", () => {
                promptDialog.hide();
                (typeof onYes === 'function') && onYes()
            }, false);

        document
            .getElementById("noButton")
            .addEventListener("click", () => {
                promptDialog.hide();
                (typeof onNo === 'function') && onNo()
            }, false);

    }
};