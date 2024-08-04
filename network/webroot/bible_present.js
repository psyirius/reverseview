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

var verseObjArray = new Array();

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
	var str = 'remotexml2.html?command=6&value=0?';
	command = 6;
	ajax(str);
}

//***********************************
// Getting the content of the item in schedule 
// Only song for now
// Jan 8, 2016
//************************************
function getSchContent() {
	//Get the index of the selected list
	var selectedSchIndex = $("#schID").val();
	//alert(selectedSchIndex);
	var str = 'index.html?command=16&value=' + selectedSchIndex + '?';
	command = 16;
	ajax(str);
}


function fillSch(str) {
	items = str.split("|");
	var itemsLength = items.length;
	$("#schID").empty();			//Clear the list
	var options = "";
	for (var i = 0; i < itemsLength; i++) {
		//document.getElementById('schID').options[i] = new Option(items[i],i);
		options += '<option value="' + i + '">' + items[i] + '</option>';
	}
	$("#schID").html(options).selectmenu('refresh', true);
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
	//alert(ref);
	ref = ref.replace(/%20/g, " ");
	var str = 'bible_present.html?command=1&value=' + ref + '?';
	command = 1;
	ajax(str);
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

function getVerses() {
	var ref = document.getElementById('remote_bibleRefID').value;
	ref = ref.replace(/%20/g, " ");
	var str = 'bible_present.html?command=7&value=' + ref + '?';
	command = 7;
	ajax(str);
}

function activateClicks() {
	for (var i = 3; i < len; i++) {
		var containerId = 'VC_' + i;
		verseObjArray[i] = new verseClass;
		var verseText = verses[i];
		//alert("number values.... " + b + " " + c + " " + i);
		verseObjArray[i].init(containerId, verseText, (b * 1), ((c * 1) - 1), (i - 3), font);
		//verseObjArray[i].init(containerId,verseText,((b*1)+1),((c*1)+1),((i*1)+2),font);
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

	var str = "";
	len = verses.length;

	for (var i = 3; i < (len); i++) {
		var containerId = 'VC_' + i;
		//str = str + '<div class="vcClass" id="' + containerId + '">x</div>';
		str = str + '<div class="vcClass" id="' + containerId + '" style="color:' + b_colorlist[i%b_numColor] + '"></div>';
		//str = str + '<div class="vcClass" id="' + containerId + '" style="color:red; text-decoration:none"></div>';
	}

	return (str);
}


//*******************************************
//  Process the song text for webpage
//*******************************************
function processSongResponse(txt) {
	var contentArr = txt.split("<|>");
	var name = contentArr[0];
	var font1 = contentArr[1];
	var font2 = contentArr[2];
	var lyrics1 = contentArr[3];
	var lyrics2 = contentArr[4];

	var slidesArr1 = lyrics1.split("<slide1>");
	var slidesArr2 = lyrics2.split("<slide2>");

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

function ajax(str) {
	$.ajax({
		type: "GET",
		url: str,
		async: true,
		dataType: "text",
		success: function (data) {
			if (data !== undefined) {
				if (command == 16) {
					processSongResponse(data);		//Process and put data here
				}

				if (command == 7) {
					$("#resultID").html(processVerseResponse(data));
					activateClicks();
				} else {
					if (command == 1) {
						if (data != "Presenting verse...") {
							//$( "#resultID" ).html( data );
							alert(data);
						}
					}
				}
				if (command == 6) {
					fillSch(data);
				}

				if (command == 18) {
					//command to get song list based on search value
					fillSongList(data);		//Defined in songs.js remote
				}
			}
		},
		error: function (data) {
			if (data !== undefined) {
				$("#resultID").html(data.statusText);
			}
		}
	});
}

