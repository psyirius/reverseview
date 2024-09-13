// Song Lyric Navigation

export default function LeftSongsTab() {
    return (
        <div id="songNavTab">
            {/* CATEGORY TAGS */}
            <div class="ui grid">
                <div class="eight wide column">
                    <label for="songnav_category" class="col-form-label form-control-sm">Category</label>
                    <select class="form-control-sm col-sm-10" id="songnav_category"></select>
                </div>
                <div class="eight wide column">
                    <label for="songnav_tags" class="col-form-label form-control-sm">Tags</label>
                    <select class="form-control-sm col-sm-10" id="songnav_tags">
                        <option>WORSHIP</option>
                    </select>
                </div>
            </div>

            {/* TITLE SEQUENCE */}
            <div class="ui grid vvrow40">
                <div class="ten wide column">
                    <div class="ui search songsearch">
                        <div class="ui icon input">
                            <input
                                class="prompt"
                                type="text"
                                size={14}
                                id="songnav_editbox"
                                placeholder="Search"
                            />
                        </div>
                    </div>
                </div>

                <div class="six wide row">
                    <div class="ui icon buttons">
                        <button
                            class="ui button"
                            id="songnav_searchbutton"
                            data-tooltip="Search by Lyrics"
                        >
                            <i class="file alternate icon"></i>
                        </button>

                        <button
                            class="ui button"
                            id="songnav_searchauthorbutton"
                            data-tooltip="Search by Author"
                        >
                            <i class="user icon"></i>
                        </button>

                        <button
                            class="ui button"
                            id="songnav_clearbutton"
                            data-tooltip="Clear Filters"
                        >
                            <i class="times circle icon"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* ERROR Notification and word suggestions */}
            <div class="ui grid vvrow40">
                <div class="ten wide column">
                    <div class="col-form-label form-control-sm" id="search_error_notification"></div>
                </div>
            </div>

            <div class="style2">
                {/* <b>Song Title</b><br> */}
                <input type="text" id="songnav_filterbox" size={30}/><br/>
                <div id="songnav_songlistnew" class="yui-skin-sam"></div>
            </div>

            {/*<input type="text" class="form-control form-control-sm" id="songnav_editbox_hold" placeholder="Search" />*/}
        </div>
    );
}