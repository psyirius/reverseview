/*
	VERSEVIEW FOR CHORDS VIEW
	May 4, 2021

	Copyright (c) 2021 VerseVIEW
	
	Disclaimer: THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

/*
	GLOBAL
*/
var songname;
var version;
var rawdata;


/* 
    AJAX
*/
function getContent(v) {
	var str = 'index.html?command=20&value=' + v;		//Command to get the content of the presentation
	command = 20;
	ajax(str);
}

function getSch() {
	var str = 'remotexml2.html?command=6&value=1?';
	command = 6;
	ajax(str);
}


function ajax(str) {
	$.ajax({
		type: "GET",
		url: str,
		async: true,
		dataType: "text",
		success: function (data) {
			if (data !== undefined) {
				if (command == 20) {
					//console.log(data);
					processData(data);
				}
				
				if (command == 6) {
					fillSch(data);
				}
			}
		},
		error: function (data) {
			if (data !== undefined) {
				console.log(data.statusText);
			}
		}
	});
}



/*
	UI STUFF
*/
function getSongName(){
	songname = $("#inputSongname option:checked").text();
}

function getVersion(){
	version = $("#inputVersion option:checked").val();
}

function updateContent(str){
	$("#chordsdiv").html(str);
}


function setauthor(x){
	if (x != null){
		$("#authordiv").val(x);
	} else {
		$("#authordiv").val("");
	}
}

function setbpm(x){
	if ((x != null) && (x != 0)){
		$("#bpmdiv").val(x);
	} else {
		$("#bpmdiv").val("");
	}
}

function settime(x){
	if (x != null){
		$("#timediv").val(x);
	} else {
		$("#timediv").val("");
	}
}


function init(){
	$("#buttonGet4").click(function(){
		getSongName();
		getVersion();
		
		var str = songname + "|" + version;
		
		getContent(str);
	});
	
	$("#buttonGetSchedule4").click(function(){
		getSch();
	});
}


/*
	PROCESS DATA
*/
function processData(x){
	rawdata = x;
	
	if (rawdata == "Chords are not available for this song"){
		updateContent("Chords are not available for this song");
		setauthor("");
		setbpm("");
		settime("");
		return(false);
	}
	
	var dataArray = rawdata.split('<|>');
	var lyrics = isDataGood(dataArray[0]);
	var chords = isDataGood(dataArray[1].replace(/ /g,"&nbsp;"));
	var key = isDataGood(dataArray[2]);
	var name = isDataGood(dataArray[3]);
	var bpm = isDataGood(dataArray[4]);
	var timesig = isDataGood(dataArray[5]);
	
	//console.log(lyrics);
	//console.log(chords);
	//console.log(key);
	//console.log(name);
	//console.log(bpm);
	//console.log(timesig);
	
	setauthor(name);
	setbpm(bpm);
	settime(timesig);
	
	var lyricSlide = lyrics.split('<slide>');
	var chordsSlide = chords.split('<slide>');
	
	var len = lyricSlide.length;
	
	var lyricsLine = new Array();
	var chordsLine = new Array();
	
	for(var i=0; i<len; i++){
		var line = lyricSlide[i].split('<BR>');
		var cline = chordsSlide[i].split('<br>');
		
		var linelen = line.length;
		
		for(var j=0; j<linelen; j++){
			lyricsLine.push(line[j]);
			chordsLine.push(cline[j]);
		}
		lyricsLine.push('<BR>');		//Add line break for new slide
		chordsLine.push('<BR>');
	}
	
	var content = "";
	var len = lyricsLine.length;
	
	for(var i=0; i<len; i++){
		content += '<div class="chords">' + chordsLine[i] + '</div>';
		content += '<div class="lyrics">' + lyricsLine[i] + '</div>';
	}
	
	updateContent(content);
}


function fillSch(str) {
	//console.log(str);
	items = str.split("|");
	var itemsLength = items.length;
	$("#inputSongname").empty();			//Clear the list
	var options = "";
	for (var i = 0; i < itemsLength; i++) {
		options = '<option value="' + i + '">' + items[i] + '</option>';
		$("#inputSongname").append(options);
	}
}

function isDataGood(x){
	return x == null ? 0 : x;
}


