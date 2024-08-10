/*
	VERSEVIEW FOR LOWER THIRD VIEW
	June 9, 2020

	Copyright (c) 2020 VerseVIEW
	
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
		console.log(backgroundFilename);
		$(".theme1").css("background-image", "url(" + backgroundFilename + ")");
	} else {
		$(".theme1").css("background-image", "none");
	}

	if (enableUpperCase){
		p_text1 = p_text1.toUpperCase();
		p_text2 = p_text2.toUpperCase();
	}

	if (p_title != "") {		//Detect it is a verse and add the book name and chapter
		p_text1 = p_title + "<br>" + p_text1;
		//p_text2 = p_title + ":" + p_text2;
	}

	if (showBothTranslations) {
		//p_text1 = p_text1 + "<BR>" + "<div style='font-family:" + p_font2 + "'>" + p_text2 + "</div>";
	}

	//console.log(p_text1);
	if (p_text1 == "") {
		console.log("blank");
	}


	//SETUP THE POSITION of left translation
	$("#resultID1").css("top", vv_top);
	$("#resultID1").css("left", vv_left);
	$("#resultID1").css("width", (vv_width/2)-spaceBetweenTranslations);
	$("#resultID1").css("height", vv_height);
	
	//SETUP THE POSITION of right translation
	$("#resultID2").css("top", vv_top);
	$("#resultID2").css("left", vv_left + (vv_width/2) + (spaceBetweenTranslations*2));
	$("#resultID2").css("width", (vv_width/2)-spaceBetweenTranslations);
	$("#resultID2").css("height", vv_height);
	
	$("#resultID1").css("color", vv_text_color1);
	$("#resultID2").css("color", vv_text_color2);
	

	var f = p_font1;
	if (newFont1 != ""){
		f = newFont1;
	}
	$("#resultID1").css("font-family", f);
	$("#resultID1").html(p_text1);
	
	var f = p_font2;
	if (newFont2 != ""){
		f = newFont2;
	}
	$("#resultID2").css("font-family", f);
	$("#resultID2").html(p_text2);
	
	textFit(document.getElementsByClassName('box1')[0], {
		minFontSize: minfont,
		maxFontSize: maxfont,
		alignVert: true,
		multiLine: textMultiLine,
		widthOnly: false,
		detectMultiLine: false
	});
	
	textFit(document.getElementsByClassName('box2')[0], {
		minFontSize: minfont,
		maxFontSize: maxfont,
		alignVert: true,
		multiLine: textMultiLine,
		widthOnly: false,
		detectMultiLine: false
	});
}