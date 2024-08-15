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


/* ADJUST THESE VARIABLES FOR FASTER RESPONSE AND FONT SIZE */
var interval = 200;		//Polling time is 1000ms
var minfont = 20;			/* Adjust as needed */
var maxfont = 50;

var firstTime = true;



/* FORMATTING CODE STARTS HERE */
var command;

var timeVar;

var p_title;
var p_font1;
var p_font2;
var p_text1;
var p_text2;

var greenScreen = false;
var showdatetime = false;
var alertmessage = "";

/* USE TO IMPLEMENT A GO HOME BUTTON */
function goHome() {
	location.href = "index.html";
}

/* SETUP THE AJAX PARAMETERS */
function getStageViewContent() {
	if (firstTime){
		firstTime = false;
	} else {
		stopTimer();
		//var str = 'index.html?command=10&value=0?';		//Command to get the setting of stageview
		//command = 10;
		//ajax(str);

		var str = 'index.html?command=9&value=0?';		//Command to get the content of the presentation
		command = 9;
		ajax(str);
	}
}

/* PROCESS THE REPONSE AND ASSIGN THE RIGHT STRINGS */
function parseLower3rdResponse(txt) {			//Process correctly for the screen resoluton and add headers and footers
		$("#mainContainer").show();
		var t = JSON.parse(txt);
		//var t = txt.split("<newelement>");		//Used to be |, June 23, 2020
		p_title = "";
		p_text1 = "";
		p_text2 = "";

		p_title = t.title;
		p_font1 = t.font1;
		p_font2 = t.font2;
		p_text1 = t.content1;
		p_text2 = t.content2;

		if (p_text2.length > 2) {
			//showBothTranslations = true;
		} else {
			//showBothTranslations = false;
		}
}


/* AJAX CALL */
function ajax(str) {
	$.ajax({
		type: "GET",
		url: str,
		async: true,
		dataType: "text",
		success: function (data) {
			if (data !== undefined) {
				if (command == 10){	//Requesting for command
					//console.log("Setting Stage View Parameters in remote.." + data);
					greenScreen = JSON.parse(data).StageGreenScreen;
					showdatetime = JSON.parse(data).StageShowTime;
					alertmessage = JSON.parse(data).StageAlertMessage;
				}
				if (command == 9) {
					//console.log(data);
					if (greenScreen){
						$("body").addClass("greenScreenColor");
						$("body").removeClass("blackScreenColor");
					} else {
						$("body").addClass("blackScreenColor");
						$("body").removeClass("greenScreenColor");
					}


					if (JSON.parse(data).content1 == "") {
						$("#mainContainer").hide();		//hide box
					} else {
						$("#mainContainer").fadeIn();
						parseLower3rdResponse(data);
						processLower3rdResponse();
					}
					startTimer();
				}
			}
		},
		error: function (data) {
			if (data !== undefined) {
				//$("#resultID").html(data.statusText);
				console.log(data.statusText);
				$("#mainContainer").hide();
				startTimer();
			}
		}
	});
}



/* START TIMER */
function startTimer() {
	//console.log("Start Timer " + firstTime);
	//if (firstTime){
		var str = 'index.html?command=10&value=0?';		//Command to get the setting of stageview
		command = 10;
		ajax(str);

		//firstTime = false;
	//} //else {
		timeVar = setInterval(function () { getStageViewContent() }, interval);
	//}
}


/* STOP TIMER */
function stopTimer() {
	//console.log("Stop Timer");
	clearInterval(timeVar);
}





