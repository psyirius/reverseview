/*
	VERSEVIEW FOR LOWER THIRD VIEW
	June 24, 2020

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
    CONFIGURATION FILE - THEME E
	This theme shows the lyrics on the lower side as two lines. This theme only works on two line setup
*/

var screenResolutionHorizontal = 1920;
var screenResolutionVertical = 1080;


var vv_width_percent = 50;
var vv_height_percent = 50;

minfont = 10;			/* Adjust as needed */
maxfont = 50;

refminfont = 10;			/* Adjust as needed */
refmaxfont = 40;

var vv_top = 860;
var vv_left = 225;
var vv_width = 1500;
var vv_height = 170;

var ref_top = 790;
var ref_left = 755;
var ref_width = 410;
var ref_height = 60;



var showBothTranslations = false;	//Change to true to show both translations 
var spaceBetweenTranslations = 30;
var showVerseSideBySide = true;		//If true, then the dual verses will shows left and right
									// If false, then verses will show top and bottom
var textMultiLine = true;

//var vv_text_color1 = "white";
//var vv_text_color2 = "white";

var backgroundImage = true;
var backgroundFilenameFullBox = './img/e13.png';
var backgroundFilenameVerseBox = './img/e14.png';

var textShadow = "0px 0px #000000";     //"2px 2px #000000"
var textOutline = "0px black";          //"2px black"

var textAlign = "center";       //"left", "right", "center"

var enableUpperCase = false;

var newFont1 = "";
var newFont2 = "";		//Overide the font as provided from VerseVIEW Example: Segoe Script



var text0_style = {		//For reference
	"color" : "white",
	"background-color":"rgba(0, 0, 0, 0)",		//First three values (0-255) are Red , Green , Blue and last values (0 to 1, example 0.4)is for opacity
	"border" : "0px solid white",
	"font-weight" : "normal",		//Options are bold, normal
	"font-style" : "normal",		//Options are italics, normal
	"text-align" : "center",		//Options are left, center , right
	"text-decoration": "none",
	"letter-spacing": "",	//Example: "5px"
	"line-height": "",		//Example: "1.5"
	"text-shadow": "1px 1px 1px black",
	"margin" : "0px 0px 0px 0px",
	/*"padding" : "20px 20px 20px 20px",*/
};


var text1_style = {
	"color" : "white",
	"background-color":"rgba(0, 0, 0, 0)",		//First three values (0-255) are Red , Green , Blue and last values (0 to 1, example 0.4)is for opacity
	"border" : "0px solid white",
	"font-weight" : "normal",		//Options are bold, normal
	"font-style" : "normal",		//Options are italics, normal
	"text-align" : "center",		//Options are left, center , right
	"text-decoration": "none",
	"letter-spacing": "",	//Example: "5px"
	"line-height": "",		//Example: "1.5"
	"text-shadow": "1px 1px 1px black",
	"margin" : "0px 0px 0px 0px",
	/*"padding" : "20px 20px 20px 20px",*/
};

var text2_style = {
	"color" : "white",
	"background-color":"rgba(0, 0, 0, 0)",
	"border" : "0px solid cyan",
	"font-weight" : "normal",
	"font-style" : "normal",
	"text-align" : "center",
	"text-decoration": "none",
	"letter-spacing": "",	//Example: "5px"
	"line-height": "",		//Example: "1.5"
	"text-shadow": "1px 1px 1px black",
	"margin" : "0px 0px 0px 0px",
	/*"padding" : "20px 20px 20px 20px",*/
};
