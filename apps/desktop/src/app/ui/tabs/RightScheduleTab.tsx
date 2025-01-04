import {$RvW} from "@/rvw";
import {useStoreState} from "@/utils/hooks";
import {ScheduleItemType, scheduleList} from "@stores/global";
import {scheduler, songManager} from "@/app/glc";
import {console} from "@/platform/adapters/air";
import {Component} from "preact";
import {SongSlideContent} from "@/song/song-manager";

interface Props {
    scheduleList: any[]; // Replace 'any[]' with the actual type of scheduleList if known
}

interface State {
    selectedItem: number;
    currentItem: any; // Replace 'any' with the actual type of currentItem if known
}

class _RightScheduleTab extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedItem: -1,
            currentItem: null,
        };
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.props.scheduleList !== prevProps.scheduleList) {
            if (this.state.selectedItem >= this.props.scheduleList.length) {
                this.setState({ selectedItem: -1 });
            }
        }

        if (this.state.selectedItem !== prevState.selectedItem) {
            this.handleSelectedItemChange();
        }
    }

    isInvalidSelection = () => {
        return (this.state.selectedItem < 0) || (this.state.selectedItem >= this.props.scheduleList.length);
    };

    isSelectedFirst = () => {
        return this.state.selectedItem === 0;
    };

    isSelectedLast = () => {
        return this.state.selectedItem === (this.props.scheduleList.length - 1);
    };

    onSelectItem = (index: number) => {
        this.setState({ selectedItem: index });
        // TODO: render selected item's content
        // $RvW.scheduleObj.onSelChange(index);
    };

    locateItem = (index: number) => {
        scheduler.locate(scheduler.entries()[index]);
        // $RvW.scheduleObj.locateScheduleItem(index);
    };

    deleteItem = (index: number) => {
        scheduler.remove(scheduler.entries()[index]);
        // $RvW.scheduleObj.processDelete(index);
    };

    deleteAllItems = () => {
        // TODO: prompt user for confirmation
        scheduler.clear();
        // $RvW.scheduleObj.processDeleteAll();
    };

    moveItemUp = () => {
        if (scheduler.moveUp(scheduler.entries()[this.state.selectedItem])) {
            this.setState(prevState => ({ selectedItem: prevState.selectedItem - 1 }));
        }
        // $RvW.scheduleObj.processUp(selectedItem);
    };

    moveItemDown = () => {
        if (scheduler.moveDown(scheduler.entries()[this.state.selectedItem])) {
            this.setState(prevState => ({ selectedItem: prevState.selectedItem + 1 }));
        }
        // $RvW.scheduleObj.processDown(selectedItem);
    };

    handleSelectedItemChange = () => {
        if (this.isInvalidSelection()) {
            console.log('Invalid selection');
            this.setState({ currentItem: null });
            return;
        }

        const item = this.props.scheduleList[this.state.selectedItem];
        console.log('SCH ITEM:', item);

        if (item.type === ScheduleItemType.VERSE) {
            const [book, chapter, verse] = item.meta.ref.split(':').map(Number);

            const pri = $RvW.getSingleVerse(book, chapter, verse, 1);
            const sec = $RvW.getSingleVerse(book, chapter, verse, 2);

            const v = [pri, sec];

            console.log('VERSE ITEM:', v);

            this.setState({ currentItem: v });
        } else {
            const song = songManager.getSong(item.meta.ref);
            // const song = songManager.getSong(207629);
            console.log('SONG ITEM:', song);

            this.setState({ currentItem: song?.slides });
        }
    };

    render() {
        const { scheduleList } = this.props;
        const { selectedItem, currentItem } = this.state;

        return (
            <div class="flex flex-row h-full w-full">
                <div class="flex-[0]">
                    <div class="flex flex-col h-full w-[22rem]" style={{}}>
                        <div class="flex-1 h-full w-full relative">
                            <div class="ui middle aligned selection list w-full h-full absolute" style={{
                                overflowX: 'hidden',
                                overflowY: 'auto',
                                border: '1px solid rgba(34, 36, 38, .15)',
                                borderRadius: '0.28571429rem',
                                borderBottomRightRadius: 0,
                                borderBottomLeftRadius: 0,
                            }}>
                                {scheduleList.map(({type, title, description}, i) => (
                                    <div
                                        key={i}
                                        class={`item ${i === selectedItem ? 'active' : ''}`}
                                        onClick={() => this.onSelectItem(i)}
                                    >
                                        <div class="right floated content">
                                            <div class="ui buttons">
                                                <button
                                                    class="ui icon button"
                                                    data-tooltip="Locate"
                                                    onClick={() => this.locateItem(i)}
                                                >
                                                    <i aria-hidden="true" class="bullseye icon"></i>
                                                </button>
                                                <button
                                                    class="ui icon negative button"
                                                    data-tooltip="Remove"
                                                    onClick={() => this.deleteItem(i)}
                                                >
                                                    <i aria-hidden="true" class="trash icon"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <i class={`large middle aligned icon ${type === ScheduleItemType.VERSE ? 'book' : 'music'}`}></i>
                                        <div class="content">
                                            <div class="header">{title}</div>
                                            {description && <div class="meta">{description}</div>}
                                        </div>
                                    </div>
                                ))}

                                {/* Empty */}
                                {(scheduleList.length === 0) && (
                                    <div class="flex flex-col h-full w-full justify-center items-center">
                                        <div class="ui compact message">
                                            <p>The schedule is empty!</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div class="flex-[0] w-full">
                            <div class="ui buttons attached">
                                <button
                                    class="ui left labeled icon button fluid"
                                    onClick={() => this.moveItemUp()}
                                    disabled={this.isInvalidSelection() || this.isSelectedFirst()}
                                >
                                    <i class="caret up icon"></i>
                                    Move Up
                                </button>
                                <button
                                    class="ui right labeled icon button fluid"
                                    onClick={() => this.moveItemDown()}
                                    disabled={this.isInvalidSelection() || this.isSelectedLast()}
                                >
                                    Move Down
                                    <i class="caret down icon"></i>
                                </button>
                            </div>
                            <div class="ui buttons bottom attached">
                                <button
                                    class="ui right labeled icon button negative fluid"
                                    onClick={() => this.deleteAllItems()}
                                    disabled={scheduleList.length === 0}
                                >
                                    <i class="trash icon"></i>
                                    Delete All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto h-full w-full relative">
                    <div
                        id="sch_verseTextID"
                        class="absolute h-full w-full m-0 p-0 overflow-hidden overflow-y-auto"
                        style={{
                            border: '1px solid #d4d4d5',
                            borderRadius: '0.28571429rem',
                        }}
                    >
                        {!currentItem ? (
                            <div class="flex flex-col h-full w-full justify-center items-center">
                                <div class="ui compact message">
                                    <p>Select an item to view its content.</p>
                                </div>
                            </div>
                        ) : (
                            (scheduleList[selectedItem].type === ScheduleItemType.VERSE) ? (
                                <>
                                    <b>{scheduleList[selectedItem].title}</b>

                                    {currentItem.map((v: string, i: number) => (
                                        <div key={i} class="ui compact message">
                                            <p>{v}</p>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <b>{scheduleList[selectedItem].title}</b>

                                    <div class="ui segments">
                                        {currentItem.map(({font, content}: SongSlideContent, i: number) => (
                                            <div key={i} style={{
                                                fontFamily: font,
                                            }} class="ui segment">
                                                {/* FIXME: content might be null sometimes */}
                                                {content && content.map((lines: string[], j: number) => (
                                                    <div key={j} class="ui compact message">
                                                        {lines.map((line: string, k: number) => (
                                                            <p key={k}>{line}</p>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default function RightScheduleTab() {
    const scheduleItems = useStoreState(scheduleList);

    return <_RightScheduleTab scheduleList={scheduleItems} />
}