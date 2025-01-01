import {console} from "@/platform/adapters/air";
import {$RvW} from "@/rvw";

import LeftBibleTab from "@app/ui/tabs/LeftBibleTab";
import LeftSongsTab from "@app/ui/tabs/LeftSongsTab";
import Tabs from "@app/ui/Tabz";

const tabs = [
    {
        id: "left-tab-bible",
        label: "Bible",
        content: LeftBibleTab,
    },
    {
        id: "left-tab-songs",
        label: "Songs",
        content: LeftSongsTab,
    },
];

export default function LeftPane() {
    const lti = $RvW.rvwPreferences.get('app.state.leftTabActiveIndex', 0);

    function onTabChange(index: number) {
        console.log('Left Pane Tab changed to:', index);

        switch (index) {
            case 0: {
                $RvW.rightTabView.setSelectedTab(0);
                break;
            }
            case 1: {
                $RvW.rightTabView.setSelectedTab(1);
                break;
            }
        }
    }

    return (
        <div class="left-pane w-[22.5rem]">
            <Tabs
                tabs={tabs.map(({label, content}) => ({title: label, content}))}
                initialSelected={lti}
                onChange={onTabChange}
                ref={e => $RvW.leftTabView = e}
            />
        </div>
    );
}