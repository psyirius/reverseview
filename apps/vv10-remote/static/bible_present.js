/*
VERSEVIEW FOR LOWER THIRD VIEW
May 21, 2020

Copyright (c) 2020 VerseVIEW
	
Disclaimer: THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


var command;
var items;
var len;
var verses;
var font;
var b;
var c;

var colorlist = ["red","black","green","blue","magenta"];
var numColor = colorlist.length;

var b_colorlist = ["black","#0000FF"];
var b_numColor = b_colorlist.length;

var verseObjArray = [];

function verseClass() {
	this.init = init;

	var verseText = "";
	var verseBook = null;
	var verseChapter = null;
	var verseVerse = null;

	var container = null;

	var font = null;

	function init(con, t, b, c, v, f) {
		container = con;
		verseText = t;
		verseBook = b;
		verseChapter = c;
		verseVerse = v;
		font = f;

		document.getElementById(container).style.fontFamily = f;

		

		document.getElementById(container).innerHTML = '<div href="javascript:void(0)">' + verseText + "</div>";

		//document.getElementById(container).style.color = "magenta";

		addEvents();
	}

	function addEvents() {
		document.getElementById(container).addEventListener("click", processVerseClick, false);
	}

	function processVerseClick() {
		var tempStr = verseBook + ":" + verseChapter + ":" + verseVerse;
		//console.log("Reference temp: " + tempStr);
		var str = 'bible_present.html?command=8&value=' + tempStr + '?';
		command = 8;
		ajax(str);
	}

	function processVerseMouseOver() {
		air.trace("Mouse Over");
	}

	function processVerseMouseOut() {
		air.trace("Mouse Out");
	}
}


//*For Schedule
function getSch() {
	var str = 'remotexml2.html?command=30&value=0?';
	command = 30;
	ajax(str);
}

//***********************************
// Getting the content of the item in schedule 
// Only song for now
// Jan 8, 2016
//************************************
function getSchContent() {
	//getConfigValue();
	//setTimeout(function (){
		//Get the index of the selected list
		var selectedSchIndex = $("#schID").val();
		var str = 'index.html?command=31&value=' + selectedSchIndex + '?';
		command = 31;
		ajax(str);
	//},1000);
	
}

function getConfigValue(){
	var str = 'index.html?command=40&value=something?';
	command = 40;
	ajax(str);
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
	var newSlides = new Array();
	//console.log("Slide length " + len);

	for (var i = 0; i < len; i++) {
		//console.log("Slide: |" + s[i] + "|");

		var slideIsBlank = isBlank(s[i]);		//Function in common.js


		var lines = s[i].split('<BR>');

		//if (lines == null) {
		//	lines = "";
		//}

		var newLine = "";
		var lineLen = lines.length;
		//debug("Line Length: " + lineLen);

		var count = 1;

		if (!slideIsBlank) {
			for (var x = 0; x < lineLen; x++) {		//This is the code to break into two lines
				//	debug("Line " + (x+1) + "...." + lines[x]);
				if (count == 2) {
					newLine = newLine + lines[x];
					newSlides.push(newLine);
					newLine = "";
					count = 1;
				} else {
					newLine = newLine + lines[x] + '<BR>';
					count++;
				}
			}

			if (count == 2) {
				newSlides.push(newLine);	// For odd number of lines
			}
		} else {
			newSlides.push(newLine);	//The original is blank. So Push in a blank slide   June 28, 2020
		}
	}

	return (newSlides);
}

/*
    *  Check if the string is blank
    *   June 28, 2020
    */
function isBlank(str) {
    //print("slideText length" + str.length);
    var slideTxtWithoutSpace = str.replace(/\s/g, '');		//Remove all spaces
    slideTxtWithoutSpace = slideTxtWithoutSpace.replace(/<BR>/g, '');	//Already the \n has been replaced by <BR> so remove that too
    //print("slideText length without space" + slideTxtWithoutSpace.length);

    if (slideTxtWithoutSpace.length > 0) {
        return (false);
    } else {
        return (true);
    }
}


