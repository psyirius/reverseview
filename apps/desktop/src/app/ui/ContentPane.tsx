import LeftPane from "./panes/LeftPane";
import RightPane from "./panes/RightPane";

export default function ContentPane() {
    return (
        <div id="content">
            <div id="wrapper">
                <LeftPane />
                <RightPane />

                {/*<div id="cleared"></div>*/}
            </div>
        </div>
    )
}