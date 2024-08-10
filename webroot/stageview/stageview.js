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



/* FORMATTING CODE STARTS HERE */
var command;

var timeVar;

var p_title;
var p_font1;
var p_font2;
var p_text1;
var p_text2;

/* USE TO IMPLEMENT A GO HOME BUTTON */
function goHome() {
	location.href = "index.html";
}

/* SETUP THE AJAX PARAMETERS */
function getStageViewContent() {
	stopTimer();
	var str = 'index.html?command=9&value=0?';		//Command to get the content of the presentation
	command = 9;
	ajax(str);
}

/* PROCESS THE REPONSE AND ASSIGN THE RIGHT STRINGS */
function parseLower3rdResponse(txt) {			//Process correctly for the screen resoluton and add headers and footers
		$("#mainContainer").show();
		var t = txt.split("<newelement>");		//Used to be |, June 23, 2020
		p_title = "";
		p_text1 = "";
		p_text2 = "";

		p_title = t[0];
		p_font1 = t[1];
		p_font2 = t[2];
		p_text1 = t[3];
		p_text2 = t[4];

	
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
				if (command == 9) {
					//console.log(data);
					//data = ""
					if (data == "") {
						//hide box
						//console.log("hidding green screen");
						//$(".greenScreenColor").css("background-image", "url(" + "../img/g1.jpg" + ")");	//when no data, it will just blank
						//$(".greenScreenColor").css("background-image", "url(" + backgroundFilename + ")");	//when no data, it will just blank
						$(".theme1").css("background-image", "none");
						$("#mainContainer").hide();
						//$("body").removeClass("greenScreenColor");
					} else {
						$("#mainContainer").fadeIn();
						$("body").addClass("greenScreenColor");
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
	//console.log("Start Timer");
	timeVar = setInterval(function () { getStageViewContent() }, interval);

}


/* STOP TIMER */
function stopTimer() {
	//console.log("Stop Timer");
	clearInterval(timeVar);
}





