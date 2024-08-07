rvw.provide("rvw.ui").Prompt = {
    __instance: null,
    __okCallback: null,
    __cancelCallback: null,
    setup() {
        const self = this;

        const dialog = this.__instance = new $Y.Panel({
            width      : 410,
            zIndex     : 60,
            centered   : true,
            modal      : true,
            render     : '#confirm-panel',
            visible    : false, // make visible explicitly with .show()
            buttons    : {
                header: ['close'],
                footer: [
                    {
                        name  : 'cancel',
                        label : 'Cancel',
                        action: (e) => {
                            e.preventDefault();

                            const dialog = this.__instance;

                            (typeof self.__cancelCallback === 'function') && self.__cancelCallback();

                            dialog.hide();
                        }
                    },
                    {
                        name  : 'proceed',
                        label : 'OK',
                        isDefault: true,
                        action: (e) => {
                            e.preventDefault();

                            const dialog = this.__instance;

                            (typeof this.__okCallback === 'function') && self.__okCallback();

                            dialog.hide();
                        }
                    }
                ]
            }
        });

        // reset the callbacks, after closing the dialog
        dialog.after("visibleChange", (e) => {
            const visible = e.newVal;

            if (!visible) {
                this.__okCallback = this.__cancelCallback = null;
            }
        });
    },
    exec(header, message, onOk = null, onCancel = null) {
        const dialog = this.__instance;

        dialog.setStdModContent($Y.WidgetStdMod.HEADER, header, $Y.WidgetStdMod.REPLACE);
        dialog.setStdModContent($Y.WidgetStdMod.BODY, message, $Y.WidgetStdMod.REPLACE);

        this.__okCallback = onOk;
        this.__cancelCallback = onCancel;

        dialog.show();
    }
};