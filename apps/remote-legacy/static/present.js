(function (exports) {
    let command;
    let items;
    let len;
    let verses;
    let font;
    let b;
    let c;

    const colorList = ["red", "black", "green", "blue", "magenta"];
    const numColor = colorList.length;

    const b_colorList = ["black", "#0000FF"];
    const b_numColor = b_colorList.length;

    const verseObjRef = [];

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

            //document.getElementById(container).style.color = "magenta";

            document.getElementById(this.container).addEventListener("click", function processVerseClick() {
                const tempStr = `${this.verseBook}:${this.verseChapter}:${this.verseVerse}`;
                const str = `bible_present.html?command=8&value=${tempStr}?`;
                command = 8;
                ajax(str);
            }, false);
        }
    }

    //*For Schedule
    exports.getSch = function () {
        command = 6;
        ajax("remotexml2.html?command=6&value=0?");
    }

    //***********************************
    // Getting the content of the item in schedule
    // Only song for now
    // Jan 8, 2016
    //************************************
    exports.getSchContent = function () {
        //Get the index of the selected list
        const selectedSchIndex = $("#schID").val();
        //alert(selectedSchIndex);
        const str = "index.html?command=16&value=" + selectedSchIndex + "?";
        command = 16;
        ajax(str);
    }

    function fillSch(str) {
        items = str.split("|");
        const itemsLength = items.length;
        $("#schID").empty(); //Clear the list
        let options = "";
        for (let i = 0; i < itemsLength; i++) {
            //document.getElementById('schID').options[i] = new Option(items[i],i);
            options += '<option value="' + i + '">' + items[i] + "</option>";
        }
        $("#schID").html(options).selectmenu("refresh", true);
    }

    exports.presentSch = function () {
        const schIndex = document.getElementById("schID").selectedIndex;
        const val = document.getElementById("schID").options[schIndex].value;
        const str = `remotexml2.html?command=10&value=${val}?`; //Might just need the index
        command = 10;
        ajax(str);
    }

    //********End For schedule
    function goHome() {
        location.href = "index.html";
    }

    exports.getBibleRef = function () {
        let ref = document.getElementById("remote_bibleRefID").value;
        //alert(ref);
        ref = ref.replace(/%20/g, " ");
        const str = "bible_present.html?command=1&value=" + ref + "?";
        command = 1;
        ajax(str);
    }

    exports.getNextBibleRef = function () {
        const str = "bible_present.html?command=2&value=0?";
        command = 2;
        ajax(str);
    }

    exports.getPrevBibleRef = function () {
        const str = "bible_present.html?command=3&value=0?";
        command = 3;
        ajax(str);
    }

    exports.blankPresentWindow = function () {
        const str = "bible_present.html?command=15&value=0?";
        command = 15;
        ajax(str);
    }

    exports.logoPresentWindow = function () {
        const str = "bible_present.html?command=14&value=0?";
        command = 14;
        ajax(str);
    }

    exports.themePresentWindow = function () {
        const str = "bible_present.html?command=13&value=0?";
        command = 13;
        ajax(str);
    }

    exports.closePresentWindow = function () {
        const str = "bible_present.html?command=4&value=0?";
        command = 4;
        ajax(str);
    }

    exports.getVerses = function () {
        let ref = document.getElementById("remote_bibleRefID").value;
        ref = ref.replace(/%20/g, " ");
        const str = "bible_present.html?command=7&value=" + ref + "?";
        command = 7;
        ajax(str);
    }

    function activateClicks() {
        for (let i = 3; i < len; i++) {
            verseObjRef[i] = new Verse(
                `VC_${i}`,
                verses[i],
                b * 1,
                c * 1 - 1,
                i - 3,
                font
            );
        }
    }

    //*******************************************
    //  Process the Verse text for webpage
    //*******************************************
    function processVerseResponse(txt) {
        verses = txt.split("<break>");
        font = verses[0];
        b = verses[1];
        c = verses[2];

        let str = "";

        for (let i = 3; i < verses.length; i++) {
            const containerId = `VC_${i}`;
            //str = str + '<div class="vcClass" id="' + containerId + '">x</div>';
            str = `${str}<div class="vcClass" id="${containerId}" style="color:${b_colorList[i % b_numColor]}"></div>`;
            //str = str + '<div class="vcClass" id="' + containerId + '" style="color:red; text-decoration:none"></div>';
        }

        return str;
    }

    //*******************************************
    //  Process the song text for webpage
    //*******************************************
    function processSongResponse(txt) {
        const contentArr = txt.split("<|>");
        const name = contentArr[0];
        const font1 = contentArr[1];
        const font2 = contentArr[2];
        const lyrics1 = contentArr[3];
        const lyrics2 = contentArr[4];

        const slidesArr1 = lyrics1.split("<slide1>");
        const slidesArr2 = lyrics2.split("<slide2>");

        const numofSlides = slidesArr1.length;

        const resultSongtitleID = $("#resultSongtitleID");
        resultSongtitleID.html("<h2>" + name + "</h2>");

        const resultSongID = $("#resultSongID");
        resultSongID.html(""); //Blank out the content before new
        //resultSongID.html("<h2>" + name + "</h2>");

        const resultSongID2 = $("#resultSongID2");
        resultSongID2.html(""); //Blank out the content before new
        //resultSongID2.html("<h2>" + name + "</h2>");

        //console.log(font1);
        for (let i = 0; i < numofSlides; i++) {
            const unit = $("<div class='vcClass' style='color:" + colorList[i % numColor] + "'></div>");
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
                const str = "index.html?command=17&value=" + val + "&value2=" + slidenum + "?"; //Need index in schedule list and slide number
                command = 17;
                ajax(str);
            });

            const unit2 = $("<div class='vcClass' style='color:" + colorList[i % numColor] + "'></div>");
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
                const str = "index.html?command=17&value=" + val + "&value2=" + slidenum + "?"; //Need index in schedule list and slide number
                command = 17;
                ajax(str);
            });
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

    function ajax(str) {
        $.ajax({
            type: "GET",
            url: str,
            async: true,
            dataType: "text",
            success: function (data) {
                if (data !== undefined) {
                    if (command === 16) {
                        processSongResponse(data); //Process and put data here
                    }

                    if (command === 7) {
                        $("#resultID").html(processVerseResponse(data));
                        activateClicks();
                    } else {
                        if (command === 1) {
                            if (data !== "Presenting verse...") {
                                //$( "#resultID" ).html( data );
                                alert(data);
                            }
                        }
                    }
                    if (command === 6) {
                        fillSch(data);
                    }

                    if (command === 18) {
                        // command to get song list based on search value
                        fillSongList(data); //Defined in songs.js remote
                    }
                }
            },
            error: function (data) {
                if (data !== undefined) {
                    $("#resultID").html(data.statusText);
                }
            },
        });
    }
}(globalThis));