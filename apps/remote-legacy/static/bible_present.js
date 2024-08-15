(function (exports) {
    let command;

    const colorList = ["red", "black", "green", "blue", "magenta"];
    const numColor = colorList.length;

    const b_colorList = ["black", "#0000FF"];
    const b_numColor = b_colorList.length;

    function setupVerseClick(container, verseText, verseBook, verseChapter, verseVerse, verseFont) {
        document.getElementById(container).style.fontFamily = verseFont;
        document.getElementById(container).innerHTML = `<div href="javascript:void(0)">${verseText}</div>`;

        // document.getElementById(container).style.color = "magenta";

        document.getElementById(container).addEventListener("click", function () {
            // OK
            apiCall({
                cmd: 8,
                ref: [verseBook, verseChapter, verseVerse],
            }, ({ok, data, error}) => {
                if (!ok) {
                    showToast("Bible", error);
                } else {
                    console.log("Bible", data);
                }
            });
        }, false);
    }

    // OK
    exports.getSch = function getSch() {
        apiCall({ cmd: 30 }, ({ok, data, error}) => {
            if (!ok) {
                showToast("Schedule", error);
            } else {
                fillSch(data);
            }
        });
    }

    // OK
    exports.getSchContent = function getSchContent() {
        //getConfigValue();
        const selectedSchIndex = document.getElementById("schID").value;

        const [schIndex, songId] = selectedSchIndex.split(':').map(x => parseInt(x));

        // if anything is selected
        if (selectedSchIndex) {
            apiCall({
                cmd: 31,
                index: schIndex,
            }, ({ok, data, error}) => {
                if (!ok) {
                    showToast("Get Schedule Content", error);
                } else {
                    processSongResponse(songId, data, true);
                }
            });
        } else {
            showToast("Schedule", "Select a schedule to fetch!");
        }
    }

    function getConfigValue() {
        apiCall({
            cmd: 40,
            key: 'something',
        });
    }

    /*
     * Function to split sides into 2 lines per slide
     * Aug 31, 2019
     * Binu Joseph
     */
    function splitIN2(s) {
        //Split s in 2 lines SEARCH

        //console.log("Slide: " + s);

        var len = s.length;
        var newSlides = [];
        //console.log("Slide length " + len);

        for (var i = 0; i < len; i++) {
            //console.log("Slide: |" + s[i] + "|");

            var slideIsBlank = isBlank(s[i]); //Function in common.js

            var lines = s[i].split("<BR>");

            //if (lines == null) {
            //	lines = "";
            //}

            var newLine = "";
            var lineLen = lines.length;
            //debug("Line Length: " + lineLen);

            var count = 1;

            if (!slideIsBlank) {
                for (var x = 0; x < lineLen; x++) {
                    //This is the code to break into two lines
                    //	debug("Line " + (x+1) + "...." + lines[x]);
                    if (count == 2) {
                        newLine = newLine + lines[x];
                        newSlides.push(newLine);
                        newLine = "";
                        count = 1;
                    } else {
                        newLine = newLine + lines[x] + "<BR>";
                        count++;
                    }
                }

                if (count == 2) {
                    newSlides.push(newLine); // For odd number of lines
                }
            } else {
                newSlides.push(newLine); //The original is blank. So Push in a blank slide   June 28, 2020
            }
        }

        return newSlides;
    }

    /*
     *  Check if the string is blank
     *   June 28, 2020
     */
    function isBlank(str) {
        //print("slideText length" + str.length);
        var slideTxtWithoutSpace = str.replace(/\s/g, ""); //Remove all spaces
        slideTxtWithoutSpace = slideTxtWithoutSpace.replace(/<BR>/g, ""); //Already the \n has been replaced by <BR> so remove that too
        //print("slideText length without space" + slideTxtWithoutSpace.length);

        if (slideTxtWithoutSpace.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    function fillSch(schList) {
        const el = document.getElementById("schID");

        el.innerHTML = ""; // Clear the list

        const options = [];
        for (let i = 0; i < schList.length; i++) {
            if (schList[i].type === 0) { // songs only
                options.push(`<option value="${schList[i].index}:${schList[i].id}">${schList[i].name}</option>`);
            }
        }

        el.innerHTML = options.join('');

        showToast('Schedule', `Schedule list updated! (${options.length} items)`);
    }

    // OK
    exports.getBibleRef = function getBibleRef() {
        getVerses();

        const ref = document.getElementById("remote_bibleRefID").value;

        const bibleRefObj = new BibleReference();

        if (!bibleRefObj.init(ref)) {
            showToast("Bible", bibleRefObj.getErrorMessage());
        } else {
            apiCall({
                cmd: 8,
                ref: [bibleRefObj.getBook(), bibleRefObj.getChapter(), bibleRefObj.getVerse()],
            }, ({ok, data, error}) => {
                if (!ok) {
                    showToast("Bible", error);
                } else {
                    console.log("Bible", data);
                }
            });
        }
    }

    // OK
    exports.goNext = function getNextBibleRef() {
        apiCall({ cmd: 2 });
    }

    // OK
    exports.goPrevious = function getPrevBibleRef() {
        apiCall({ cmd: 3 });
    }

    // OK
    exports.blankPresentWindow = function blankPresentWindow() {
        apiCall({ cmd: 15 });
    }

    // OK
    exports.logoPresentWindow = function logoPresentWindow() {
        apiCall({ cmd: 14 });
    }

    // OK
    exports.closePresentWindow = function closePresentWindow() {
        apiCall({ cmd: 4 });
    }

    // OK
    exports.getSongList = function getSongList() {
        const query = document.getElementById("remote_songSearchID").value;

        apiCall({
            cmd: 20,
            query,
        }, ({ok, data, error}) => {
            if (!ok) {
                showToast("Song Search", error);
            } else {
                fillSongs(data);
            }
        });
    }

    // OK
    exports.setSongBookmark = function setSongBookmark() {
        const selectedSchIndex = document.getElementById("songID").value;

        if (!selectedSchIndex) {
            showToast("Bookmark", "Select a song to bookmark.");
            return;
        }

        const songId = parseInt(selectedSchIndex);

        apiCall({
            cmd: 22,
            id: songId,
        }, ({ok, data, error}) => {
            if (!ok) {
                showToast("Bookmark", error);
            } else {
                showToast("Bookmark", "Song bookmarked!");
            }
        });
    }

    // OK
    exports.getVerses = function getVerses() {
        const ref = document.getElementById("remote_bibleRefID").value;

        const bibleRefObj = new BibleReference();

        if (!bibleRefObj.init(ref)) { // local check
            showToast("Bible", bibleRefObj.getErrorMessage());
        } else {
            apiCall({
                cmd: 7,
                ref,
            }, (json) => {
                const {ok, data, error} = json;

                if (!ok) {
                    showToast("Bible", error);
                } else {
                    processVerseResponse(data);
                }
            });
        }
    }

    function processVerseResponse(data) {
        const verses = data.verses;
        const book = data.book;
        const chapter = data.chapter;
        const font = data.font;

        const vDivs = [];

        for (let i = 0; i < verses.length; i++) {
            const containerId = `VC_${i}`;
            vDivs.push(`<div class="vcClass" id="${containerId}" style="color:${b_colorList[i % b_numColor]}"></div>`);
        }

        document.getElementById("resultID").innerHTML = vDivs.join('');

        // activateClicks
        for (let i = 0; i < verses.length; i++) {
            const containerId = `VC_${i}`;
            setupVerseClick(containerId, verses[i], book * 1, chapter * 1, i + 1, font);
        }
    }

    function fillSongs(data) {
        const el = document.getElementById("songID");

        el.innerHTML = ""; // Clear the list

        let options = [];
        for (let i = 0; i < data.length; i++) {
            options.push(`<option value="${data[i].id}">${data[i].name}</option>`);
        }

        el.innerHTML = options.join('');
    }

    // OK
    exports.getSongContent = function getSongContent() {
        const selectedSchIndex = document.getElementById("songID").value;

        if (!selectedSchIndex) {
            showToast("Song Content", "Select a song to fetch!");
            return;
        }

        const songId = parseInt(selectedSchIndex);

        apiCall({
            cmd: 21,
            id: songId,
        }, ({ok, data, error}) => {
            if (!ok) {
                showToast("Song Content", error);
            } else {
                processSongResponse(songId, data, false);
            }
        });
    }

    function onSongSlideClick() {
        const slideIdx = $(this).data("index");
        const songId = $(this).data("songId");

        // Need index in schedule list and slide number
        apiCall({
            cmd: 17,
            id: parseInt(songId),
            index: parseInt(slideIdx),
        });
    }

    function processSongResponse(songId, songObj, isSchedule = false) {
        const name = songObj.name;
        const font1 = songObj.font;
        const font2 = songObj.font2;
        const lyrics1 = songObj.slides;
        const lyrics2 = songObj.slides2;

        let slidesArr1 = lyrics1;
        let slidesArr2 = lyrics2;

        const twoLine = $(isSchedule ? '#twoLinePresent' : "#twoLinePresent2").is(":checked");
        if (twoLine) {
            slidesArr1 = splitIN2(slidesArr1);
            slidesArr2 = splitIN2(slidesArr2);
        }

        const songTitle = $(isSchedule ? '#resultSongtitleID' : '#songresultTitleID');
        songTitle.html(`<h2>${name}</h2>`);

        const resultSongID = $(isSchedule ? "#resultSongID" : '#songresultID');
        resultSongID.html("");

        const resultSongID2 = $(isSchedule ? "#resultSongID2" : '#songresultID2');
        resultSongID2.html("");

        for (let i = 0; i < slidesArr1.length; i++) {
            const unit = $(`<div class='vcClass' style='color:${colorList[i % numColor]}'></div>`);
            unit.appendTo(resultSongID);
            unit.css("font-family", font1);
            unit.html(getFirstLine2(slidesArr1[i]));
            unit.data("index", i);
            unit.data("songId", songId);
            unit.click(onSongSlideClick);

            const unit2 = $(`<div class='vcClass' style='color:${colorList[i % numColor]}'></div>`);
            unit2.appendTo(resultSongID2);
            unit2.css("font-family", font2);
            unit2.html(getFirstLine2(slidesArr2[i]));
            unit2.data("index", i);
            unit2.data("songId", songId);
            unit2.click(onSongSlideClick);
        }
    }

    function getFirstLine(x) {
        const singleLine = $("#singleLine").is(":checked");
        //console.log(singleLine);
        if (singleLine) {
            const t = x.split("<BR>");
            return t[0];
        } else {
            return x;
        }
    }

    function getFirstLine2(x) {
        const singleLine = $("#singleLine2").is(":checked");
        //console.log(singleLine);
        if (singleLine) {
            const t = x.split("<BR>");
            return t[0];
        } else {
            return x;
        }
    }

    function apiCall(params, callback = null) {
        const url = ['/action', new URLSearchParams({
            data: btoa(JSON.stringify(params)),
        }).toString()].join("?");

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (typeof callback === "function") {
                    callback(data);
                }
            })
            .catch(error => {
                showToast("Remote VerseVIEW", "API Error.. " + error);
            });
    }

    function showToast(title, message) {
        const t = $(".toast");
        t.hide();

        $("#toastTitle").html(title);
        $("#toastBody").html(message);

        t.show();
        setTimeout( () => t.hide(), 3000);
    }
}(window));