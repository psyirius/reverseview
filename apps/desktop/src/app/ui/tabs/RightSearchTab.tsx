export default function RightSearchTab() {
    return (
        <div class="flex flex-col h-full overflow-hidden overflow-y-auto">
            <div class="flex-[0]">
                <div class="generalheading2">Bible Search</div>
                <br/>
                <div class="style2">
                    <label>Search</label>

                    <input id="adSearch" type="text" size={30} maxLength={100}/>

                    <select id="searchStyle">
                        <option value="0" selected>Contains</option>
                        <option value="1">Exact Phrase</option>
                    </select>

                    {/*<select id="searchVersion">*/}
                    {/*    <option value="0" selected>Primary</option>*/}
                    {/*    <option value="1">Secondary</option>*/}
                    {/*</select>*/}

                    <select id="searchBook">
                        <option value="1">Book</option>
                    </select>

                    <input type="button" id="adSearchButton" value=" SEARCH "/><br/>
                </div>

                <div class="generalheading2">Search Results</div>
                <div id="searchSummaryID"></div>
            </div>

            <div class="flex-1 overflow-y-auto h-full w-full relative">
                <div id="searchResultID"
                     class="absolute h-full w-full m-0 p-0 overflow-hidden overflow-y-auto"
                     style={{
                         border: '1px solid #d4d4d5',
                         borderRadius: '0.28571429rem',
                     }}
                >
                    {/* Content */}
                </div>
            </div>
        </div>
    )
}