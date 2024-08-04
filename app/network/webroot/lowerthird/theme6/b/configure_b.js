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
    CONFIGURATION FILE - THEME B
	This theme shows the verse / lyrics on the right side. 
*/

var screenResolutionHorizontal = 1920;
var screenResolutionVertical = 1080;

//var vv_top_percent = 50;
//var vv_left_percent = 50;

var vv_width_percent = 50;
var vv_height_percent = 50;

minfont = 20;			/* Adjust as needed */
maxfont = 50;

/*
var vv_top = 750;
var vv_left = 350;
var vv_width = 1200;
var vv_height = 280;
*/

//For right side view
var vv_top = 220;
var vv_left = 1150;
var vv_width = 600;
var vv_height = 600;


//var vv_width = screenResolutionHorizontal*vv_width_percent/100;
//var vv_height = screenResolutionVertical*vv_height_percent/100;

var showBothTranslations = true;	//Change to true to show both translations 

var vv_text_color = "white";
//var vv_text_color2 = "yellow";

var backgroundImage = true;
var backgroundFilename = '../img/b1.png';	//b1,b2,b3,b4,b5.png

var textShadow = "0px 0px #000000";     //"2px 2px #000000"
var textOutline = "0px black";          //"2px black"

var textAlign = "left";       //"left", "right", "center"

var enableUpperCase = false;