import LeftPane from "./panes/LeftPane";
import RightPane from "./panes/RightPane";
import {Component, VNode} from "preact";

interface Tab {
    title: string;
    content: string;
}

interface TabsProps {
    tabs: Tab[];
    initialSelected?: number;
}

interface TabsState {
    selectedTab: number;
}

class Tabs extends Component<TabsProps, TabsState> {
    state: TabsState;
    handleTabClick: (index: number) => void;

    constructor(props: TabsProps) {
        super(props);
        this.state = {
            selectedTab: props.initialSelected || 0,
        };
        this.handleTabClick = (index) => {
            this.setState({ selectedTab: index });
        };
    }

    render() {
        const { tabs } = this.props;
        const { selectedTab } = this.state;

        const tabElements = tabs.map((tab, index) => (
            <div
                key={index}
                className={`tab ${selectedTab === index ? 'selected' : ''}`}
                onClick={() => this.handleTabClick(index)}
            >
                {tab.title}
            </div>
        ));

        const selectedContent = tabs[selectedTab] && tabs[selectedTab].content;

        return (
            <div className="tabs-container">
                <div className="tabs">{tabElements}</div>
                <div className="tab-content">{selectedContent}</div>
            </div>
        );
    }
}

export default function ContentPane() {
    const leftPaneSize = '22.5rem';

    return (
        <>
            {/*<div class="kxy">*/}
            {/*    <div class="ui segment horizontal attached">*/}
            {/*        <Tabs*/}
            {/*            tabs={[*/}
            {/*                { title: 'Tab 1', content: 'Content 1' },*/}
            {/*                { title: 'Tab 2', content: 'Content 2' },*/}
            {/*                { title: 'Tab 3', content: 'Content 3' },*/}
            {/*            ]}*/}
            {/*        />*/}
            {/*        <Tabs*/}
            {/*            tabs={[*/}
            {/*                { title: 'Tab 1', content: 'Content 1' },*/}
            {/*                { title: 'Tab 2', content: 'Content 2' },*/}
            {/*                { title: 'Tab 3', content: 'Content 3' },*/}
            {/*            ]}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div id="content-pane">
                <div id="content-wrapper" style={{
                    marginLeft: leftPaneSize, /* also hardcoded width in LeftPane */
                    padding: '0.5rem',
                }}>
                    <LeftPane width={leftPaneSize} />
                    <RightPane/>

                    {/*<div id="cleared"></div>*/}
                </div>
            </div>
        </>
    )
}