const INNER_HTML = `
<div class="ui left labeled button" tabindex="0">
  <a class="ui basic label">
    Schedule
  </a>
  <div id="sch_deleteID" class="ui button">Remove Selected</div>
  <div id="sch_deleteAllID" class="ui button">Remove All</div>
  <div id="sch_upID" class="ui button">Move Up</div>
  <div id="sch_downID" class="ui button">Move Down</div>
</div>

        <select class="custom-select navListStyleNew" size="5" style="width:300px" id="sch_selectID">
                <option value=1>None</option>
        </select>
        <div id="sch_verseTextID"></div>
<div class="ui divider"></div>
<button class="ui compact button" id="sch_show_in_lyrics">Show in Lyrics Tab</button>
`;

export default function RightScheduleTab() {
    return (
        <div id="scheduleTab" dangerouslySetInnerHTML={{__html: INNER_HTML}}>
        </div>
    )
}