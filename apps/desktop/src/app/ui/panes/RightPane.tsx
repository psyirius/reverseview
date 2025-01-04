import {useEffect } from "preact/hooks";
import {$RvW} from "@/rvw";
import {selectedTab} from "@stores/global";

import RightVersesTab from "@app/ui/tabs/RightVersesTab";
import RightLyricsTab from "@app/ui/tabs/RightLyricsTab";
import RightSettingsTab from "@app/ui/tabs/RightSettingsTab";
import RightSearchTab from "@app/ui/tabs/RightSearchTab";
import RightNotesTab from "@app/ui/tabs/RightNotesTab";
import RightScheduleTab from "@app/ui/tabs/RightScheduleTab";
import RightGraphicsTab from "@app/ui/tabs/RightGraphicsTab";
import {useStoreState} from "@/utils/hooks";
import {console} from "@/platform/adapters/air";
import Tabs from "@app/ui/Tabz";

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

export default function RightPane() {
    const rti = $RvW.rvwPreferences.get('app.state.rightTabActiveIndex', 0);

    const activeTab = useStoreState(selectedTab);

    useEffect(() => {
        $RvW.rightTabView?.setSelectedTab(activeTab);
    }, [activeTab]);

    function onTabChange(index: number) {
        // console.log('Right Pane Tab changed to:', index);

        selectedTab.set(index);

        switch (index) {
            case 0: {
                $RvW.leftTabView.setSelectedTab(0);
                break;
            }
            case 1: {
                $RvW.leftTabView.setSelectedTab(1);
                break;
            }
        }
    }

    return (
        <div class="right-pane">
            <Tabs
                tabs={tabs.map(({label, content}) => ({title: label, content}))}
                initialSelected={rti}
                onChange={onTabChange}
                ref={e => $RvW.rightTabView = e}
            />
        </div>
    );
}