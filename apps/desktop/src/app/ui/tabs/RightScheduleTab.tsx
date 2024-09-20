export default function RightScheduleTab() {
    return (
        <div id="scheduleTab">
            <div class="ui items segment">
                <div class="item">
                    <div class="image">
                        <div class="ui vertical labeled icon buttons">
                            <button
                                id="sch_deleteID"
                                class="ui button"
                            >
                                <i class="minus square icon"></i>
                                Remove
                            </button>
                            <button
                                id="sch_deleteAllID"
                                class="ui button"
                            >
                                <i class="trash icon"></i>
                                Clear All
                            </button>
                            <button
                                id="sch_upID"
                                class="ui button"
                            >
                                <i class="caret up icon"></i>
                                Move Up
                            </button>
                            <button
                                id="sch_downID"
                                class="ui button"
                            >
                                <i class="caret down icon"></i>
                                Move Down
                            </button>
                        </div>
                    </div>
                    <div class="middle aligned content">
                        <select class="custom-select navListStyleNew" size={8} style="width: 100%" id="sch_selectID">
                        </select>
                    </div>
                </div>
            </div>

            <div id="sch_verseTextID"></div>
            <div class="ui divider"></div>
            <button class="ui compact button" id="sch_show_in_lyrics">Show in Lyrics Tab</button>
        </div>
    )
}