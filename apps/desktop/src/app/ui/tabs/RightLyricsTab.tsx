import {SongSearchType} from "@/const";
import {$RvW} from "@/rvw";
import {Toast} from "@app/toast";
import {useStoreState} from "@/utils/hooks";
import {
    selectedSongStateAuthor,
    selectedSongStateCategory,
    selectedSongStateKey,
    selectedSongStateName1,
    selectedSongStateName2,
    selectedSongStateNotes,
    selectedSongStateObject,
    selectedSongStateSeqNum,
    selectedSongStateSlides,
    selectedSongStateTags
} from "@stores/global";
import {SongPresenter} from "@/song/present";

export default function RightLyricsTab() {
    const fontSize = $RvW.vvConfigObj.get_navFontSize();

    const obj = useStoreState(selectedSongStateObject);

    const slides = useStoreState(selectedSongStateSlides);
    const name1 = useStoreState(selectedSongStateName1);
    const name2 = useStoreState(selectedSongStateName2);
    const seqNum = useStoreState(selectedSongStateSeqNum);

    const author = useStoreState(selectedSongStateAuthor);
    const category = useStoreState(selectedSongStateCategory);
    const songKey = useStoreState(selectedSongStateKey);
    const songTags = useStoreState(selectedSongStateTags);
    const notes = useStoreState(selectedSongStateNotes);

    function onClickEdit() {
        $RvW.songNavObj.sn_editSong();
    }

    function onClickAddToSchedule() {
        $RvW.learner.finishLearning();
        $RvW.songNavObj.sn_add2schedule();

        Toast.success(undefined, "Added verse to schedule");
    }

    function onClickPresent() {
        $RvW.songNavObj.sn_presentSong();
    }

    function filterByTag(tag: string) {
        $RvW.songManagerObj.searchRecords(`%${tag}%`, SongSearchType.TAGS);
    }

    function filterByCategory(category: string) {
        $RvW.songManagerObj.searchRecords(`%${category}%`, SongSearchType.CATEGORY);
    }

    function filterByAuthor(author: string) {
        $RvW.songManagerObj.searchRecords(`%${author}%`, SongSearchType.AUTHOR);
    }

    function filterByKey(key: string) {
        $RvW.songManagerObj.searchRecords(`%${key}%`, SongSearchType.KEY);
    }

    function presentSlide(index: number) {
        (new SongPresenter(obj)).present(index);
    }

    const actions = [
        { label: 'Edit', icon: 'edit', onClick: onClickEdit },
        { label: 'Present', icon: 'play', onClick: onClickPresent },
        { label: 'Schedule', icon: 'plus square', onClick: onClickAddToSchedule },
    ]

    return (
        <div class="flex flex-col h-full w-full overflow-auto">
            {/* TITLE SEQUENCE */}
            <div class="ui vertical segment">
                {seqNum && <div class="ui top right attached label">{seqNum}</div>}
                <h3 class="ui header">
                    {name1}
                    <div class="sub header">
                        {name2}
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

            {/* TAGS */}
            <div class="ui vertical segment">
                <div class="ui basic labels">
                    {songTags.map((tag, i) => (
                        <a key={i} class="ui label" onClick={() => filterByTag(tag)}>
                            {tag}
                        </a>
                    ))}
                </div>
            </div>

            {/* SLIDES */}
            <div class="flex-1 h-full w-full relative">
                <div class="absolute h-full w-full m-0 p-2 overflow-auto" style={{
                    border: '1px solid #d4d4d5',
                    borderRadius: '0.28571429rem',
                    fontSize: fontSize + 'px',
                }}>
                    {/* TODO: chunked listing */}
                    {slides && <div class="ui cards">
                        {slides[0].map((slide: string, i: number) => (
                            <div class="card cursor-pointer" role="button" tabIndex={0} onClick={() => presentSlide(i)}>
                                <div class="content">
                                    <div class="header">{i + 1}</div>
                                    <div class="meta"></div>
                                    <div class="description">
                                        <div
                                            class="context"
                                            dangerouslySetInnerHTML={{__html: slide}}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '0.28571429rem',
                                                backgroundColor: $RvW.highlightColor,
                                                fontFamily: obj.font,
                                            }}
                                        >
                                        </div>

                                        {slides[1]?.[i] && (
                                            <>
                                                <div class="h-2"></div>

                                                <div
                                                    class="context"
                                                    dangerouslySetInnerHTML={{__html: slides[1]?.[i]}}
                                                    style={{
                                                        padding: '10px',
                                                        borderRadius: '0.28571429rem',
                                                        backgroundColor: $RvW.highlightColor,
                                                        fontFamily: obj.font2,
                                                    }}
                                                >
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>}
                </div>
            </div>

            {/* ADDITIONAL INFO */}
            <div class="flex flex-col pt-2">
                <div class="ui form">
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
                            {songKey && (
                                <a class="ui label" onClick={() => filterByKey(songKey)}>
                                    {songKey}
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
        </div>
    )
}