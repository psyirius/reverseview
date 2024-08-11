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
    CONFIGURATION FILE - THEME C
	This theme shows the verse / lyrics on the lower side - side by side. 
*/

var screenResolutionHorizontal = 1920;
var screenResolutionVertical = 1080;



minfont = 20;			/* Adjust as needed */
maxfont = 140;


var vv_top = 100;
var vv_left = 100;
var vv_width = screenResolutionHorizontal - 200;
var vv_height = screenResolutionVertical - 300;

var ref_top = 900;
var ref_left = 1300;
var ref_width = 500;
var ref_height = 100;

var ref_border = {
	"border-color": "#C1E0FF", 
    "border-width":"3px", 
    "border-style":"solid"};


var showBothTranslations = true;	//Change to true to show both translations 
var spaceBetweenTranslations = 5;
var textMultiLine = true;
var showHorizontal = true;

var ref_text_color1 = "cyan";
var vv_text_color1 = "white";
var vv_text_color2 = "white";

var backgroundImage = false;
var backgroundFilename = '../img/g1.jpg';	//b1,b2,b3,b4,b5.png

var textShadow = "0px 0px #000000";     //"2px 2px #000000"
var textOutline = "1px black";          //"2px black"

var textAlign = "center";       //"left", "right", "center"

var enableUpperCase = false;

var newFont1 = "";
var newFont2 = "";		//Overide the font as provided from VerseVIEW Example: Segoe Script

var text1_style = {
	"color" : "white",
	"background-color":"rgba(0, 0, 0, 0)",		//First three values (0-255) are Red , Green , Blue and last values (0 to 1, example 0.4)is for opacity
	"border" : "0px solid black",
	"font-weight" : "normal",		//Options are bold, normal
	"font-style" : "normal",		//Options are italics, normal
	"text-align" : "center",		//Options are left, center , right
	"text-decoration": "none",
	"letter-spacing": "",	//Example: "5px"
	"line-height": "",		//Example: "1.5"
	"text-shadow": "5px 5px 5px black",
	"margin" : "0px 0px 0px 0px",
	"padding" : "20px 20px 20px 20px",
};

var text2_style = {
	"color" : "white",
	"background-color":"rgba(0, 0, 0, 0)",
	"border" : "0px solid black",
	"font-weight" : "normal",
	"font-style" : "normal",
	"text-align" : "center",
	"text-decoration": "none",
	"letter-spacing": "",	//Example: "5px"
	"line-height": "",		//Example: "1.5"
	"text-shadow": "5px 5px 5px black",
	"margin" : "0px 0px 0px 0px",
	"padding" : "20px 20px 20px 20px",
};