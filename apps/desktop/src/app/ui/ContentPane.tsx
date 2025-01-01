import LeftPane from "./panes/LeftPane";
import RightPane from "./panes/RightPane";

export default function ContentPane() {
    return (
        <>
            <div class="content-panes">
                <div id="content-wrapper">
                    {/* TODO: fix tabs heights in left pane */}
                    <LeftPane />
                    <RightPane/>
                </div>
            </div>
        </>
    )
}