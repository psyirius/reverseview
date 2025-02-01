import { $RvW } from "@/rvw";
import { Toast } from "@app/toast";
import {presentingLyric, selectedSong} from "@stores/global";
import { useStoreState } from "@/utils/hooks";
import {presenter, songNavigator} from "@app/glc";
import { SearchFilterType } from "@/song/song-manager";
import {useEffect, useRef, useState} from "preact/hooks";

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
                            <div class="ui basic segment">
                                {lyrics.map((slide: any[], i: number) => (
                                    <div
                                        key={i}
                                        class="ui segments cursor-pointer"
                                        role="button"
                                        // tabIndex={0}
                                        onClick={(e) => onClickOnSlide(e, i)}
                                        onDblClick={(e) => onDoubleClickOnSlide(e, i)}
                                        style={{
                                            borderStyle: 'solid',
                                            borderWidth: '2px',
                                            borderColor: isPresentingSlide(i) ? '#fc5c65' : (
                                                isActiveSlide(i) ? '#45aaf2' : 'transparent'
                                            ),
                                        }}
                                    >
                                        <>
                                            {/*<p>Slide {k + 1}</p>*/}
                                            {slide.map(({font, content}: any, j: number) => (
                                                <div
                                                    key={j}
                                                    class="ui segment"
                                                    style={{
                                                        fontFamily: font,
                                                    }}
                                                >
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