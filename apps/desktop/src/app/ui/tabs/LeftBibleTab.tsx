import {processNavBibleRef, processNavBibleRefFind} from "@/bible/navigation";

export default function LeftBibleTab() {
    const numItems = 26;

    const columnSizes = [125, 60, 60];

    return (
        /* Bible Nav */
        <div class="ui left fluid vertical segment">
            {/* Bible Search */}
            <div class="ui action input">
                <input
                    type="text"
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

            {/*<div class="ui divider"></div>*/}

            {/* Book, Chapter, Verse: Selector */}
            <table
                class="ui very compact striped celled table"
                width="100%"
                cellSpacing="0"
                cellPadding="0"
            >
                {/*<thead>*/}
                {/*<tr>*/}
                {/*    <th>Book</th>*/}
                {/*    <th>Chapter</th>*/}
                {/*    <th>Verse</th>*/}
                {/*</tr>*/}
                {/*</thead>*/}
                <tbody>
                <tr>
                    <td height={64}>
                        <div class="tempList">
                            <select
                                id="bookList"
                                name="book"
                                size={numItems}
                                class="navListStyleNew"
                                style={{width: columnSizes[0]}}
                            >
                            </select>
                        </div>
                    </td>
                    <td>
                        <div class="tempList">
                            <select
                                id="chapterList"
                                name="chapter"
                                size={numItems}
                                class="navListStyleNew"
                                style={{width: columnSizes[1]}}
                            >
                            </select>
                        </div>
                    </td>
                    <td>
                        <div class="tempList">
                            <select
                                id="verseList"
                                name="verse"
                                size={numItems}
                                class="navListStyleNew"
                                style={{width: columnSizes[2]}}
                            >
                            </select>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>

            {/*<div class="ui divider"></div>*/}

            <div class="ui form">
                {/* Recent Verses */}
                <div class="field">
                    <label>Recent Verses</label>
                    <select
                        id="recentSel"
                        size={2}
                        class="navListStyleNew recentListStyle"
                    ></select>
                </div>
                {/* Word Search */}
                <div class="field">
                    <div class="ui action input">
                        <input
                            id="searchID"
                            type="text"
                            placeholder="Search words..."
                        />
                        <button
                            id="searchButtonID"
                            class="ui icon button"
                            data-tooltip="Search words"
                        >
                            <i class="search icon"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}