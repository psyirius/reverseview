import {processNavBibleRef, processNavBibleRefFind} from "@/bible/navigation";
import ScrollableSelect from "@app/ui/widgets/ScrollableSelect";
import {$RvW} from "@/rvw";
import {verseChange} from "@app/main";
import {useStoreState} from "@/utils/hooks";
import {bibleFont, bookList, chapterList, recentBibleRefs, selectedBible, verseList} from "@/stores/global";
import {console} from "@/platform/adapters/air";
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

    const _bibleFont = useStoreState(bibleFont);

    const _recentRefs = useStoreState(recentBibleRefs);

    console.trace('[ZZZ]:', [activeBook, activeChapter, activeVerse]);
    console.trace('[YYY]:', _recentRefs);

    const bookListItems = _bookList.map((book) => {
        if (typeof book === 'string') {
            return {label: book, value: book};
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

            console.trace("onChapterChange:", bible, l);

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

            console.trace("onVerseChange:", bible, l);

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

            console.trace("onRecentVerseChange:", bible, l);

            return l as typeof bible;
        });
        $RvW.recentBibleRefs.selectRecent(item);

        setActiveRecentVerse(i);
    }

    return (
        /* Bible Nav */
        <div class="ui left fluid vertical segment">
            {/* Bible Search */}
            <div class="ui segment basic clearing" style={{padding: 0}}>
                <div class="ui fluid action input">
                    <input
                        type="text"
                        placeholder="Psa 23 1"
                        id="nav_bibleRefID"
                    />

                    <button
                        class="ui icon button"
                        id="bible-ref-find"
                        data-tooltip="Find"
                        onClick={processNavBibleRefFind}
                    >
                        <i class="search icon"></i>
                    </button>

                    <button
                        class="ui icon button"
                        id="bible-quick-present"
                        data-tooltip="Quick Present"
                        onClick={processNavBibleRef}
                    >
                        <i class="rocket icon"></i>
                    </button>
                </div>
            </div>

            <div class="ui segment basic clearing" style={{padding: 0}}>
                <div id="verse-select" class="ui three column padded grid font-medium" style={{
                    height: '340px',
                    minWidth: '100%',
                    fontFamily: _bibleFont
                }}>
                    <div class="ten wide column" style={{padding: 0}}>
                        <ScrollableSelect items={bookListItems} onSelectItem={onBookChange}
                                          selectedItem={activeBook}/>
                    </div>
                    <div class="three wide column" style={{padding: 0}}>
                        <ScrollableSelect items={chapterListItems} onSelectItem={onChapterChange}
                                          selectedItem={activeChapter}/>
                    </div>
                    <div class="three wide column" style={{padding: 0}}>
                        <ScrollableSelect items={verseListItems} onSelectItem={onVerseChange}
                                          selectedItem={activeVerse}/>
                    </div>
                </div>
            </div>

            <div class="ui segment basic clearing" style={{padding: 0}}>
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
    );
}