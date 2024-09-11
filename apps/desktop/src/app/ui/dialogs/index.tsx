import RemoteSetupDialog from './RemoteSetup'
import BibleNotesEditDialog from "./BibleNotesEdit";
import SongEditDialog from "./SongEdit";
import LyricEditDialog from "./LyricEdit";
import BibleManageDialog from "./BibleManage";
import BibleSelectorDialog from "./BibleSelector";
import BibleVerseEditDialog from "./BibleVerseEdit";
import PromptDialog from "./Prompt";

export default function Dialogs() {
    return (
        <div id="dialogs">
            <RemoteSetupDialog />
            <SongEditDialog />
            <LyricEditDialog />
            <BibleSelectorDialog />
            <BibleManageDialog />
            <BibleNotesEditDialog />
            <BibleVerseEditDialog />
            <PromptDialog />
        </div>
    );
}