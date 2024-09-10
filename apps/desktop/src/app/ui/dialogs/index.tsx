import RemoteSetupDialog from './RemoteSetup'
import BibleNotesEditDialog from "./BibleNotesEdit";
import SongEditDialog from "@app/ui/dialogs/SongEdit";
import LyricEditDialog from "@app/ui/dialogs/LyricEdit";

export default function Dialogs() {
    const id = 'dialogs';

    return (
        <div id={id}>
            <RemoteSetupDialog />
            <SongEditDialog />
            <LyricEditDialog />

            <div id="bible-select-dialog"></div>

            {/* Modal::Confirm */}
            <div id="confirm-panel"></div>

            {/* Dialog box for Song Edit */}
            <div id="song-edit">
                <div class="hd"></div>
                <div class="bd"></div>
            </div>

            {/* Dialog box for Version Management */}
            <div id="versionManageDialog">
                <div class="hd"></div>
                <div class="bd"></div>
            </div>

            <BibleNotesEditDialog />
        </div>
    );
}