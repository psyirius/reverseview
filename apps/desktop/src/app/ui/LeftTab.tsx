import {useEffect, useId, useRef} from "@lib/zrx/hooks";
import {$RvW} from "@/rvw";

import LeftBibleTab from "@app/ui/tabs/LeftBibleTab";
import LeftSongsTab from "@app/ui/tabs/LeftSongsTab";

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

export default function LeftTab() {
    // const id = useId();
    const id = 'container';

    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { TabView } = $Y;

        const tabview = new TabView({
            srcNode: container.current!,
        });

        tabview.render();

        const lti = $RvW.rvwPreferences.get('app.state.leftTabActiveIndex', 0);
        tabview.selectChild(lti);

        tabview.after('selectionChange', (e: any) => {
            const currentTab = e.newVal;

            switch (currentTab.get('index')) {
                case 0: {
                    $RvW.rightTabView.selectChild(0);
                    break;
                }
                case 1: {
                    $RvW.rightTabView.selectChild(1);
                    break;
                }
            }
        });

        $RvW.leftTabView = tabview;
    }, []);

    return (
        <div id={id} ref={container} class="tabContainer">
            {/* Tab Headers */}
            <ul>
                {tabs.map(({id, label}, i) => (
                    <li key={i}>
                        <a href={'#' + id}>{label}</a>
                    </li>
                ))}
            </ul>

            {/* Tab Contents */}
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