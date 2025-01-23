import {processNavBibleRef, processNavBibleRefFind} from "@/bible/navigation";
import ScrollableSelect from "@app/ui/widgets/ScrollableSelect";
import {useStoreState} from "@/utils/hooks";
import {verseChange} from "@app/main";
import {console} from "@/platform/adapters/air";
import {$RvW} from "@/rvw";
import {
    bibleFont1, bibleFont2,
    bibleNavSearch,
    bookList,
    chapterList,
    recentBibleRefs,
    selectedBible,
    verseList,
} from "@/stores/global";
import {useState} from "preact/hooks";

export default function LeftBibleTab() {
    const [activeRecentVerse, setActiveRecentVerse] = useState(-1);

    const [
        activeBook,
        activeChapter,
        activeVerse,
    ] = useStoreState(selectedBible);

    const _bookList = useStoreState(bookList);
    const _chapterList = useStoreState(chapterList);
    const _verseList = useStoreState(verseList);

    const _bibleFont1 = useStoreState(bibleFont1);
    const _bibleFont2 = useStoreState(bibleFont2);

    const _recentRefs = useStoreState(recentBibleRefs);

    // console.trace('[ZZZ]:', [activeBook, activeChapter, activeVerse]);
    // console.trace('[YYY]:', _recentRefs);

    const bookListItems = _bookList.map((book) => {
        if (typeof book === 'string') {
            return {
                label: book,
                value: book,
            };
        }

        const [value, meta] = book;

        return {label: value, value, meta};
    });
    const chapterListItems = _chapterList.map((chapter) => ({label: chapter, value: chapter}));
    const verseListItems = _verseList.map((verse) => ({label: verse, value: verse}));
    const recentRefs = _recentRefs.map((ref) => {
        const {label, book, chapter, verse} = ref;

        return {label, value: `${book}:${chapter}:${verse}`};
    });

    function onBookChange(i: number, e: any) {
        selectedBible.update((bible) => {
            const l = [
                ...bible
            ];

            l[0] = i;

            return l as typeof bible;
        });
        $RvW.putch();
    }

    function onChapterChange(i: number, e: any) {
        selectedBible.update((bible) => {
            const l = [
                ...bible
            ];

            l[1] = i;

            // console.trace("onChapterChange:", bible, l);

            return l as typeof bible;
        });
        $RvW.putver();
    }

    function onVerseChange(i: number, e: any) {
        selectedBible.update((bible) => {
            const l = [
                ...bible
            ];

            l[2] = i;

            // console.trace("onVerseChange:", bible, l);

            return l as typeof bible;
        });
        verseChange();

        setActiveRecentVerse(-1);
    }

    function onRecentVerseChange(i: number, e: any) {
        const item = _recentRefs[i];

        selectedBible.update((bible) => {
            const l = [
                ...bible
            ];

            l[0] = item.book;
            l[1] = item.chapter;
            l[2] = item.verse;

            // console.trace("onRecentVerseChange:", bible, l);

            return l as typeof bible;
        });
        $RvW.recentBibleRefs.selectRecent(item);

        setActiveRecentVerse(i);
    }

    const navSearch = useStoreState(bibleNavSearch);

    function _renderBibleNavListItem(item: any) {
        return (
            <div class="content">
                <div class="header" style={{ fontFamily: _bibleFont1 }}>{item.label}</div>
                {item.meta && (
                    <div class="meta" style={{ fontFamily: _bibleFont2 }}>{item.meta}</div>
                )}
            </div>
        )
    }

    return (
        /* Bible Nav */
        <>
            <div class="left-bible-tab">
                <div class="flex flex-col h-full w-full">
                    {/* Bible Search */}
                    <div class="flex-[0]">
                        <div class="ui fluid action input">
                            <input
                                type="text"
                                placeholder="Psa 23 1"
                                value={navSearch}
                                onInput={(e) => {
                                    bibleNavSearch.set(e.currentTarget.value);
                                }}
                                onBlur={(e) => {
                                    $RvW.enterForBibleRef = false;
                                }}
                                onFocus={(e) => {
                                    $RvW.enterForBibleRef = true;
                                }}
                            />

                            <button
                                class="ui icon button"
                                data-tooltip="Find"
                                onClick={processNavBibleRefFind}
                            >
                                <i class="search icon"></i>
                            </button>

                            <button
                                class="ui icon button"
                                data-tooltip="Quick Present"
                                onClick={processNavBibleRef}
                            >
                                <i class="rocket icon"></i>
                            </button>
                        </div>
                    </div>

                    <div class="flex-[0] h-4"></div>

                    {/* Bible Select */}
                    <div class="flex-[1] relative h-full w-full">
                        <div class="absolute h-full w-full">
                            <div class="ui three column padded grid font-medium h-full min-w-full">
                                <div class="ten wide column" style={{padding: 0}}>
                                    <ScrollableSelect
                                        items={bookListItems}
                                        onSelectItem={onBookChange}
                                        selectedItem={activeBook}
                                        renderItem={_renderBibleNavListItem}
                                    />
                                </div>
                                <div class="three wide column" style={{padding: 0}}>
                                    <ScrollableSelect
                                        items={chapterListItems}
                                        onSelectItem={onChapterChange}
                                        selectedItem={activeChapter}
                                        renderItem={_renderBibleNavListItem}
                                    />
                                </div>
                                <div class="three wide column" style={{padding: 0}}>
                                    <ScrollableSelect
                                        items={verseListItems}
                                        onSelectItem={onVerseChange}
                                        selectedItem={activeVerse}
                                        renderItem={_renderBibleNavListItem}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex-[0] h-4"></div>

                    {/* Recent & Word Search */}
                    <div class="flex-[0]">
                        <div class="ui form">
                            {/* Recent Verses */}
                            <div class="field">
                                <label>Recent Verses</label>
                                <div class="ui container" style={{height: '100px'}}>
                                    <ScrollableSelect
                                        items={recentRefs}
                                        onSelectItem={onRecentVerseChange}
                                        selectedItem={activeRecentVerse}
                                    />
                                </div>
                            </div>

                            {/* Word Search */}
                            <div class="field">
                                <div class="ui fluid action input">
                                    <input
                                        id="searchID"
                                        type="text"
                                        placeholder="Search words..."
                                    />
                                    <button
                                        id="searchButtonID"
                                        class="ui icon button"
                                        data-tooltip="Search words"
                                    >
                                        <i class="search icon"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}