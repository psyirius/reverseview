import { $RvW } from "@/rvw";
import { Toast } from "@app/toast";
import { selectedSong } from "@stores/global";
import { useStoreState } from "@/utils/hooks";
import {presenter, songNavigator} from "@app/glc";
import { SearchFilterType } from "@/song/song-manager";

function _RightLyricsTab_({song}) {
    const navFontSize = $RvW.vvConfigObj.get_navFontSize();

    const {
        name,
        title,
        serial,
        author,
        category,
        key,
        tags,
        notes,
        lyrics = [],
    } = song || {};

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

    function presentSlide(index: number) {
        presenter.presentSong(song, index);
    }

    const actions = [
        { label: 'Edit', icon: 'edit', onClick: onClickEdit },
        { label: 'Present', icon: 'play', onClick: () => presentSlide(0) },
        { label: 'Schedule', icon: 'plus square', onClick: onClickAddToSchedule },
    ]

    return (
        <div class="flex flex-col h-full w-full overflow-auto">
            {song ? (
                <>
                    {/* TITLE SEQUENCE */}
                    <div class="ui vertical segment">
                        {serial && <div class="ui top right attached label">{serial}</div>}
                        <h3 class="ui header">
                            {name}
                            <div class="sub header">
                                {title}
                            </div>
                        </h3>
                    </div>

                    {/* BUTTONS */}
                    <div class="ui vertical segment">
                        {actions.map((action, i) => (
                            <button class="ui labeled icon button compact" onClick={action.onClick} key={i}>
                                <i class={"icon " + action.icon}></i>
                                {action.label}
                            </button>
                        ))}
                    </div>

                    {/* SLIDES */}
                    <div class="flex-1 h-full w-full relative">
                        <div class="absolute h-full w-full m-0 p-2 overflow-auto" style={{
                            border: '1px solid #d4d4d5',
                            borderRadius: '0.28571429rem',
                            fontSize: navFontSize + 'px',
                        }}>
                            {/* TODO: chunked listing */}
                            {lyrics && (
                                <div class="ui cards">
                                    {lyrics[0].slides.map((_slide: string, i: number) => (
                                        <div class="card cursor-pointer" role="button" tabIndex={0} onClick={() => presentSlide(i)}>
                                            <div class="content">
                                                <div class="header">{i + 1}</div>
                                                <div class="meta"></div>
                                                <div class="description">
                                                    <div
                                                        class="context"
                                                        dangerouslySetInnerHTML={{
                                                            __html: (lyrics[0].slides[i]).replace(/\n/g, '<br>'),
                                                        }}
                                                        style={{
                                                            padding: '10px',
                                                            borderRadius: '0.28571429rem',
                                                            backgroundColor: $RvW.highlightColor,
                                                            fontFamily: lyrics[0].font,
                                                        }}
                                                    ></div>

                                                    {lyrics[1]?.slides[i] && (
                                                        <>
                                                            <div class="h-2"></div>

                                                            <div
                                                                class="context"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: (lyrics[1]?.slides[i]).replace(/\n/g, '<br>'),
                                                                }}
                                                                style={{
                                                                    padding: '10px',
                                                                    borderRadius: '0.28571429rem',
                                                                    backgroundColor: $RvW.highlightColor,
                                                                    fontFamily: lyrics[1].font,
                                                                }}
                                                            ></div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ADDITIONAL INFO */}
                    <div class="flex flex-col pt-2">
                        <div class="ui form">
                            <div class="inline fields">
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
                                    <label>Category</label>
                                    {category && (
                                        <a class="ui label" onClick={() => filterByCategory(category)}>
                                            {category}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div class="inline fields">
                                <div class="eight wide field">
                                    <label>Key</label>
                                    {key && (
                                        <a class="ui label" onClick={() => filterByKey(key)}>
                                            {key}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div class="inline fields">
                                <div class="eight wide field">
                                    <label>Author</label>
                                    {author && (
                                        <a class="ui label" onClick={() => filterByAuthor(author)}>
                                            {author}
                                        </a>
                                    )}
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
        <_RightLyricsTab_ song={song} />
    )
}