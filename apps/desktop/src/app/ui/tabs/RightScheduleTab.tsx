import {useState} from "preact/hooks";
import {$RvW} from "@/rvw";
import {useStoreState} from "@/utils/hooks";
import {ScheduleItemType, scheduleList} from "@stores/global";

export default function RightScheduleTab() {
    const [selectedItem, setSelectedItem] = useState(-1);

    const scheduleItems = useStoreState(scheduleList);

    function onSelectItem(index: number) {
        setSelectedItem(index);

        $RvW.scheduleObj.onSelChange(index);
    }

    function locateItem(index: number) {
        $RvW.scheduleObj.locateScheduleItem(index);
    }

    function deleteItem(index: number) {
        $RvW.scheduleObj.processDelete(index);
    }

    function deleteAllItems() {
        $RvW.scheduleObj.processDeleteAll();
    }

    function moveItemUp() {
        $RvW.scheduleObj.processUp(selectedItem);
    }

    function moveItemDown() {
        $RvW.scheduleObj.processDown(selectedItem);
    }

    return (
        <div id="scheduleTab">
            <div class="ui segment relaxed items">
                <div class="item">
                    <div class="content">
                        <div class="ui middle aligned selection list scrollable" style={{height: '160px'}}>
                            {scheduleItems.map(({type, title, description}, i) => (
                                <div
                                    key={i}
                                    class={`item ${i === selectedItem ? 'active' : ''}`}
                                    onClick={() => onSelectItem(i)}
                                >
                                    <div class="right floated content">
                                        <div class="ui buttons">
                                            <button class="ui icon button" onClick={() => locateItem(i)}>
                                                <i aria-hidden="true" class="bullseye icon"></i>
                                            </button>
                                            <button class="ui icon negative button" onClick={() => deleteItem(i)}>
                                                <i aria-hidden="true" class="trash icon"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <i class={`large middle aligned icon ${type === ScheduleItemType.VERSE ? 'book' : 'music'}`}></i>
                                    <div class="content">
                                        <div class="header">{title}</div>
                                        {description && <div class="meta">{description}</div>}
                                    </div>
                                </div>
                            ))}
                            {(scheduleItems.length === 0) && (
                                <div class="ui container center aligned" style={{height: '100%'}}>
                                    <div class="ui grid middle aligned" style={{height: '100%'}}>
                                        <div class="row">
                                            <div class="column">
                                                <div class="ui compact message">
                                                    <p>The schedule is empty!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div class="ui image">
                        <div class="ui vertical labeled icon buttons">
                            <button class="ui right labeled icon button negative" onClick={deleteAllItems}>
                                <i class="trash icon"></i>
                                Clear All
                            </button>
                            <button class="ui right labeled icon button" onClick={moveItemUp}
                                    disabled={selectedItem < 0}>
                                <i class="caret up icon"></i>
                                Move Up
                            </button>
                            <button class="ui right labeled icon button" onClick={moveItemDown}
                                    disabled={selectedItem < 0}>
                                <i class="caret down icon"></i>
                                Move Down
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div id="sch_verseTextID"></div>
        </div>
    )
}