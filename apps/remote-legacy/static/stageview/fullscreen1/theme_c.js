/*
	VERSEVIEW FOR LOWER THIRD VIEW
	Feb 11, 2021

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
    PROCESS THE DATA AND DISPLAY IT CORRECTLY FOR THE THEME
*/
function processLower3rdResponse(){

	$(".textStyle").css("text-align", textAlign);

	$(".textStyle").css("text-shadow", textShadow);
	$(".textStyle").css("-webkit-text-stroke", textOutline);

	if (backgroundImage){
		//console.log(backgroundFilename);
		$(".theme1").css("background-image", "url(" + backgroundFilename + ")");
	} else {
		$(".theme1").css("background-image", "none");
	}

	if (enableUpperCase){
		p_text1 = p_text1.toUpperCase();
		p_text2 = p_text2.toUpperCase();
	}

	var verseNumber = "";
	if (p_title != "") {		//Detect it is a verse and add the book name and chapter
		verseNumber = (p_text1.split(" "))[0];
		//console.log(verseNumber);
		p_text1 = p_text1.substr(p_text1.indexOf(" ") + 1);
		p_text2 = p_text2.substr(p_text2.indexOf(" ") + 1);
	}
	
	
	if (p_title != "") {		//Detect it is a verse and add the book name and chapter
		p_text1 = p_title + ":" + verseNumber + "<br><br>" + p_text1;
		//p_text2 = p_title + ":" + p_text2;
	}

	if (showBothTranslations) {
		//p_text1 = p_text1 + "<BR>" + "<div style='font-family:" + p_font2 + "'>" + p_text2 + "</div>";
	}

	//console.log(p_text1);
	if (p_text1 == "") {
		console.log("blank");
	}

	
	
	//console.log($( window ).width());
	var newscreenResolutionHorizontal = $( window ).width();
	var newscreenResolutionVertical = $( window ).height();

	var vv_width_percent = newscreenResolutionHorizontal/screenResolutionHorizontal;
	var vv_height_percent = newscreenResolutionVertical/screenResolutionVertical;

	var new_vv_top = vv_top*vv_height_percent;
	var new_vv_left = vv_left*vv_width_percent;
	var new_vv_width = vv_width * vv_width_percent;
	var new_vv_height = vv_height * vv_height_percent;
	var new_spaceBetweenTranslations = spaceBetweenTranslations * vv_height_percent;


	if (showBothTranslations) {
		if (showHorizontal){
			//SETUP THE POSITION of left translation
			$("#resultID1").css("top", new_vv_top);
			$("#resultID1").css("left", new_vv_left);
			$("#resultID1").css("width", new_vv_width);
			$("#resultID1").css("height", (new_vv_height/2)-new_spaceBetweenTranslations);
			
			//SETUP THE POSITION of right translation
			$("#resultID2").css("top", new_vv_top + (new_vv_height/2) + (new_spaceBetweenTranslations*2));
			$("#resultID2").css("left", new_vv_left);
			$("#resultID2").css("width", new_vv_width);
			$("#resultID2").css("height", (new_vv_height/2)-new_spaceBetweenTranslations);
		} else {
			//SETUP THE POSITION of left translation
			$("#resultID1").css("top", new_vv_top);
			$("#resultID1").css("left", new_vv_left);
			$("#resultID1").css("width", (new_vv_width/2)-new_spaceBetweenTranslations);
			$("#resultID1").css("height", new_vv_height);
			
			//SETUP THE POSITION of right translation
			$("#resultID2").css("top", new_vv_top);
			$("#resultID2").css("left", new_vv_left + (new_vv_width/2) + (new_spaceBetweenTranslations*2));
			$("#resultID2").css("width", (new_vv_width/2)-new_spaceBetweenTranslations);
			$("#resultID2").css("height", new_vv_height);
		}
	} else  {
		//SETUP THE POSITION for full screen single translation
		$("#resultID1").css("top", new_vv_top);
		$("#resultID1").css("left", new_vv_left);
		$("#resultID1").css("width", new_vv_width);
		$("#resultID1").css("height", new_vv_height);
	}
	
	$("#resultID1").css("color", vv_text_color1);
	$("#resultID2").css("color", vv_text_color2);
	

	var f = p_font1;
	if (newFont1 != ""){
		f = newFont1;
	}
	$("#resultID1").css("font-family", f);
	$("#resultID1").html(p_text1);
	
	if (showBothTranslations) {
		var f = p_font2;
		if (newFont2 != ""){
			f = newFont2;
		}
		$("#resultID2").css("font-family", f);
		$("#resultID2").html(p_text2);
	}
	
	textFit(document.getElementsByClassName('box1')[0], {
		minFontSize: minfont,
		maxFontSize: maxfont,
		alignVert: true,
		multiLine: textMultiLine,
		widthOnly: false,
		detectMultiLine: false
	});
	
	if (showBothTranslations) {
		textFit(document.getElementsByClassName('box2')[0], {
			minFontSize: minfont,
			maxFontSize: maxfont,
			alignVert: true,
			multiLine: textMultiLine,
			widthOnly: false,
			detectMultiLine: false
		});
	}
}