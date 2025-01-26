import {useEffect, useRef, useState} from "preact/hooks";
import {selectedBibleVersionForVerseEdit, showVerseEditPanel} from "@stores/global";
import {useStoreState} from "@/utils/hooks";
import Modal from "@app/ui/Modal";
import {$RvW} from "@/rvw";
import {getPrimaryBibleVersion, getSecondaryBibleVersion} from "@/bible/version";

export default function BibleVerseEditDialog() {
    const open = useStoreState(showVerseEditPanel);
    const version2Edit = useStoreState(selectedBibleVersionForVerseEdit);

    const [verseRef, setVerseRef] = useState('');
    const [verseText, setVerseText] = useState('');
    const [verseFont, setVerseFont] = useState('');

    const updatedVerseTextRef = useRef<HTMLTextAreaElement>(null);

    function handleCloseModal() {
        showVerseEditPanel.set(false);
    }

    const onClickCancel = () => {
        handleCloseModal();
    }

    const onClickUpdate = () => {
        const b = $RvW.getBookValue();
        const c = $RvW.getChapterValue();
        const v = $RvW.getVerseValue();

        const verseText = String(updatedVerseTextRef.current.value).trim();

        switch (version2Edit) {
            case 0: {
                $RvW.bibledbObj[0].updateVerse(b + 1, c + 1, v + 1, verseText);
                break;
            }
            case 1: {
                $RvW.bibledbObj[1].updateVerse(b + 1, c + 1, v + 1, verseText);
                break;
            }
            default: {
                throw new Error(`Invalid version: ${version2Edit}`);
            }
        }

        handleCloseModal();
    }

    // panel visibility
    useEffect(() => {
        if (open) {
            const b = $RvW.getBookValue();
            const c = $RvW.getChapterValue();
            const v = $RvW.getVerseValue();

            setVerseRef(`${$RvW.booknames[b]} ${parseInt(c) + 1}:${parseInt(v) + 1}`);

            let font: string;
            let verseText: string;
            switch (version2Edit) {
                case 0: {
                    font = getPrimaryBibleVersion().selectedFont;
                    verseText = $RvW.getSingleVerse(b, c, v, 1);
                    break;
                }
                case 1: {
                    font = getSecondaryBibleVersion().selectedFont;
                    verseText = $RvW.getSingleVerse(b, c, v, 2);
                    break;
                }
                default: {
                    throw new Error(`Invalid version: ${version2Edit}`);
                }
            }

            setVerseFont(font);

            // TODO: get verse text directly without the number prefix
            const vt = verseText.substr(verseText.indexOf(" ") + 1);

            setVerseText(vt);

            $RvW.disableHotkeys = true;
        } else {
            $RvW.disableHotkeys = false;
        }
    }, [open]);

    return (
        <Modal
            title="Edit Bible Verse"
            width="600px"
            isOpen={open}
            onClose={handleCloseModal}
        >
            <div class="ui form container segment">
                <div class="field">
                    <label>Reference</label>
                    <div>{verseRef}</div>
                </div>
                <div class="field">
                    <label>Current</label>
                    <textarea
                        style={{
                            fontFamily: verseFont,
                        }}
                        rows={3}
                        readOnly={true}
                    >
                        {verseText}
                    </textarea>
                </div>
                <div class="field">
                    <label>Updated</label>
                    <textarea
                        style={{
                            fontFamily: verseFont,
                        }}
                        rows={3}
                        ref={updatedVerseTextRef}
                    >
                        {verseText}
                    </textarea>
                </div>

                <div class="ui buttons">
                    <button
                        class="ui primary button"
                        onClick={onClickUpdate}
                    >
                        Update
                    </button>
                    <button
                        class="ui secondary button"
                        onClick={onClickCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}