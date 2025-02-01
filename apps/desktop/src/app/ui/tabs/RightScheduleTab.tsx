import {$RvW} from "@/rvw";
import {useStoreState} from "@/utils/hooks";
import {ScheduleItemType, scheduleList, presentingBible, presentingLyric, selectedBible} from "@stores/global";
import {presenter, scheduler, songManager} from "@/app/glc";
import {console} from "@/platform/adapters/air";
import {Component} from "preact";

interface Props {
    scheduleList: any[]; // Replace 'any[]' with the actual type of scheduleList if known
    presentingLyric: {
        id?: number;
        slide?: number;
    },
    selectedBible: [number, number, number];
    presentingBible: [number, number, number];
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
    };

    locateItem = (index: number) => {
        scheduler.locate(this.props.scheduleList[index]);
    };

    deleteItem = (index: number) => {
        scheduler.remove(this.props.scheduleList[index]);
    };

    deleteAllItems = () => {
        // TODO: prompt user for confirmation
        scheduler.clear();
    };

    moveItemUp = () => {
        if (scheduler.moveUp(this.props.scheduleList[this.state.selectedItem])) {
            this.setState(prevState => ({ selectedItem: prevState.selectedItem - 1 }));
        }
    };

    moveItemDown = () => {
        if (scheduler.moveDown(this.props.scheduleList[this.state.selectedItem])) {
            this.setState(prevState => ({ selectedItem: prevState.selectedItem + 1 }));
        }
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

            const v = [{
                font: $RvW.priFontName,
                content: pri,
            }, {
                font: $RvW.secFontName,
                content: sec,
            }];

            console.log('VERSE ITEM:', v);

            this.setState({ currentItem: [item, v] });
        } else {
            const song = songManager.getSong(item.meta.ref); // ref is song ID
            // const song = songManager.getSong(207629);
            console.log('SONG ITEM:', song);

            const lyrics = [];

            // flatten lyrics
            if (song) {
                const lyx = song.lyrics;

                for (let k = 0; k < lyx.length; k++) {
                    const lyr = lyx[k];

                    for (let i = 0; i < lyr.slides.length; i++) {
                        const slide = lyr.slides[i];

                        const slx = (lyrics[i] ||= []);
                        slx.push({
                            index: k,
                            font: lyr.font,
                            content: slide.trim().replace(/\n/g, '<br>'),
                        });
                    }
                }
            }

            this.setState({ currentItem: [item, lyrics] });
        }
    };

    presentVerse = (item: any) => {
        console.log('Presenting verse:', item);

        const [book, chapter, verse] = item.meta.ref.split(':').map(Number);

        $RvW.present_external(book, chapter, verse);
    }

    presentSlide = (item: any, i: number) => {
        console.log('Presenting slide:', item, i);

        const id = Number(item.meta.ref);
        const song = songManager.getSong(id);

        if (!song) {
            console.error('Song not found:', id);
            return;
        }

        presenter.presentSong(song, i);
    }

    isActiveVerse = (ref: number[]) => {
        const [
            activeBook,
            activeChapter,
            activeVerse,
        ] = this.props.selectedBible;

        const [bs, cs, vs] = ref.map(e => (e - 1));
        const [ba, ca, va] = [activeBook, activeChapter, activeVerse];

        return (bs === ba) && (cs === ca) && (vs === va);
    }

    isPresentingVerse = (ref: number[]) => {
        const [
            presentingBook,
            presentingChapter,
            presentingVerse,
        ] = this.props.presentingBible;

        const [bs, cs, vs] = ref.map(e => (e - 1));
        const [ba, ca, va] = [presentingBook, presentingChapter, presentingVerse];

        return (bs === ba) && (cs === ca) && (vs === va);
    }

    onClickOnVerseOrSlide = (item: any, i: number) => {

    }

    onDoubleClickOnVerseOrSlide = (item: any, i: number) => {

    }

    isSlideOrVerseActive = (item: any, i: number) => {

    }

    isSlideOrVersePresenting = (item: any, i: number) => {

    }

    render() {
        const { scheduleList } = this.props;
        const { selectedItem, currentItem } = this.state;
        const {
            id: presentSongId,
            slide: presentLyricSlide,
        } = this.props.presentingLyric;
        const navFontSize = $RvW.vvConfigObj.get_navFontSize();

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
                                                    // data-tooltip="Locate"
                                                    onClick={() => this.locateItem(i)}
                                                >
                                                    <i aria-hidden="true" class="bullseye icon"></i>
                                                </button>
                                                <button
                                                    class="ui icon negative button"
                                                    // data-tooltip="Remove"
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
                            <div class="ui basic buttons attached">
                                <button
                                    class="ui icon button fluid"
                                    onClick={() => this.moveItemUp()}
                                    disabled={this.isInvalidSelection() || this.isSelectedFirst()}
                                >
                                    <i class="caret up icon"></i>
                                </button>
                                <button
                                    class="ui icon button fluid"
                                    onClick={() => this.moveItemDown()}
                                    disabled={this.isInvalidSelection() || this.isSelectedLast()}
                                >
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
                        class="absolute h-full w-full m-0 p-0 overflow-hidden overflow-y-auto"
                        style={{
                            border: '1px solid #d4d4d5',
                            borderRadius: '0.28571429rem',
                            fontSize: navFontSize + 'px',
                        }}
                    >
                        {!currentItem ? (
                            <div class="flex flex-col h-full w-full justify-center items-center">
                                <div class="ui compact message">
                                    <p>Select an item to view its content.</p>
                                </div>
                            </div>
                        ) : (
                            (currentItem[0].type === ScheduleItemType.VERSE) ? (
                                <>
                                    <div class="ui basic segment">
                                        <b>{currentItem[0].title}</b>

                                        <div
                                            class="ui segments cursor-pointer"
                                            role="button"
                                            // tabIndex={0}
                                            onClick={() => this.presentVerse(currentItem[0])}
                                        >
                                            {currentItem[1].map(({font, content}, i: number) => (
                                                <div key={i} class="ui segment" style={{
                                                    fontFamily: font,
                                                }}>
                                                    <p class="m-0">{content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div class="ui basic segment">
                                        <b>{currentItem[0].title}</b>

                                        {currentItem[1].map((slide: any[], i: number) => (
                                            <div
                                                key={i}
                                                class="ui segments cursor-pointer"
                                                role="button"
                                                // tabIndex={0}
                                                onClick={() => this.presentSlide(currentItem[0], i)}
                                            >
                                                <>
                                                    {/*<p>Slide {k + 1}</p>*/}
                                                    {slide.map(({font, content}: any, j: number) => (
                                                        <div key={j} style={{fontFamily: font}} class="ui segment">
                                                            <p class="m-0" dangerouslySetInnerHTML={{
                                                                __html: content,
                                                            }}></p>
                                                        </div>
                                                    ))}
                                                    <div class="ui left floating label font-mono">{i + 1}</div>
                                                </>
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

    const _presentingLyric = useStoreState(presentingLyric) ?? {};
    const _presentingBible = useStoreState(presentingBible) || [-1, -1, -1];
    const _selectedBible = useStoreState(selectedBible) || [-1, -1, -1];

    return (
        <_RightScheduleTab
            scheduleList={scheduleItems}
            presentingLyric={_presentingLyric}
            presentingBible={_presentingBible}
            selectedBible={_selectedBible}
        />
    );
}