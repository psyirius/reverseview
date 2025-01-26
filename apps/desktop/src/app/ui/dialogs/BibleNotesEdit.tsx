import {useEffect, useRef, useState} from "preact/hooks";
import {useStoreState} from "@/utils/hooks";
import {showBibleNotesEditPanel} from "@stores/global";
import {$RvW} from "@/rvw";
import Modal from "@app/ui/Modal";
import {showPrompt} from "@app/ui/Prompt";
import {console} from "@/platform/adapters/air";

export interface Props {

}

// TODO: migrate YUI to Preact
export default function BibleNotesEditDialog({}: Props) {
    const open = useStoreState(showBibleNotesEditPanel);

    const [notesInfo, setNotesInfo] = useState(null);

    const [verseContents, setVerseContents] = useState(null);
    const [verseRefText, setVerseRefText] = useState(null);

    const [notesContent, setNotesContent] = useState(null);

    // panel visibility
    useEffect(() => {
        if (open) {
            const vi = $RvW.notesObj.getNotesForActiveVerse();

            setNotesInfo(vi);
            setVerseRefText(vi.refText);
            setVerseContents(vi.contents);
            setNotesContent(vi.notes);
        } else {
            setNotesInfo(null);
            setVerseContents(null);
            setVerseRefText(null);
            setNotesContent(null);
        }
    }, [open]);

    function handleCloseModal() {
        $RvW.notesObj.hide(); // this internally updates the store
    }

    function handleSave(e: Event) {
        e.preventDefault();

        $RvW.notesObj.setNotesForActiveVerse(notesContent);

        handleCloseModal();
    }

    function handleCancel(e: Event) {
        e.preventDefault();

        if (notesInfo && notesInfo.notes !== notesContent) {
            showPrompt({
                title: 'Unsaved Changes',
                message: 'Are you sure you want to cancel? Any changes you made will be lost!',
                onOk() {
                    handleCloseModal();
                },
                onCancel() {}
            });
        } else {
            handleCloseModal();
        }
    }

    return (
        <Modal
            title="Edit Verse Note"
            isOpen={open}
            onClose={handleCloseModal}
            width="40%"
            zIndex={100}
        >
            <div class="ui form">
                <div class="field">
                    <div class="ui message">
                        <div class="header">{verseRefText}</div>

                        {verseContents && (<>
                            <ul class="list">
                                {verseContents.map((vc, i) => {
                                    return (
                                        <li key={i}>
                                            <span style={{fontFamily: vc.font}}>
                                                {vc.content}
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </>)}
                    </div>
                </div>

                <div class="field">
                    <label>Notes</label>

                    <textarea
                        rows={8}
                        value={notesContent}
                        onChange={(e) => {
                            setNotesContent(e.currentTarget.value);
                        }}
                    ></textarea>
                </div>

                <div class="ui basic buttons">
                    <button class="ui primary icon button" tabIndex={0} onClick={handleSave}>
                        Save
                    </button>
                    <button class="ui secondary icon button" tabIndex={0} onClick={handleCancel}>
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}