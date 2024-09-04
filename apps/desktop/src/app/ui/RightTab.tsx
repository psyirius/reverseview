import {useEffect, useId, useRef} from "@lib/zrx/hooks";
import {$RvW} from "@/rvw";
import {selectedTab} from "@stores/global";

import RightVersesTab from "@app/ui/tabs/RightVersesTab";
import RightLyricsTab from "@app/ui/tabs/RightLyricsTab";
import RightSettingsTab from "@app/ui/tabs/RightSettingsTab";
import RightSearchTab from "@app/ui/tabs/RightSearchTab";
import RightNotesTab from "@app/ui/tabs/RightNotesTab";
import RightScheduleTab from "@app/ui/tabs/RightScheduleTab";
import RightGraphicsTab from "@app/ui/tabs/RightGraphicsTab";

const tabs = [
    {
        id: "right-tab-bible",
        label: "Verses",
        content: RightVersesTab,
    },
    {
        id: "right-tab-lyrics",
        label: "Lyrics",
        content: RightLyricsTab,
    },
    {
        id: "right-tab-notes",
        label: "Notes",
        content: RightNotesTab,
    },
    {
        id: "right-tab-search",
        label: "Search",
        content: RightSearchTab,
    },
    {
        id: "right-tab-schedule",
        label: "Schedule",
        content: RightScheduleTab,
    },
    {
        id: "right-tab-graphics",
        label: "Graphics",
        content: RightGraphicsTab,
    },
    {
        id: "right-tab-settings",
        label: "Settings",
        content: RightSettingsTab,
    },
];

export default function LeftTab() {
    // const id = useId();
    const id = 'container2';

    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // @ts-ignore
        const { TabView } = $Y;

        const tabview = new TabView({
            srcNode: container.current,
        });

        tabview.render();

        const rti = $RvW.rvwPreferences.get('app.state.rightTabActiveIndex', 0);
        tabview.selectChild(rti);

        function menuBarSync(currentTab: any) {
            // air.trace('menuBarSync', currentTab.get('index'));
            selectedTab.set(currentTab.get('index'));
        }

        menuBarSync(tabview.get('selection'));

        tabview.after('selectionChange', (e: any) => {
            const currentTab = e.newVal;

            menuBarSync(currentTab);

            // TODO: figure out store base tab sync
            switch (currentTab.get('index')) {
                case 0: {
                    $RvW.leftTabView.selectChild(0);
                    break;
                }
                case 1: {
                    $RvW.leftTabView.selectChild(1);
                    break;
                }
            }
        });

        $RvW.rightTabView = tabview;
    }, []);

    return (
        <div id={id} ref={container} class="verseContainer">
            {/* TabView List */}
            <ul>
                {tabs.map(({id, label}, i) => (
                    <li key={i}>
                        <a href={'#' + id}>{label}</a>
                    </li>
                ))}
            </ul>

            {/* TabView Panel */}
            <div>
                {tabs.map(({id, content: Content}, i) => (
                    <div key={i} id={id}>
                        <Content />
                    </div>
                ))}
            </div>
        </div>
    );
}