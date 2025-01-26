import {BibleVerse, presentingBible, ScheduleItemType, selectedBible, selectedVerseList} from "@stores/global";
import ScrollableSelect from "@app/ui/widgets/ScrollableSelect";
import {presentationCtx} from "@app/presentation";
import {console} from "@/platform/adapters/air";
import {useStoreState} from "@/utils/hooks";
import {getdata} from "@/bible/manager";
import {verseChange} from "@app/main";
import {$RvW} from "@/rvw";

export default function RightVersesTab() {
    const [
        activeBook,
        activeChapter,
        activeVerse,
    ] = useStoreState(selectedBible) || [-1, -1, -1];
    const [
       presentingBook,
       presentingChapter,
       presentingVerse,
    ] = useStoreState(presentingBible) || [-1, -1, -1];

    const _verseList = useStoreState(selectedVerseList);

    const verseListItems = _verseList.map(((v) => v.map((verse: BibleVerse) => {
        const [b, c, v] = verse.ref;

        return {
            label: verse.text,
            value: [b, c, v].join(':'),
            seq: v,
            ref: verse.ref,
            font: verse.font,
        }
    })));

    const verseFontSize = $RvW.vvConfigObj.get_navFontSize() + "px";

    function onClickListItem(e: MouseEvent, [i, ref]: [number, [number, number, number]], present = false) {
        selectedBible.update((bible) => {
            const l = [
                ...bible
            ];

            l[2] = i;

            console.trace("onVerseChange:", bible, l);

            return l as typeof bible;
        });
        verseChange();

        if (e.ctrlKey || present) {
            presentVerse(i, ref);
        }
    }

    function editVerseNote(i: number, ref: number[]) {
        const [b, c, v] = ref;

        $RvW.notesObj.setVariables(b, c, v);
        $RvW.notesObj.show();
    }

    function presentVerse(i: number, ref: number[]) {
        const [bookNum, chapterNum, verseNum] = ref;

        const b = $RvW.bookIndex;
        const c = $RvW.chapterIndex;
        const v = $RvW.verseIndex;

        $RvW.bookIndex = bookNum - 1;
        $RvW.chapterIndex = chapterNum - 1;
        $RvW.verseIndex = verseNum - 1;

        $RvW.recentBibleRefs.addSelection($RvW.bookIndex, $RvW.chapterIndex, $RvW.verseIndex);

        getdata(true);

        presentationCtx.p_footer = $RvW.getFooter();
        presentationCtx.p_title = $RvW.booknames[$RvW.bookIndex] + " " + ($RvW.chapterIndex + 1);

        selectedBible.update((bible) => {
            const l = [
                ...bible
            ];
            l[2] = $RvW.verseIndex;
            return l as typeof bible;
        });

        $RvW.launch($RvW.verseIndex);

        // TODO: highlight the verse in the list

        $RvW.bookIndex = b;
        $RvW.chapterIndex = c;
        $RvW.verseIndex = v;

        getdata(true);
    }

    // NOTE: ctrl + click to present verse
    // NOTE: double click to present verse
    // NOTE: single click to select verse

    function isActiveVerse(ref: number[]) {
        const [bs, cs, vs] = ref.map(e => (e - 1));
        const [ba, ca, va] = [activeBook, activeChapter, activeVerse];

        return (bs === ba) && (cs === ca) && (vs === va);
    }

    function isPresentingVerse(ref: number[]) {
        const [bs, cs, vs] = ref.map(e => (e - 1));
        const [ba, ca, va] = [presentingBook, presentingChapter, presentingVerse];

        return (bs === ba) && (cs === ca) && (vs === va);
    }

    return (
        <>
            <div class="p-0 h-full">
                {/* Scrollable List */}
                <div class="ui middle aligned selection list scrollable bg-white" style={{height: '100%'}}>
                    {verseListItems.map((verseList, i) => (
                        <div
                            key={i}
                            class={`item ${i === activeVerse ? 'active' : ''}`}
                            style={{
                                borderStyle: 'solid',
                                borderWidth: '2px',
                                borderColor: isPresentingVerse(verseList[0].ref) ? '#fc5c65' : (
                                    isActiveVerse(verseList[0].ref) ? '#45aaf2' : 'transparent'
                                ),
                            }}
                            onClick={(e) => onClickListItem(e, [i, verseList[0].ref])}
                            onDblClick={(e) => onClickListItem(e, [i, verseList[0].ref], true)}
                        >
                            <div class="middle aligned right floated content" style={{
                                margin: 0,
                            }}>
                                <div class="ui buttons">
                                    <button
                                        class="ui icon button"
                                        onClick={() => editVerseNote(i, verseList[0].ref)}
                                    >
                                        <i aria-hidden="true" class="file alternate icon"></i>
                                    </button>
                                    <button
                                        class="ui icon button"
                                        onClick={() => presentVerse(i, verseList[0].ref)}
                                    >
                                        <i aria-hidden="true" class="play circle icon"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="ui image" style={{
                                minWidth: '3.5rem',
                                borderRight: '1px solid rgba(34, 36, 38, 0.148438)',
                            }}>
                                <div class="ui container center aligned fluid">
                                    <a class="ui circular label">{verseList[0].seq}</a>
                                </div>
                            </div>

                            <div class="content" style={{width: '100%'}}>
                                <div class="header" style={{width: '100%'}}>
                                    <div class="ui equal width grid" style={{width: '100%'}}>
                                        <div class="row">
                                            {verseList.map((item, i) => (
                                                <div key={i} class="column" style={{
                                                    borderRight: '1px solid rgba(34, 36, 38, 0.148438)',
                                                    fontFamily: item.font,
                                                    fontSize: verseFontSize,
                                                }}>
                                                    {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/*{item.meta && <div class="meta">{item.meta}</div>}*/}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}