function processSchSongResponse(data){
	var name = data[0].name;
	var font1 = data[0].font;
	var font2 = data[0].font2;
	var lyrics1 = data[0].lyrics;
	var lyrics2 = data[0].lyrics2;
	
	var slidesArr1 = lyrics1.split("<slide>");
	var slidesArr2 = lyrics2.split("<slide>");

	var twoLine = $("#twoLinePresent").is(':checked');
	if (twoLine){
		slidesArr1 = splitIN2(slidesArr1);
		slidesArr2 = splitIN2(slidesArr2);
	}
	
	var numofSlides = slidesArr1.length;
	
	var resultSongtitleID = $("#resultSongtitleID");
	resultSongtitleID.html("<h2>" + name + "</h2>");

	var resultSongID = $("#resultSongID");
	resultSongID.html("");		//Blank out the content before new
	//resultSongID.html("<h2>" + name + "</h2>");
	
	var resultSongID2 = $("#resultSongID2");
	resultSongID2.html("");		//Blank out the content before new
	//resultSongID2.html("<h2>" + name + "</h2>");

	//console.log(font1);
	//twoLinePresent
	for (var i = 0; i < numofSlides; i++) {
		var unit = $("<div class='vcClass' style='color:" + colorlist[i%numColor] + "'></div>");
		unit.appendTo(resultSongID);

		unit.css("font-family", font1);

		//alert(slidesArr1[i]);
		unit.html(getFirstLine(slidesArr1[i]));
		//unit.html(slidesArr1[i].slice(0,15));

		unit.data("index", i);

		unit.click(function () {
			var slidenum = $(this).data("index");		//Set the index
			var schIndex = document.getElementById('schID').selectedIndex;
			var val = document.getElementById('schID').options[schIndex].value;
			var str = 'index.html?command=17&value=' + val + '&value2=' + slidenum + '?';		//Need index in schedule list and slide number
			//console.log("val1:" + val + "  val2:" + slidenum);
			command = 17;
			ajax(str);
		});


		var unit2 = $("<div class='vcClass' style='color:" + colorlist[i%numColor] + "'></div>");
		//unit2.style.color = "red";
		unit2.appendTo(resultSongID2);

		unit2.css("font-family", font2);

		unit2.html(getFirstLine(slidesArr2[i]));
		//unit2.html(slidesArr2[i].slice(0,15));

		unit2.data("index", i);

		unit2.click(function () {
			var slidenum = $(this).data("index");		//Set the index
			var schIndex = document.getElementById('schID').selectedIndex;
			var val = document.getElementById('schID').options[schIndex].value;
			var str = 'index.html?command=17&value=' + val + '&value2=' + slidenum + '?';		//Need index in schedule list and slide number
			command = 17;
			ajax(str);
		});
	}
}


function fillSch(data) {
	const dataobj = JSON.parse(data);
	
	var itemsLength = dataobj.length;
	$("#schID").empty();			//Clear the list
	var options = "";
	for (var i = 0; i < itemsLength; i++) {
		if (dataobj[i].contenttype == 0){
			//console.log("ID: " + dataobj[i].songid)
			options += '<option value="' + dataobj[i].songid + '">' + dataobj[i].songname + '</option>';
		}
	}
	$("#schID").html(options);
}

function presentSch() {
	var schIndex = document.getElementById('schID').selectedIndex;
	var val = document.getElementById('schID').options[schIndex].value;
	var str = 'remotexml2.html?command=10&value=' + val + '?';		//Might just need the index
	command = 10;
	ajax(str);
}


//********End For schedule



function goHome() {
	location.href = "index.html";
}

function getBibleRef() {
	var ref = document.getElementById('remote_bibleRefID').value;
	
	const bibleRefObj = new BibleReference();			//Bible Reference object
	
	const isGoodRef = bibleRefObj.init(ref);
	//const isGoodRef = true;
    if (!isGoodRef) {
		showToast("Bible",bibleRefObj.getErrorMessage());
	} else {
		//alert("Good Ref :" + bibleRefObj.getbvalue() + bibleRefObj.getcvalue() + bibleRefObj.getvvalue() );
		//ref = ref.replace(/%20/g, " ");
		var ref = bibleRefObj.getBook() + ":" + bibleRefObj.getChapter() + ":" + (bibleRefObj.getVerse()-1);
		var str = 'bible_present.html?command=8&value=' + ref + '?';
		command = 8;
		ajax(str);
	}

	/*
	var ref = document.getElementById('remote_bibleRefID').value;
	alert(ref);
	ref = ref.replace(/%20/g, " ");

	//var tempStr = verseBook + ":" + verseChapter + ":" + verseVerse;
	//console.log("Reference temp: " + tempStr);
	var str = 'bible_present.html?command=8&value=' + ref + '?';
	command = 8;
	ajax(str);
	
	//var str = 'bible_present.html?command=1&value=' + ref + '?';
	//command = 1;
	//ajax(str);
	*/
}

