import RemoteSetupDialog from './RemoteSetup'
import BibleNotesEditDialog from "./BibleNotesEdit";
import SongEditDialog from "./SongEdit";
import BibleManageDialog from "./BibleManage";
import BibleSelectorDialog from "./BibleSelector";
import BibleVerseEditDialog from "./BibleVerseEdit";
import PromptDialog from "./Prompt";

export default function Dialogs() {
    return (
        <div id="dialogs">
            <RemoteSetupDialog />
            <SongEditDialog />
            <BibleSelectorDialog />
            <BibleManageDialog />
            <BibleNotesEditDialog />
            <BibleVerseEditDialog />
            <PromptDialog />
        </div>
    );
}