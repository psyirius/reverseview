/* Javascript for chat client
   Original: Sept 11, 2014
 */


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

var fixedWordsString = "piano drums mic up down check monitor hum howling red green yellow orange beta58 you are sounds good funny hollow bass guitar"; 
var fixedWords = new Array();

var command;

var timeVar = null;

var chatid = 0;		//ID of latest chat message

var msgTimer = 2000;	//Message is requested every msgTimer millisecond


		
		
	
function goHome(){
	location.href = "index.html";	
}


function getKeywords(){
	var str = 'chat.html?command=19&value=' + chatid + '?';
	command = 19;
	getUpdate(str);
}


function getStageViewContent(){
	//stopTimer();

	var str = 'chat.html?command=11&value=' + chatid + '?';
	command = 11;
	getUpdate(str);
}
	

/* function processStageResponse_hold(txt){			//Process correctly for the screen resoluton and add headers and footers

	var txtArr = txt.split("|");
	chatid = (txtArr[0]*1);

	console.log(txt);
	console.log(chatid);
	return(txt);
} */

function processStageResponse(txt){			//Process correctly for the screen resoluton and add headers and footers

	//console.log("tx  " + txt);
	var txtArr = txt.split("<br>");
	var len = txtArr.length - 1;		//There is a <br> at the end
	//console.log(len);
	
	var txtArrFirst = txtArr[0].split("|");
	chatid = (txtArrFirst[0]*1);
	
	var content ="";
	
	for(var i=0; i<len; i++){
		var t = txtArr[i].split("|");
		
		content = content + '<span class="nameMessage">' + t[1] + '</span>';
		content = content + '....';
		content = content + '<span class="normalMessage">' + t[2] + '</span>';
		content = content + '<BR>'
	}
	

	return(content);
}

function getUpdate(str){
	var div = document.getElementById('resultID');
	
	$.ajax({
		url:str, 
		async: true,
		success:function(result){
			//var r = result;
			var cmdArr = result.split("<command>");	//First value is the command
			var cmd = cmdArr[0]
			//console.log("cmd " + cmd);
			//console.log("size " + cmdArr.length);
			var r = cmdArr[1];
			
			if (cmd == "11"){
				//console.log("messages " + r);
				div.innerHTML = processStageResponse(r);
				div.scrollIntoView(false);
			}
			if (cmd == "12"){
				//div.innerHTML("Server got the message " + result);
			}
			if (cmd == "19"){
				//Getting keyword phrases
				//console.log(r);
				fixedWordsString = r;
				generateWordArr();
				generateLinks();
			}
		},
		error: function(){
			//alert('Error getting AJAX response');
		}
	});
}

function init(){
	generateWordArr();
	generateLinks();
	if (timeVar == null){
		startTimer();
	}
	
	//alert("here");
	var div = document.getElementById('resultID');
	//div.scrollTop = div.scrollHeight;
	div.scrollIntoView(false);
}



function startTimer(){
	console.log("Start Timer");
	timeVar = setInterval(function(){
					getStageViewContent();
					getKeywords();
				},msgTimer);
	
	document.getElementById('addMsgID').addEventListener("click",sendMessage,false);
	
}

function sendMessage(){
	var s = document.getElementById('msgS').value;

	if (s ==""){
		ons.notification.alert("Enter Name");
	} else {
		var m = document.getElementById('msgM').value;
		
		if (m != ""){
			$("#msgM").val("");		//Clear value after send
			//add2WordList(m);
			
			var txt = s + "|" + m;
			
			var str = 'chat.html?command=12&value=' + txt + '?';
			command = 12;
			getUpdate(str);
		}
	}
}


function stopTimer(){
	console.log("Stop Timer");
	clearInterval(timeVar);
}

function add2WordList(txt){
	var arr = txt.split(" ");
	var len = arr.length;
	
	for(var i=0; i< len; i++){
		var flag = isInList(arr[i]);
		if (!flag){
			fixedWords.push(arr[i]);
		}
	}
	
	generateLinks();
}

function isInList(w){
	var len = fixedWords.length;
	
	for(var i=0; i<len; i++){
		if(w == fixedWords[i]){
			return(true);
		}
	}
	return(false);
}

function generateWordArr(){
	fixedWords = fixedWordsString.split(",");
}
		
 function generateLinks(){
	var len = fixedWords.length;
	var content = ""
	
	for(var i=0; i<len; i++){
		content += '<a href="#" name="' + fixedWords[i] + '" onClick="getWord(this)">' + fixedWords[i] + ' | </a>';
		//content += '<a href="#" name="' + fixedWords[i] + '" onClick="alert()">' + fixedWords[i] + ' | </a>';
	}
	document.getElementById('fixedWordID').innerHTML = content;
	//alert(document.getElementById('fixedWordID').value);
 }
 
 function getWord(idval){
	//alert("Word: " + idval.name);
	var word = idval.name;
	var str = $("#msgM").val() + " " + word;
	$("#msgM").val(str);
	//alert($("#msgM").val());
}