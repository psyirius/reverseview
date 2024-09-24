import {useEffect, useRef} from "preact/hooks";

import * as BorderContainer from "dijit/layout/BorderContainer";
import * as TabContainer from "dijit/layout/TabContainer";
import * as ContentPane from "dijit/layout/ContentPane";
import * as registry from "dijit/registry";

interface Props {
    dev?: boolean;
}

let tabCounter = 1;

export default function App({ dev }: Props) {
    const _appLayoutRef = useRef(null);
    const _mainTab = useRef(null);

    function addTab(name: string) {
        const pane = new ContentPane({
            title: name,
            content: `<h4>${name}</h4>`
        });
        registry.byId("contentTabs").addChild(pane);
    }

    useEffect(() => {
        // create the BorderContainer and attach it to our appLayout div
        const appLayout = new BorderContainer({
            design: "headline"
        }, _appLayoutRef.current!);

        // create the TabContainer
        const contentTabs = new TabContainer({
            region: "center",
            id: "contentTabs",
            tabPosition: "top",
            class: "centerPanel",
            href: "contentCenter.html"
        });

        // add the TabContainer as a child of the BorderContainer
        appLayout.addChild( contentTabs );

        // create and add the BorderContainer edge regions
        appLayout.addChild(
            new ContentPane({
                region: "top",
                class: "edgePanel",
                content: "Header content (top)"
            })
        );
        appLayout.addChild(
            new ContentPane({
                region: "left",
                id: "leftCol",
                class: "edgePanel",
                content: "Sidebar content (left)",
                splitter: true
            })
        );

        // Add initial content to the TabContainer
        contentTabs.addChild(
            new ContentPane({
                title: "Main"
            }, _mainTab.current!)
        );

        // start up and do layout
        appLayout.startup();
    }, []);

    return (
        <>
            <div id="appLayout" class="demoLayout" ref={_appLayoutRef}></div>

            <div ref={_mainTab}>
                <h4>Starting Content</h4>

                <button
                    id="createTabBtn"
                    onClick={() => addTab("Tab " + (++tabCounter))}
                >New tab</button>
            </div>
        </>
    );
}