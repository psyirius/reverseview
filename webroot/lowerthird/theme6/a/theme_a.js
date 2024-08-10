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
		p_text1 = p_text1 + "<BR>" + "<span style='font-family:" + p_font2 + "'>" + p_text2 + "</span>";
	}

	//console.log(p_text1);
	if (p_text1 == "") {
		console.log("blank");
	}


	//SETUP THE POSITION
	$("#resultID").css("top", vv_top);
	$("#resultID").css("left", vv_left);
	$("#resultID").css("width", vv_width);
	$("#resultID").css("height", vv_height);
	
	$("#resultID").css("color", vv_text_color);

	//console.log(p_font1);
	$("#resultID").css("font-family", p_font1);
	$("#resultID").html(p_text1);
	textFit(document.getElementsByClassName('box')[0], {
		minFontSize: minfont,
		maxFontSize: maxfont,
		alignVert: true,
		multiLine: true,
		widthOnly: false,
		detectMultiLine: false
	});
}