// interface Tab {
//     title: string;
//     content: string | VNode;
// }
//
// interface TabsProps {
//     tabs: Tab[];
//     initialSelected?: number;
// }
//
// interface TabsState {
//     selectedTab: number;
// }
//
// class Tabs extends Component<TabsProps, TabsState> {
//     state: TabsState;
//     handleTabClick: (index: number) => void;
//
//     constructor(props: TabsProps) {
//         super(props);
//         this.state = {
//             selectedTab: props.initialSelected || 0,
//         };
//         this.handleTabClick = (index) => {
//             this.setState({ selectedTab: index });
//         };
//     }
//
//     render() {
//         const { tabs } = this.props;
//         const { selectedTab } = this.state;
//
//         const tabElements = tabs.map((tab, index) => (
//             <div
//                 key={index}
//                 className={`tab ${selectedTab === index ? 'selected' : ''}`}
//                 onClick={() => this.handleTabClick(index)}
//             >
//                 {tab.title}
//             </div>
//         ));
//
//         const TabContent = tabs[selectedTab] && tabs[selectedTab].content;
//
//         return (
//             <div className="tabs-container">
//                 <div className="tabs">{tabElements}</div>
//                 <div className="tab-content">{TabContent}</div>
//             </div>
//         );
//     }
// }

import {Component, JSX} from "preact";

interface Tab {
    title: string;
    content: () => JSX.Element;
}

interface TabsProps {
    tabs: Tab[];
    initialSelected?: number;
    onChange?: (index: number) => void;
}

interface TabsState {
    selectedTab: number;
}

class Tabs extends Component<TabsProps, TabsState> {
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

    public getSelectedTab() {
        return this.state.selectedTab;
    }

    public setSelectedTab(index: number) {
        this.setState({ selectedTab: index });
    }

    componentWillUpdate(nextProps: Readonly<TabsProps>, nextState: Readonly<TabsState>, nextContext: any) {
        if (nextState.selectedTab !== this.state.selectedTab) {
            this.props.onChange?.(nextState.selectedTab);
        }
    }

    render() {
        const { tabs } = this.props;
        const { selectedTab } = this.state;

        const tabTriggers = tabs.map((tab, index) => (
            <a
                key={index}
                className={`item ${selectedTab === index ? 'active' : ''}`}
                onClick={() => this.handleTabClick(index)}
            >
                {tab.title}
            </a>
        ));

        const tabContents = tabs.map(({content: Content}, index) => (
            <div
                key={index}
                className={`ui bottom attached tab segment ${selectedTab === index ? 'active' : ''} h-full w-full`}
                style={{
                    borderTop: 'none',
                }}
            >
                <Content />
            </div>
        ));

        // TODO: make this dynamic
        const itemCount = ((c) => {
            switch (c) {
                case 2: return 'two';
                case 3: return 'three';
                case 4: return 'four';
                case 7: return 'seven';
                default: throw new Error('Unsupported tab count');
            }
        })(tabs.length);

        return (
            <div class="h-full flex flex-col">
                <div class="flex-[0]">
                    <div class={`ui fluid ${itemCount} item top attached menu`}>
                        {tabTriggers}
                    </div>
                </div>
                <div class="flex-1 h-full w-full relative">
                    <div class="absolute h-full w-full">
                        {tabContents}
                    </div>
                </div>
            </div>
        );
    }
}

export default Tabs;