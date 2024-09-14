import {navNotifyMessage} from "@stores/global";
import {$RvW} from "@/rvw";


export default function RightLyricsTab() {
    function onClickEdit() {
        $RvW.songNavObj.sn_editSong();
    }

    function onClickAdd2Schedule() {
        $RvW.learner.finishLearning();
        $RvW.songNavObj.sn_add2schedule();
        navNotifyMessage.set("Added to schedule");
    }

    function onClickPresent() {
        $RvW.songNavObj.sn_presentSong();
    }

    const actions = [
        { label: 'Edit', icon: 'edit', onClick: onClickEdit },
        { label: 'Present', icon: 'play', onClick: onClickPresent },
        { label: 'Schedule', icon: 'plus square', onClick: onClickAdd2Schedule },
    ]

    return (
        <div id="lyricsTab" class="tabSubContainer">
            {/* TITLE SEQUENCE */}
            <div class="ui grid">
                <div class="sixteen wide column">
                    <p class="h5" id="ly_name"></p>
                    <small class="h6 text-muted" id="ly_name2"></small>
                </div>
            </div>

            {/* BUTTONS */}
            <div class="ui grid">
                <div class="sixteen wide column">
                    {actions.map((action, i) => (
                        <button class="ui labeled icon button" onClick={action.onClick} key={i}>
                            <i class={"icon " + action.icon}></i>
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* SLIDES */}
            <div class="ui grid">
                <div class="column border border-primary">
                    <div id="ly_slide" class="ly_slide_class"></div>
                </div>
            </div>

            {/* TAGS */}
            <div class="ui grid">
                <div class="ten wide column" id="ly_tags">
                </div>
            </div>

            {/* ADDITIONAL INFO */}
            <div class="ui grid">
                <div class="three wide column">
                    <div class="form-group row">
                        <label for="ly_cat" class="col-sm col-form-label font-weight-bold">Category</label>
                        <label type="text" class="col-sm col-form-label" id="ly_cat"> </label>
                    </div>
                </div>
                <div class="two wide column">
                    <div class="form-group row">
                        <label for="ly_key" class="col-sm col-form-label font-weight-bold">Key</label>
                        <label type="text" class="col-sm col-form-label" id="ly_key"> </label>
                    </div>
                </div>
                <div class="three wide column">
                    <div class="form-group row">
                        <label for="ly_copy" class="col-sm col-form-label font-weight-bold">Lyrics By</label>
                        {/* <label type="text" class="col-sm col-form-label" id="ly_copy"> </label> */}
                        <button type="button" class="btn btn-outline-secondary btn-sm" id="ly_copy"></button>
                    </div>
                </div>
                <div class="eight wide column">
                    <div class="form-group row">
                        <label for="ly_notes" class="col-sm col-form-label font-weight-bold">Notes</label>
                        <div type="text" class="col-sm col-form-label" id="ly_notes"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}