// Bible Verse Navigation

export default function LeftBibleTab() {


    return (
        <div id="navTab">
            <div class="style2">
                <div class="ui grid">
                    <div class="ten wide column">
                        <div class="ui input">
                            <input
                                class="prompt"
                                type="text"
                                size={25}
                                placeholder="Reference : Psa 23 1"
                                id="nav_bibleRefID"
                            />
                        </div>
                    </div>

                    <div class="two wide column">
                        <span class="iconImageStyle">
                            <img id="nav_bibleRef_findID" alt=""/>
                        </span>
                    </div>

                    <div class="two wide column">
                        <span class="iconImageStyle">
                            <img id="nav_bibleRef_presentID" alt=""/>
                        </span>
                    </div>
                </div>

                <br/>

                <table
                    width="250"
                    cellSpacing="0"
                    cellPadding="0"
                    style={{ border: 0 }}
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
                                <select name="book" size={26} id="bookList" class="custom-select navListStyleNew" style="width:160px">

                                </select>
                            </div>
                        </td>
                        <td>
                            <div class="tempList">
                                <select name="chapter" size={26} id="chapterList" class="custom-select navListStyleNew" style="width:65px">

                                </select>
                            </div>
                        </td>
                        <td>
                            <div class="tempList">
                                <select name="verse" size={26} id="verseList" class="custom-select navListStyleNew" style="width:55px">

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
                    Recent: <select id="recentSel" size={2} class="custom-select navListStyleNew recentListStyle"></select>
                </p>

                <div class="ui grid">
                    <div class="ten wide column">
                        <div class="ui icon input">
                            <input class="prompt" type="text" size={14} id="searchID" placeholder="Word Search"/>
                        </div>
                    </div>
                    <div class="four wide column">
                        <span class="iconImageStyle">
                            <img id="searchButtonID" alt=""/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}