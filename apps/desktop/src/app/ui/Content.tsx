import LeftTab from "@app/ui/LeftTab";
import RightTab from "@app/ui/RightTab";

export default function Content() {
    return (
        <div id="content">
            <div id="wrapper">
                <LeftTab />
                <RightTab />

                {/*<div id="cleared"></div>*/}
            </div>
        </div>
    )
}