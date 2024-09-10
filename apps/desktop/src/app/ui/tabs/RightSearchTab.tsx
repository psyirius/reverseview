const INNER_HTML = `
<div id="searchField" class="searchFieldContainer">
    <div id="searchTabDiv">
        <div class="generalheading2">Advanced Search</div><br>
        <div class="style2">
            <label>Search</label>

            <input id="adSearch" type="text" size="30" maxlength="100">

            <select id="searchStyle">
                <option value="0" selected>Contains</option>
                <option value="1">Exact Phrase</option>
            </select>

            <!--
                    <select id="searchVersion">
                          <option value="0" selected>Primary</option>
                          <option value="1">Secondary</option>
                    </select>
            -->
            <select id="searchBook">
                <option value="1">Book</option>
            </select>

            <input type="button" id="adSearchButton" value=" SEARCH "><br>
        </div>
        <hr>
        <div class="generalheading2">Search Results</div>
        <div id="searchSummaryID"  class="searchResultContainerx"></div>
        <div id="searchResultID"  class="searchResultContainer">Search Result</div>
    </div>
</div>
`;

export default function RightSearchTab() {
    return (
        <div id="searchTab" dangerouslySetInnerHTML={{__html: INNER_HTML}}>
        </div>
    )
}