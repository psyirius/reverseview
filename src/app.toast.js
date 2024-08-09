rvw.provide("rvw.ui").Toast = {
    __instance: null,
    __Toast: class {
        constructor(header, message, config) {
            this.message = message;
            this.header = header;
            this.position = config.position || "bottom-right"; // Default position
            this.margin = config.margin || 10; // Default margin
            this.panel = null;
        }

        show() {
            // Create the panel
            this.panel = new $Y.Panel({
                contentBox: $Y.Node.create(
                    `<div class="yui3-toast-panel ${this.position}"></div>`
                ),
                headerContent: this.header,
                bodyContent: `<span>${this.message}</span>`,
                visible: true,
                render: "#toast-container",
                zIndex: 1000,
                modal: false,
                width: "auto",
                buttons: {
                    header: ['close'],
                },
            });

            // Adjust margin based on configuration
            this.panel.get("boundingBox").setStyle("margin", this.margin + "px");

            // Show the panel (fade in)
            this.panel.get("boundingBox").setStyle("opacity", 0);
            this.panel.get("boundingBox").transition({
                opacity: 1,
                duration: 0.25,
            });

            // Automatically hide the toast after 3 seconds
            setTimeout(() => {
                this.panel.get('boundingBox').transition({
                    opacity: 0,
                    duration: 0.25
                }, () => {
                    this.panel.hide();

                    // FIXME: memory leak
                    // this.panel.destroy();
                });
            }, 5000);
        }
    },
    setup: function () {
        // $Y.later(3000, this, () => {
        //     this.__instance = new this.__Toast('New Notification', 'ifhgoiew ehvniweo hviohweo hvio hweoh vohwei hvnkowe o vbnokedhovhedkohvos odhiv', {
        //         position: 'bottom-right',
        //         margin: 20
        //     });
        //     this.__instance.show();
        // });
    },
    show: function (header, message) {
        const toast = new this.__Toast(header, message, {
            position: "bottom-right", // Can be center, top-center, bottom-right, etc.
            margin: 20, // Margin from the border
        });
        toast.show();
    },
};
