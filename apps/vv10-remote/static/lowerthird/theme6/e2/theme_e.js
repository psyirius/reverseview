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
	
	//const queryString = window.location.search;
	//console.log(queryString);


	$(".textStyle").css("text-align", textAlign);

	$(".textStyle").css("text-shadow", textShadow);
	$(".textStyle").css("-webkit-text-stroke", textOutline);


	//console.log("TEXT1 " + p_text1);
	//console.log("TEXT2 " + p_text2);

	if (enableUpperCase){
		p_text1 = p_text1.toUpperCase();
		p_text2 = p_text2.toUpperCase();
	}

	if (p_title != "") {		//Detect it is a verse and add the book name and chapter
		//p_text1 = p_title + "<br>" + p_text1;		// Only lyrics  - so no title
		//p_text2 = p_title + ":" + p_text2;
	}

	if (showBothTranslations) {
		//p_text1 = p_text1 + "<BR>" + "<div style='font-family:" + p_font2 + "'>" + p_text2 + "</div>";
	}

	//console.log(p_text1);
	if (p_text1 == "") {
		console.log("blank");
	}

	var verseNumber = "";
	if (p_title != "") {		//Detect it is a verse and add the book name and chapter
		verseNumber = (p_text1.split(" "))[0];
		//console.log(verseNumber);
		p_text1 = p_text1.substr(p_text1.indexOf(" ") + 1);
		p_text2 = p_text2.substr(p_text2.indexOf(" ") + 1);
	}


	var fullText = p_text1 + "<BR>";
	
	var lines = p_text1.split("<BR>");
	var len = lines.length;
	
	p_text1 = lines[0];
	p_text2 = lines[1];

	if (p_text2 == null){
		p_text2 = "";
	}
	
	if(p_text2.length < 2){
		len = 1;
	}
	
	//console.log("Length  " + len);
	
	if (backgroundImage){
		if (p_title == ""){
			if (len > 2){
				//Full box
				$(".theme1").css("background-image", "url(" + backgroundFilenameFullBox + ")");
			} else {
				if (len == 2){
					$(".theme1").css("background-image", "url(" + backgroundFilename2Line + ")");
				} else {
					$(".theme1").css("background-image", "url(" + backgroundFilename1Line + ")");
				}
			}
		} else {
			//Verse
			$(".theme1").css("background-image", "url(" + backgroundFilenameVerseBox + ")");
		}
	} else {
		$(".theme1").css("background-image", "none");
	}

	//FOR REFERENCE
	$("#resultIDRef").css("top", ref_top);
	$("#resultIDRef").css("left", ref_left);
	$("#resultIDRef").css("width", ref_width);
	$("#resultIDRef").css("height", ref_height);
	
	//SETUP THE POSITION of left translation
	$("#resultID1").css("top", vv_top);
	$("#resultID1").css("left", vv_left);
	$("#resultID1").css("width", vv_width);
	$("#resultID1").css("height", (vv_height/2)-spaceBetweenTranslations);
	
	//SETUP THE POSITION of right translation
	$("#resultID2").css("top", (vv_top + (vv_height/2)));
	$("#resultID2").css("left", vv_left);
	$("#resultID2").css("width", vv_width);
	$("#resultID2").css("height", (vv_height/2)-spaceBetweenTranslations);
	
	$("#resultID1").css("color", vv_text_color1);
	$("#resultID2").css("color", vv_text_color2);
	

	var f = p_font1;
	if (newFont1 != ""){
		f = newFont1;
	}
	$("#resultID1").css("font-family", f);
	$("#resultID2").css("font-family", f);
	$("#resultIDRef").css("font-family", f);
	
	$("#resultIDRef").css("color", vv_ref_color);
	
	if (p_title == ""){
		$("#resultIDRef").html("");
	} else {
		$("#resultIDRef").html(p_title + ":" + verseNumber);
	}
	
	if (p_title == ""){
		if (len == 2){
			$("#resultID1").html(p_text1);
			$("#resultID2").html(p_text2);
		} else {
			if (len == 1){
				$("#resultID2").html(p_text1);
				$("#resultID1").html("");
			} else {
				$("#resultID1").html(fullText);
				$("#resultID2").html("");
				$("#resultID1").css("height", (vv_height/1)-spaceBetweenTranslations);
			}
		}
		textMultiLine = false;
	} else {
		//VERSE
		$("#resultID1").html(fullText);
		$("#resultID2").html("");
		//console.log((vv_height/1)-spaceBetweenTranslations);
		$("#resultID1").css("height", (vv_height/1)-spaceBetweenTranslations);
		textMultiLine = true;
		
		textFit(document.getElementsByClassName('box0')[0], {
			minFontSize: refminfont,
			maxFontSize: refmaxfont,
			alignVert: true,
			multiLine: false,
			widthOnly: false,
			detectMultiLine: true
		});
	}
	
	//console.log(widthOnly);
	
	textFit(document.getElementsByClassName('box1')[0], {
		minFontSize: minfont,
		maxFontSize: maxfont,
		alignVert: true,
		multiLine: textMultiLine,
		widthOnly: false,
		alignVertWithFlexbox: false,
		detectMultiLine: true
	});
	
	textFit(document.getElementsByClassName('box2')[0], {
		minFontSize: minfont,
		maxFontSize: maxfont,
		alignVert: true,
		multiLine: textMultiLine,
		widthOnly: false,
		alignVertWithFlexbox: false,
		detectMultiLine: true
	});
}