function getNextBibleRef() {
	var str = 'bible_present.html?command=2&value=0?';
	command = 2;
	ajax(str);
}

function getPrevBibleRef() {
	var str = 'bible_present.html?command=3&value=0?';
	command = 3;
	ajax(str);
}

function blankPresentWindow() {
	var str = 'bible_present.html?command=15&value=0?';
	command = 15;
	ajax(str);
}

function logoPresentWindow() {
	var str = 'bible_present.html?command=14&value=0?';
	command = 14;
	ajax(str);
}

function themePresentWindow() {
	var str = 'bible_present.html?command=13&value=0?';
	command = 13;
	ajax(str);
}

function closePresentWindow() {
	var str = 'bible_present.html?command=4&value=0?';
	command = 4;
	ajax(str);
}

function getSongList() {
	var ref = document.getElementById('remote_songSearchID').value;
	//alert(ref);
	//ref = ref.replace(/%20/g, " ");
	var str = 'bible_present.html?command=20&value=' + ref + '?';
	command = 20;
	ajax(str);
}

function setSongBookmark(){
	var selectedSchIndex = $("#songID").val();
	//console.log("Setting bookmark: " + selectedSchIndex);

	if (selectedSchIndex != null) {
		var str = 'index.html?command=22&value=' + selectedSchIndex + '?';
		command = 22;
		ajax(str);
		showToast("Bookmark","Selected song added to the bookmark.");
	} else {
		showToast("Bookmark","Select a song to bookmark.");
	}
}

function getVerses() {
	var ref = document.getElementById('remote_bibleRefID').value;
	
	const bibleRefObj = new BibleReference();			//Bible Reference object
	
	const isGoodRef = bibleRefObj.init(ref);
	//const isGoodRef = true;
    if (!isGoodRef) {
		showToast("Bible",bibleRefObj.getErrorMessage());
	} else {
		ref = ref.replace(/%20/g, " ");
		var str = 'bible_present.html?command=7&value=' + ref + '?';
		command = 7;
		ajax(str);
	}
}

