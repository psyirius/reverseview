(function (exports) {
    var command;
    var items;
    var len;
    var verses;
    var font;
    var b;
    var c;

    var colorlist = ["red", "black", "green", "blue", "magenta"];
    var numColor = colorlist.length;

    var b_colorlist = ["black", "#0000FF"];
    var b_numColor = b_colorlist.length;

    var verseObjArray = [];

    // FIXME: it's just a function, not a class
    class Verse {
        constructor(container, text, book, chapter, verse, font) {
            this.verseText = text;
            this.verseBook = book;
            this.verseChapter = chapter;
            this.verseVerse = verse;
            this.container = container;
            this.font = font;

            document.getElementById(container).style.fontFamily = this.font;

            document.getElementById(container).innerHTML = '<div href="javascript:void(0)">' + this.verseText + "</div>";

            // document.getElementById(container).style.color = "magenta";

            document.getElementById(this.container).addEventListener(
                "click",
                function () {
                    command = 8;
                    apiCall({
                        cmd: command,
                        ref: `${this.verseBook}:${this.verseChapter}:${this.verseVerse}`
                    });
                },
                false,
            );
        }
    }

    exports.getSch = function getSch() {
        command = 30;
        apiCall({
            cmd: command,
        });
    }

    exports.getSchContent = function getSchContent() {
        //getConfigValue();
        const selectedSchIndex = document.getElementById("schID").value;
        command = 31;
        apiCall({
            cmd: command,
            index: selectedSchIndex,
        });
    }

    function getConfigValue() {
        command = 40;
        apiCall({
            cmd: command,
            key: 'something',
        });
    }

    function showSchSongLyrics(data) {
        const dataobj = JSON.parse(data);

        processSchSongResponse(dataobj);

        //console.log("Value from server: " + dataobj[0].cat);
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

    function processSchSongResponse(data) {
        var name = data[0].name;
        var font1 = data[0].font;
        var font2 = data[0].font2;
        var lyrics1 = data[0].lyrics;
        var lyrics2 = data[0].lyrics2;

        var slidesArr1 = lyrics1.split("<slide>");
        var slidesArr2 = lyrics2.split("<slide>");

        var twoLine = $("#twoLinePresent").is(":checked");
        if (twoLine) {
            slidesArr1 = splitIN2(slidesArr1);
            slidesArr2 = splitIN2(slidesArr2);
        }

        var numofSlides = slidesArr1.length;

        document.getElementById('resultSongtitleID').innerHTML = `<h2>${name}</h2>`;
        document.getElementById('resultSongID').innerHTML = (""); //Blank out the content before new
        document.getElementById('resultSongID2').innerHTML = (""); //Blank out the content before new

        //console.log(font1);
        //twoLinePresent

        const resultSongID = $("#resultSongID");
        const resultSongID2 = $("#resultSongID2");

        for (let i = 0; i < numofSlides; i++) {
            const unit = $(`<div class='vcClass' style='color:${colorlist[i % numColor]}'></div>`);
            unit.appendTo(resultSongID);

            unit.css("font-family", font1);

            //alert(slidesArr1[i]);
            unit.html(getFirstLine(slidesArr1[i]));
            //unit.html(slidesArr1[i].slice(0,15));

            unit.data("index", i);

            unit.click(function () {
                const slidenum = $(this).data("index"); //Set the index
                const schIndex = document.getElementById("schID").selectedIndex;
                const val = document.getElementById("schID").options[schIndex].value;
                const str = `action?command=17&value=${val}&value2=${slidenum}?`; //Need index in schedule list and slide number
                //console.log("val1:" + val + "  val2:" + slidenum);
                command = 17;
                apiCall(str);
            });

            const unit2 = $(`<div class='vcClass' style='color:${colorlist[i % numColor]}'></div>`);
            //unit2.style.color = "red";
            unit2.appendTo(resultSongID2);

            unit2.css("font-family", font2);

            unit2.html(getFirstLine(slidesArr2[i]));
            //unit2.html(slidesArr2[i].slice(0,15));

            unit2.data("index", i);

            unit2.click(function () {
                const slidenum = $(this).data("index"); //Set the index
                const schIndex = document.getElementById("schID").selectedIndex;
                const val = document.getElementById("schID").options[schIndex].value;
                const str = `action?command=17&value=${val}&value2=${slidenum}?`; //Need index in schedule list and slide number
                command = 17;
                apiCall(str);
            });
        }
    }

    function fillSch(data) {
        const dataobj = JSON.parse(data);

        var itemsLength = dataobj.length;
        $("#schID").empty(); //Clear the list
        var options = "";
        for (var i = 0; i < itemsLength; i++) {
            if (dataobj[i].contenttype == 0) {
                //console.log("ID: " + dataobj[i].songid)
                options += '<option value="' + dataobj[i].songid + '">' + dataobj[i].songname + "</option>";
            }
        }
        $("#schID").html(options);
    }

    function presentSch() {
        var schIndex = document.getElementById("schID").selectedIndex;
        var val = document.getElementById("schID").options[schIndex].value;
        var str = "action?command=10&value=" + val + "?"; //Might just need the index
        command = 10;
        apiCall(str);
    }

    exports.getBibleRef = function getBibleRef() {
        const ref = document.getElementById("remote_bibleRefID").value;

        const bibleRefObj = new BibleReference(); //Bible Reference object

        if (!bibleRefObj.init(ref)) {
            showToast("Bible", bibleRefObj.getErrorMessage());
        } else {
            command = 8;
            apiCall({
                cmd: command,
                ref: `${bibleRefObj.getBook()}:${bibleRefObj.getChapter()}:${bibleRefObj.getVerse() - 1}`,
            });
        }
    }

    exports.getNextBibleRef = function getNextBibleRef() {
        var str = "action?command=2&value=0?";
        command = 2;
        apiCall(str);
    }

    exports.getPrevBibleRef = function getPrevBibleRef() {
        var str = "action?command=3&value=0?";
        command = 3;
        apiCall(str);
    }

    exports.blankPresentWindow = function blankPresentWindow() {
        var str = "action?command=15&value=0?";
        command = 15;
        apiCall(str);
    }

    exports.logoPresentWindow = function logoPresentWindow() {
        var str = "action?command=14&value=0?";
        command = 14;
        apiCall(str);
    }

    function themePresentWindow() {
        var str = "action?command=13&value=0?";
        command = 13;
        apiCall(str);
    }

    exports.closePresentWindow = function closePresentWindow() {
        var str = "action?command=4&value=0?";
        command = 4;
        apiCall(str);
    }

    exports.getSongList = function getSongList() {
        var ref = document.getElementById("remote_songSearchID").value;
        //alert(ref);
        //ref = ref.replace(/%20/g, " ");
        var str = "action?command=20&value=" + ref + "?";
        command = 20;
        apiCall(str);
    }

    exports.setSongBookmark = function setSongBookmark() {
        var selectedSchIndex = $("#songID").val();
        //console.log("Setting bookmark: " + selectedSchIndex);

        if (selectedSchIndex != null) {
            var str = "action?command=22&value=" + selectedSchIndex + "?";
            command = 22;
            apiCall(str);
            showToast("Bookmark", "Selected song added to the bookmark.");
        } else {
            showToast("Bookmark", "Select a song to bookmark.");
        }
    }

    exports.getVerses = function getVerses() {
        var ref = document.getElementById("remote_bibleRefID").value;

        const bibleRefObj = new BibleReference(); //Bible Reference object

        const isGoodRef = bibleRefObj.init(ref);
        //const isGoodRef = true;
        if (!isGoodRef) {
            showToast("Bible", bibleRefObj.getErrorMessage());
        } else {
            ref = ref.replace(/%20/g, " ");
            var str = "action?command=7&value=" + ref + "?";
            command = 7;
            apiCall(str);
        }
    }

    function activateClicks() {
        for (var i = 0; i < len; i++) {
            var containerId = "VC_" + i;
            var verseText = i + 1 + " " + verses[i].word;
            verseObjArray[i] = new Verse(containerId, verseText, b * 1, c * 1, i, font);
        }
    }

//*******************************************
//  Process the Verse text for webpage
//*******************************************
    function processVerseResponse(data) {
        const dataobj = JSON.parse(data);

        verses = dataobj;

        //console.log("Book: " + dataobj[0].bValue);

        b = dataobj[0].bValue;
        c = dataobj[0].chValue;

        var str = "";
        len = dataobj.length;

        for (var i = 0; i < len; i++) {
            var containerId = "VC_" + i;
            //str = str + '<div class="vcClass" id="' + containerId + '" style="color:' + b_colorlist[i%b_numColor] + '">' +  dataobj[i].word + '</div>';
            str =
                str +
                '<div class="vcClass" id="' +
                containerId +
                '" style="color:' +
                b_colorlist[i % b_numColor] +
                '"></div>';
        }

        return str;
    }

    function showSongList(data) {
        const dataobj = JSON.parse(data);

        fillSongs(dataobj);
    }

    function fillSongs(data) {
        var datalen = data.length;
        $("#songID").empty(); //Clear the list
        var options = "";
        for (var i = 0; i < datalen; i++) {
            options += '<option value="' + data[i].id + '">' + data[i].name + "</option>";
        }
        $("#songID").html(options);
    }

    exports.getSongContent = function getSongContent() {
        //Get the index of the selected list
        var selectedSchIndex = $("#songID").val();
        var str = "action?command=21&value=" + selectedSchIndex + "?";
        command = 21;
        apiCall(str);
    }

    function showSongLyrics(data) {
        const dataobj = JSON.parse(data);

        processSongResponse(dataobj);

        //console.log("Value from server: " + dataobj[0].cat);
    }

    function processSongResponse(data) {
        var name = data[0].name;
        var font1 = data[0].font;
        var font2 = data[0].font2;
        var lyrics1 = data[0].lyrics;
        var lyrics2 = data[0].lyrics2;

        var slidesArr1 = lyrics1.split("<slide>");
        var slidesArr2 = lyrics2.split("<slide>");

        var twoLine = $("#twoLinePresent2").is(":checked");
        if (twoLine) {
            slidesArr1 = splitIN2(slidesArr1);
            slidesArr2 = splitIN2(slidesArr2);
        }

        var numofSlides = slidesArr1.length;

        var resultSongtitleID = $("#songresultTitleID");
        resultSongtitleID.html("<h2>" + name + "</h2>");

        var resultSongID = $("#songresultID");
        resultSongID.html(""); //Blank out the content before new
        //resultSongID.html("<h2>" + name + "</h2>");

        var resultSongID2 = $("#songresultID2");
        resultSongID2.html(""); //Blank out the content before new
        //resultSongID2.html("<h2>" + name + "</h2>");

        //console.log(font1);
        for (var i = 0; i < numofSlides; i++) {
            var unit = $("<div class='vcClass' style='color:" + colorlist[i % numColor] + "'></div>");
            unit.appendTo(resultSongID);

            unit.css("font-family", font1);

            //alert(slidesArr1[i]);
            unit.html(getFirstLine2(slidesArr1[i]));
            //unit.html(slidesArr1[i].slice(0,15));

            unit.data("index", i);

            unit.click(function () {
                var slidenum = $(this).data("index"); //Set the index
                var schIndex = document.getElementById("songID").selectedIndex;
                var val = document.getElementById("songID").options[schIndex].value;
                var str = "action?command=17&value=" + val + "&value2=" + slidenum + "?"; //Need index in schedule list and slide number
                //console.log("val1:" + val + "  val2:" + slidenum);
                command = 17;
                apiCall(str);
            });

            var unit2 = $("<div class='vcClass' style='color:" + colorlist[i % numColor] + "'></div>");
            //unit2.style.color = "red";
            unit2.appendTo(resultSongID2);

            unit2.css("font-family", font2);

            unit2.html(getFirstLine2(slidesArr2[i]));
            //unit2.html(slidesArr2[i].slice(0,15));

            unit2.data("index", i);

            unit2.click(function () {
                var slidenum = $(this).data("index"); //Set the index
                var schIndex = document.getElementById("songID").selectedIndex;
                var val = document.getElementById("songID").options[schIndex].value;
                var str = "action?command=17&value=" + val + "&value2=" + slidenum + "?"; //Need index in schedule list and slide number
                command = 17;
                apiCall(str);
            });
        }
    }

    function getFirstLine(x) {
        var singleLine = $("#singleLine").is(":checked");
        //console.log(singleLine);
        if (singleLine) {
            var t = x.split("<BR>");
            return t[0];
        } else {
            return x;
        }
    }

    function getFirstLine2(x) {
        var singleLine = $("#singleLine2").is(":checked");
        //console.log(singleLine);
        if (singleLine) {
            var t = x.split("<BR>");
            return t[0];
        } else {
            return x;
        }
    }

    function apiCall(params, callback = null) {
        const url = ['/action', new URLSearchParams(params).toString()].join("?");

        fetch(url)
            .then(response => response.text())
            .then(data => {
                if (data !== undefined) {
                    if (command == 16) {
                        processSchSongResponse(data); //Process and put data here
                    }

                    if (command == 7) {
                        console.log(data);
                        const dataobj = JSON.parse(data);
                        if (!dataobj[0]["goodref"]) {
                            showToast("Bible", "Invalid Reference");
                        } else {
                            $("#resultID").html(processVerseResponse(data));
                            activateClicks();
                        }
                    } else {
                        if (command == 1) {
                            if (data != "Presenting verse...") {
                                //$( "#resultID" ).html( data );
                                //alert("presenting : " + data);
                            }
                        }
                    }

                    if (command == 20) {
                        //alert("Getting songs");
                        //console.log(data);
                        showSongList(data);
                    }

                    if (command == 21) {
                        //console.log("Got song by ID" + data);

                        showSongLyrics(data);
                    }

                    if (command == 30) {
                        //console.log("Schedule received: " + data);
                        fillSch(data);
                    }

                    if (command == 31) {
                        //console.log("Got song by ID" + data);
                        showSchSongLyrics(data);
                    }

                    if (command == 40) {
                        //alert("Got config" + data);
                    }

                    if (command == 18) {
                        //command to get song list based on search value
                        fillSongList(data); //Defined in songs.js remote
                    }
                }
            })
            .catch(error => {
                showToast("Remote VerseVIEW", "Error.. " + error);
                if (error !== undefined) {
                    $("#resultID").html(error.statusText);
                }
            });
    }

    function showToast(title, message) {
        $("#toastTitle").html(title);
        $("#toastBody").html(message);

        $(".toast").show();
        setTimeout(function () {
            $(".toast").hide();
        }, 2000);
    }
}(window));