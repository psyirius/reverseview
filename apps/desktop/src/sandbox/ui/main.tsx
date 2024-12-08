// import { render } from 'preact';

import App from "./App";

import * as BorderContainer from "dijit/layout/BorderContainer";
import * as TabContainer from "dijit/layout/TabContainer";
import * as ContentPane from "dijit/layout/ContentPane";
import * as Tooltip from "dijit/Tooltip";
import * as dom from "dojo/dom";
import * as Editor from "dijit/Editor";
import * as Menu from "dijit/Menu";
import * as MenuItem from "dijit/MenuItem";
import * as MenuBar from "dijit/MenuBar";
import * as MenuBarItem from "dijit/MenuBarItem";
import * as PopupMenuBarItem from "dijit/PopupMenuBarItem";
import * as gfx from "dojox/gfx";
import * as gfxFx from "dojox/gfx/fx";
import * as Button from "dijit/form/Button";

export function setup(dev: boolean = false) {
    // render(<App dev={dev} />, document.getElementById("app")!);

    {
        // main app container
        const appLayout = new BorderContainer({
            design: "headline", // keeps the top container filling the whole width
        }, "appLayout");

        // Content Tabs
        const contentTabs = new TabContainer({
            id: "contentTabs",
            class: "contentPanel",
            region: "center",
            tabPosition: "top",
        });

        // Nav Tabs
        const navTabs = new TabContainer({
            id: "navTabs",
            class: "navPanel",
            region: "left",
            tabPosition: "top",
            splitter: true
        });

        // Top panel
        appLayout.addChild(
            new ContentPane({
                region: "top",
                class: "edgePanel",
                content: `HEADER`
            })
        );

        // Content Pane Tab 1
        navTabs.addChild(
            new ContentPane({
                title: "Bible",
                content: `Bible`,
            })
        );

        // Content Pane Tab 2
        navTabs.addChild(
            new ContentPane({
                title: "Songs",
                content: `
                SONGS
                `,
            })
        );

        appLayout.addChild(navTabs);

        // Content Pane Tab 1
        contentTabs.addChild(
            new ContentPane({
                title: "Verses",
                content: `
<div id="loadingOverlay" class="loadingOverlay pageOverlay">
    <div class="loadingMessage">Loading...</div>
</div>
`,
            })
        );

        // Content Pane Tab 2
        contentTabs.addChild(
            new ContentPane({
                title: "Lyrics",
                content: `
<h1>Demo: Mixed Tooltip Usages</h1>

<h2>Tooltip on a dijit/form/Button (Declarative)</h2>

<button id="tooltipButton">Tooltip Above</button>

<button id="tooltipButton2">Tooltip Below</button>

<button id="tooltipButton3">Tooltip After</button>

<button id="tooltipButton4">Tooltip Before</button>
                `,
                // postCreate: function() {
                //     alert(arguments);
                //
                //     // Call the parent method
                //     this.inherited(arguments);
                //
                //     // Custom initialization logic can go here
                //     console.log("ContentPane has been created and mounted");
                // },
            })
        );

        // Content Pane Tab 3
        contentTabs.addChild(
            new Editor({
                title: "Edit",
            })
        );

        // Content Pane Tab 4
        contentTabs.addChild(
            new ContentPane({
                title: "Viz",
                content: `
                <div id="surfaceElement" style="border:1px solid #ccc;width:400px;height:400px;"></div>
                `
            })
        );

        appLayout.addChild(contentTabs);

        // Add custom tooltip
        new Tooltip({
            connectId: ["tooltipButton"],
            label: `
            <span class="user-select-none">I am <strong>above</strong> the button</span>
            `,
            defaultPosition: ['below','above'],
            class: "customTip"
        });

        // start up and do layout
        appLayout.startup();

        const doAnimations = function() {
            new gfxFx.animateTransform({
                duration: 1200,
                shape: group,
                transform: [{
                    name: "rotategAt",
                    start: [0, 200, 200], // Starts at 0 degree rotation
                    end: [360, 200, 200]  // Ends at 360 degrees
                }]
            }).play();
            new gfxFx.animateTransform({
                duration: 1800,
                shape: group2,
                transform: [{
                    name: "rotategAt",
                    start: [0, 200, 200], // Starts at 0 degree rotation
                    end: [-360, 200, 200]  // Ends at 360 degrees
                }]
            }).play();
        };

        // Create a GFX surface
        // Arguments:  node, width, height
        var surface = gfx.createSurface("surfaceElement", 400, 400);

        // Create a group
        var group = surface.createGroup();

        // Create a circle
        var circle1 = group.createCircle({ cx: 100, cy: 300, r:50 }).setFill({
            type: "radial",
            cx: 100,
            cy: 300,
            colors: [
                { offset: 0,   color: "#f3001f" },
                { offset: 1,   color: "#a40016" }
            ]
        });
        var circle2 = group.createCircle({ cx: 100, cy: 100, r:50 }).setFill({
            type: "radial",
            cx: 100,
            cy: 100,
            colors: [
                { offset: 0,   color: "#f3001f" },
                { offset: 1,   color: "#a40016" }
            ]
        });
        var circle3 = group.createCircle({ cx: 300, cy: 300, r: 50 }).setFill({
            type: "radial",
            cx: 300,
            cy: 300,
            colors: [
                { offset: 0,   color: "#f3001f" },
                { offset: 1,   color: "#a40016" }
            ]
        });
        var circle4 = group.createCircle({ cx: 300, cy: 100, r: 50 }).setFill({
            type: "radial",
            cx: 300,
            cy: 100,
            colors: [
                { offset: 0,   color: "#f3001f" },
                { offset: 1,   color: "#a40016" }
            ]
        });

        var group2 = surface.createGroup();

        var icircle1 = group2.createCircle({ cx: 100, cy: 300, r: 25 }).setFill({
            type: "radial",
            cx: 100,
            cy: 300,
            colors: [
                { offset: 0,   color: "#b0bddd" },
                { offset: 1,   color: "#0543de" }
            ]
        });
        var icircle2 = group2.createCircle({ cx: 100, cy: 100, r: 25 }).setFill({
            type: "radial",
            cx: 100,
            cy: 100,
            colors: [
                { offset: 0,   color: "#b0bddd" },
                { offset: 1,   color: "#0543de" }
            ]
        });
        var icircle3 = group2.createCircle({ cx: 300, cy: 300, r: 25 }).setFill({
            type: "radial",
            cx: 300,
            cy: 300,
            colors: [
                { offset: 0,   color: "#b0bddd" },
                { offset: 1,   color: "#0543de" }
            ]
        });
        var icircle4 = group2.createCircle({ cx: 300, cy: 100, r: 25 }).setFill({
            type: "radial",
            cx: 300,
            cy: 100,
            colors: [
                { offset: 0,   color: "#b0bddd" },
                { offset: 1,   color: "#0543de" }
            ]
        });

        setInterval(doAnimations, 2500);
    }
}