function activateClicks() {
	for (var i = 0; i < len; i++) {
		var containerId = 'VC_' + i;
		verseObjArray[i] = new verseClass;
		var verseText = (i+1) + " " + verses[i].word;
		//alert("number values.... " + b + " " + c + " " + i);
		verseObjArray[i].init(containerId, verseText, (b * 1), (c * 1), (i), font);
		//verseObjArray[i].init(containerId,verseText,((b*1)+1),((c*1)+1),((i*1)+2),font);
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

	for (var i = 0; i < (len); i++) {
		var containerId = 'VC_' + i;	
		//str = str + '<div class="vcClass" id="' + containerId + '" style="color:' + b_colorlist[i%b_numColor] + '">' +  dataobj[i].word + '</div>';
		str = str + '<div class="vcClass" id="' + containerId + '" style="color:' + b_colorlist[i%b_numColor] + '"></div>';
	}

	return (str);
}

function showSongList(data){
	const dataobj = JSON.parse(data);
	
	fillSongs(dataobj);
}


function fillSongs(data) {
	var datalen = data.length;
	$("#songID").empty();			//Clear the list
	var options = "";
	for (var i = 0; i < datalen; i++) {
		options += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
	}
	$("#songID").html(options);
}


function getSongContent() {
	//Get the index of the selected list
	var selectedSchIndex = $("#songID").val();
	var str = 'index.html?command=21&value=' + selectedSchIndex + '?';
	command = 21;
	ajax(str);
}

function showSongLyrics(data) {
	const dataobj = JSON.parse(data);
	
	processSongResponse(dataobj);
	
	//console.log("Value from server: " + dataobj[0].cat);
}


function processSongResponse(data){
	var name = data[0].name;
	var font1 = data[0].font;
	var font2 = data[0].font2;
	var lyrics1 = data[0].lyrics;
	var lyrics2 = data[0].lyrics2;
	
	var slidesArr1 = lyrics1.split("<slide>");
	var slidesArr2 = lyrics2.split("<slide>");
	
	var twoLine = $("#twoLinePresent2").is(':checked');
	if (twoLine){
		slidesArr1 = splitIN2(slidesArr1);
		slidesArr2 = splitIN2(slidesArr2);
	}

	var numofSlides = slidesArr1.length;
	
	var resultSongtitleID = $("#songresultTitleID");
	resultSongtitleID.html("<h2>" + name + "</h2>");

	var resultSongID = $("#songresultID");
	resultSongID.html("");		//Blank out the content before new
	//resultSongID.html("<h2>" + name + "</h2>");
	
	var resultSongID2 = $("#songresultID2");
	resultSongID2.html("");		//Blank out the content before new
	//resultSongID2.html("<h2>" + name + "</h2>");

	//console.log(font1);
	for (var i = 0; i < numofSlides; i++) {
		var unit = $("<div class='vcClass' style='color:" + colorlist[i%numColor] + "'></div>");
		unit.appendTo(resultSongID);

		unit.css("font-family", font1);

		//alert(slidesArr1[i]);
		unit.html(getFirstLine2(slidesArr1[i]));
		//unit.html(slidesArr1[i].slice(0,15));

		unit.data("index", i);

		unit.click(function () {
			var slidenum = $(this).data("index");		//Set the index
			var schIndex = document.getElementById('songID').selectedIndex;
			var val = document.getElementById('songID').options[schIndex].value;
			var str = 'index.html?command=17&value=' + val + '&value2=' + slidenum + '?';		//Need index in schedule list and slide number
			//console.log("val1:" + val + "  val2:" + slidenum);
			command = 17;
			ajax(str);
		});


		var unit2 = $("<div class='vcClass' style='color:" + colorlist[i%numColor] + "'></div>");
		//unit2.style.color = "red";
		unit2.appendTo(resultSongID2);

		unit2.css("font-family", font2);

		unit2.html(getFirstLine2(slidesArr2[i]));
		//unit2.html(slidesArr2[i].slice(0,15));

		unit2.data("index", i);

		unit2.click(function () {
			var slidenum = $(this).data("index");		//Set the index
			var schIndex = document.getElementById('songID').selectedIndex;
			var val = document.getElementById('songID').options[schIndex].value;
			var str = 'index.html?command=17&value=' + val + '&value2=' + slidenum + '?';		//Need index in schedule list and slide number
			command = 17;
			ajax(str);
		});
	}
}


function getFirstLine(x){
	var singleLine = $("#singleLine").is(':checked');
	//console.log(singleLine);
	if (singleLine){
		var t = x.split("<BR>");
		return(t[0]);
	} else {
		return(x);
	}
}

function getFirstLine2(x){
	var singleLine = $("#singleLine2").is(':checked');
	//console.log(singleLine);
	if (singleLine){
		var t = x.split("<BR>");
		return(t[0]);
	} else {
		return(x);
	}
}

function ajax(str) {
	$.ajax({
		type: "GET",
		url: str,
		async: true,
		dataType: "text",
		success: function (data) {
			//alert("success");

			if (data !== undefined) {
				if (command == 16) {
					processSchSongResponse(data);		//Process and put data here
				}

				if (command == 7) {
					console.log(data);
					const dataobj = JSON.parse(data);
					if (!(dataobj[0]["goodref"])) {
						showToast("Bible","Invalid Reference");
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
				
				if (command == 20){
					//alert("Getting songs");
					//console.log(data);
					showSongList(data);
				}
				
				if (command == 21){
					//console.log("Got song by ID" + data);
					
					showSongLyrics(data);
				}
				
				if (command == 30) {
					//console.log("Schedule received: " + data);
					fillSch(data);
				}
				
				if (command == 31){
					//console.log("Got song by ID" + data);	
					showSchSongLyrics(data);
				}
				
				if (command == 40){
					//alert("Got config" + data);	
				}

				if (command == 18) {
					//command to get song list based on search value
					fillSongList(data);		//Defined in songs.js remote
				}
			}
		},
		error: function (data) {
			showToast("Remote VerseVIEW",("Error.. " + data));
			if (data !== undefined) {
				$("#resultID").html(data.statusText);
			}
		}
	});
}


function showToast(title,message){
	$("#toastTitle").html(title);
	$("#toastBody").html(message);

	$(".toast").show();
	setTimeout(function(){
		$(".toast").hide();
	},2000);
}

