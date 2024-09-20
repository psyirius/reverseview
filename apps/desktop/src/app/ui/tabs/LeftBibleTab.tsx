import {processNavBibleRef, processNavBibleRefFind} from "@/bible/navigation";

export default function LeftBibleTab() {


    return (
        <div id="navTab">
            <div class="style2xxx">
                <div class="ui grid" style={{marginTop: '8px'}}>
                    <div class="ui action small input">
                        <input
                            type="text"
                            size={26}
                            placeholder="Psa 23 1"
                            id="nav_bibleRefID"
                        />

                        <button
                            class="ui icon button"
                            id="bible-ref-find"
                            data-tooltip="Find"
                            onClick={processNavBibleRefFind}
                        >
                            <i class="search icon"></i>
                        </button>

                        <button
                            class="ui icon button"
                            id="bible-quick-present"
                            data-tooltip="Quick Present"
                            onClick={processNavBibleRef}
                        >
                            <i class="rocket icon"></i>
                        </button>
                    </div>
                </div>

                <br/>

                <table
                    width="250"
                    cellSpacing="0"
                    cellPadding="0"
                    style={{border: 0}}
                >
                    <tbody>
                    <tr>
                        <td width="40">&nbsp;</td>
                        <td>
                            <div class="tempList">| BOOK</div>
                        </td>
                        <td>
                            <div class="tempList">| CHAPTER</div>
                        </td>
                        <td>
                            <div class="tempList">| VERSE</div>
                        </td>
                    </tr>
                    <tr>
                        <td width="40">&nbsp;</td>
                        <td height="53">
                            <div class="tempList">
                                <select name="book" size={26} id="bookList" class="custom-select navListStyleNew"
                                        style="width:160px">

                                </select>
                            </div>
                        </td>
                        <td>
                            <div class="tempList">
                                <select name="chapter" size={26} id="chapterList" class="custom-select navListStyleNew"
                                        style="width:65px">

                                </select>
                            </div>
                        </td>
                        <td>
                            <div class="tempList">
                                <select name="verse" size={26} id="verseList" class="custom-select navListStyleNew"
                                        style="width:55px">

                                </select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan={3}>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <br/>

                <p class="style2">
                    Recent: <select id="recentSel" size={2}
                                    class="custom-select navListStyleNew recentListStyle"></select>
                </p>

                <div class="ui grid">
                    <div class="ui action input" style={{width: '100%', marginTop: '16px'}}>
                        <input
                            id="searchID"
                            type="text"
                            size={32}
                            placeholder="Search words..."
                        />
                        <button id="searchButtonID" class="ui icon button">
                            <i class="search icon"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}