import { $RvW } from "@/rvw";
import { Toast } from "@app/toast";
import {presentingLyric, selectedSong} from "@stores/global";
import { useStoreState } from "@/utils/hooks";
import {presenter, songNavigator} from "@app/glc";
import { SearchFilterType } from "@/song/song-manager";
import {useEffect, useRef, useState} from "preact/hooks";
import {console} from "@/platform/adapters/air";

// const contextMenu = createContextMenu();
//
// function showContextMenu(event: Event) {
//     event.preventDefault();
//     contextMenu.display(window.nativeWindow.stage, event.clientX, event.clientY);
// }
//
// function createContextMenu(){
//     const menu = new air.NativeMenu();
//
//     const editCmd = menu.addItem(new air.NativeMenuItem("Edit"));
//     editCmd.addEventListener(air.Event.SELECT, () => {
//         alert("Edit!");
//     });
//
//     const presentCmd = menu.addItem(new air.NativeMenuItem("Present"));
//     presentCmd.addEventListener(air.Event.SELECT, () => {
//         alert("Present!");
//     });
//
//     const scheduleCmd = menu.addItem(new air.NativeMenuItem("Schedule"));
//     scheduleCmd.addEventListener(air.Event.SELECT, () => {
//         alert("Schedule!");
//     });
//
//     const cleanupCmd = menu.addItem(new air.NativeMenuItem("Cleanup"));
//     cleanupCmd.addEventListener(air.Event.SELECT, () => {
//         alert("Cleanup!");
//     });
//
//     const tlMenu = new air.NativeMenu();
//
//     const twoLinesMenu = menu.addSubmenu(tlMenu, 'Two Lines');
//
//     const twoLinesSelectedCmd = tlMenu.addItem(new air.NativeMenuItem("Selected"));
//     twoLinesSelectedCmd.addEventListener(air.Event.SELECT, () => {
//         alert("Two Lines (Selected)!");
//     });
//
//     const twoLinesAllCmd = tlMenu.addItem(new air.NativeMenuItem("All"));
//     twoLinesAllCmd.addEventListener(air.Event.SELECT, () => {
//         alert("Two Lines (All)!");
//     });
//
//     return menu;
// }

function SlidePreviewItem({
    index,
    slide,
    onDoubleClickOnSlide,
    onClickOnSlide,
    isPresentingSlide,
    isActiveSlide,
}) {
    const [selectedPreview, setSelectedPreview] = useState(0);

    useEffect(() => {
        console.log('SlidePreviewItem:', slide);
    }, [selectedPreview]);

    return (
        <div
            class="inline-block float-left m-[1px] cursor-pointer rounded-md"
            style={{
                // width: 0, height: 0, // 3:2
                // width: 0, height: 0, // 4:3
                width: 352, height: 198, // 16:9
                // width: 462, height: 198, // 21:9

                borderStyle: 'solid',
                borderWidth: '2px',
                borderColor: isPresentingSlide(index) ? '#fc5c65' : (
                    isActiveSlide(index) ? '#45aaf2' : 'rgba(34, 36, 38, .15)'
                ),
            }}
            // onContextMenu={showContextMenu}
            onClick={(e) => onClickOnSlide(e, index)}
            onDblClick={(e) => onDoubleClickOnSlide(e, index)}
        >
            <div class="flex flex-col h-full w-full">
                <div class="flex-1 h-full w-full relative">
                    <div
                        class="absolute h-full w-full cursor-pointer overflow-hidden"
                        role="button"
                        // tabIndex={0}
                        // style="-khtml-user-select:auto;"
                    >
                        {slide[selectedPreview] ? (
                            <div
                                class="flex flex-col justify-center items-center text-center h-full"
                                style={{
                                    fontFamily: slide[selectedPreview].font,
                                    fontSize: '1rem',
                                }}
                            >
                                <p class="m-0" dangerouslySetInnerHTML={{__html: slide[selectedPreview].content}}></p>
                            </div>
                        ) : (
                            <div class="flex flex-col justify-center items-center text-center h-full">
                                <div class="ui visible message">
                                    <p>No content</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    class="flex flex-row h-8 w-full justify-between items-center px-2 rounded-b-[3px]"
                    style={{
                        backgroundColor: 'rgba(34, 36, 38, .15)',
                    }}
                >
                    {/* Slide Number */}
                    <div
                        class="ui tiny label"
                    >
                        {index + 1}
                    </div>

                    {/* Slide variant switcher */}
                    <div class=""> {/* This div should exist for justify to always work */}
                        {slide.map((_: any, j: number) => (
                            <a
                                key={j}
                                class={`ui tiny basic label`}
                                onClick={() => setSelectedPreview(j)}
                                style={(j === selectedPreview) ? {
                                    backgroundColor: 'white',
                                    borderColor: '#45aaf2',
                                    color: '#45aaf2',
                                } : {}}
                            >
                                {j + 1}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function _RightLyricsTab_({song}) {
    const [navFontSize] = useState($RvW.vvConfigObj.get_navFontSize());

    const [selectedSlide, setSelectedSlide] = useState(-1);
    const [showMeta, setShowMeta] = useState(false);

    const {
        id: presentSongId,
        slide: presentLyricSlide,
    } = useStoreState(presentingLyric) ?? {};

    const {
        name,
        title,
        serial,
        author,
        copyright,
        category,
        key,
        bpm,
        tags,
        notes,
        chords,
    } = song || {};

    const lyrics = getLyrics();

    useEffect(() => {
        if (song?.id === presentSongId) {
            setSelectedSlide(presentLyricSlide);
        } else {
            setSelectedSlide(-1);
        }
    }, [song]);

    function getLyrics() {
        const lyrics = [];

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

        return lyrics;
    }

    function onClickEdit() {
        songNavigator.showSongEditDialog();
    }

    function onClickAddToSchedule() {
        songNavigator.addToSchedule(song, (result, error) => {
            if (error) {
                Toast.error('Error', error);
            } else {
                Toast.success(undefined, "Added verse to schedule");
            }
        });
    }

    function filterByTag(tag: string) {
        songNavigator.applyFilters([
            {
                type: SearchFilterType.TAGS,
                value: [tag],
            },
        ], (result, error) => {
            if (error) {
                Toast.error('Error', error);
            } else {
                Toast.success(undefined, "Filtered by tag");
            }
        });
    }

    function filterByCategory(category: string) {
        songNavigator.applyFilters([
            {
                type: SearchFilterType.CATEGORY,
                value: category,
            },
        ], (result, error) => {
            if (error) {
                Toast.error('Error', error);
            } else {
                Toast.success(undefined, "Filtered by category");
            }
        });
    }

    function filterByAuthor(author: string) {
        songNavigator.applyFilters([
            {
                type: SearchFilterType.AUTHOR,
                value: author,
            },
        ], (result, error) => {
            if (error) {
                Toast.error('Error', error);
            } else {
                Toast.success(undefined, "Filtered by author");
            }
        });
    }

    function filterByKey(key: string) {
        songNavigator.applyFilters([
            {
                type: SearchFilterType.KEY,
                value: key,
            },
        ], (result, error) => {
            if (error) {
                Toast.error('Error', error);
            } else {
                Toast.success(undefined, "Filtered by key");
            }
        });
    }

    function onClickOnSlide(e: MouseEvent, index: number) {
        setSelectedSlide(index);

        if (e.ctrlKey) {
            presentSlide(index);
        }
    }

    function onDoubleClickOnSlide(e: MouseEvent, index: number) {
        setSelectedSlide(index);
        presentSlide(index);
    }

    function presentSlide(index: number) {
        presenter.presentSong(song, index);
    }

    function isActiveSlide(index: number) {
        return selectedSlide === index;
    }

    function isPresentingSlide(index: number) {
        return presentLyricSlide === index && presentSongId === song.id;
    }

    const actions = [
        { label: 'Edit', icon: 'edit', onClick: onClickEdit },
        { label: 'Present', icon: 'play', onClick: () => presentSlide(0) },
        { label: 'Schedule', icon: 'plus square', onClick: onClickAddToSchedule },
    ]

    return (
        <div class="flex flex-col h-full w-full overflow-hidden overflow-y-auto">
            {song ? (
                <>
                    {/* TITLE SEQUENCE */}
                    <div class="ui vertical segment cursor-pointer"
                        onClick={() => {
                            setShowMeta(!showMeta);
                        }}
                    >
                        <div class="ui grid">
                            <div class="left floated fourteen wide column">
                                <h3 class="ui header">
                                    {name}
                                    <div class="sub header">
                                        {title}
                                    </div>
                                </h3>
                            </div>
                            <div class="right floated two wide column">
                                {serial ? <div class="ui label font-mono">{serial}</div> : null}
                            </div>
                        </div>
                    </div>

                    {/* ADDITIONAL INFO */}
                    {showMeta && (
                        <div class="flex flex-col pt-2">
                            <div class="ui form">
                                <div class="inline fields">
                                    <div class="eight wide field">
                                        <label>Category</label>
                                        {category ? (
                                            <a class="ui label" onClick={() => filterByCategory(category)}>
                                                {category}
                                            </a>
                                        ) : null}
                                    </div>
                                    <div class="eight wide field">
                                        <label>Tags</label>
                                        {tags.map((tag, i) => (
                                            <a key={i} class="ui label" onClick={() => filterByTag(tag)}>
                                                {tag}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div class="inline fields">
                                    <div class="eight wide field">
                                        <label>Key</label>
                                        {key ? (
                                            <a class="ui label" onClick={() => filterByKey(key)}>
                                                {key}
                                            </a>
                                        ) : null}
                                    </div>
                                    <div class="eight wide field">
                                        <label>BPM</label>
                                        {bpm ? (
                                            <a class="ui label">
                                                {bpm}
                                            </a>
                                        ) : null}
                                    </div>
                                </div>
                                <div class="inline fields">
                                    <div class="eight wide field">
                                        <label>Author</label>
                                        {author ? (
                                            <a class="ui label" onClick={() => filterByAuthor(author)}>
                                                {author}
                                            </a>
                                        ) : null}
                                    </div>
                                    <div class="eight wide field">
                                        <label>Copyright</label>
                                        {copyright ? (
                                            <a class="ui label">
                                                {copyright}
                                            </a>
                                        ) : null}
                                    </div>
                                </div>
                                <div class="inline fields">
                                    <div class="eight wide field">
                                        <label>Notes</label>
                                        {notes && (
                                            <p class="ui message">
                                                {notes}
                                            </p>
                                        )}
                                    </div>
                                    <div class="eight wide field">
                                        <label>Chords</label>
                                        {chords && (
                                            <p class="ui message">
                                                {chords}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BUTTONS */}
                    <div class="ui vertical segment" style={{
                        borderBottom: 'none',
                    }}>
                        {actions.map((action, i) => (
                            <button class="ui labeled icon button compact" onClick={action.onClick} key={i}>
                                <i class={"icon " + action.icon}></i>
                                {action.label}
                            </button>
                        ))}
                    </div>

                    {/* SLIDES */}
                    <div class="flex-1 h-full w-full relative">
                        <div class="absolute h-full w-full m-0 overflow-hidden overflow-y-auto" style={{
                            border: '1px solid #d4d4d5',
                            borderRadius: '0.28571429rem',
                            fontSize: navFontSize + 'px',
                        }}>
                            <div
                                class="ui basic segment"
                            >
                                {lyrics.map((slide: any[], i: number) => (
                                    <SlidePreviewItem
                                        key={`${song?.id}:${i}`}
                                        index={i}
                                        slide={slide}
                                        onClickOnSlide={onClickOnSlide}
                                        onDoubleClickOnSlide={onDoubleClickOnSlide}
                                        isActiveSlide={isActiveSlide}
                                        isPresentingSlide={isPresentingSlide}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div class="flex flex-col items-center justify-center h-full w-full">
                    <div class="text-2xl">No song selected</div>
                </div>
            )}
        </div>
    )
}

export default function RightLyricsTab() {
    const song = useStoreState(selectedSong);

    return (
        <_RightLyricsTab_ song={song}/>
    )
}