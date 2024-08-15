/* ADJUST THESE VARIABLES FOR FASTER RESPONSE AND FONT SIZE */
var interval = 200; //Polling time is 1000ms
var minfont = 20; /* Adjust as needed */
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
    var str = "/action?cmd=9"; //Command to get the content of the presentation
    command = 9;
    ajax(str);

    // Command to get the content of the presentation
    apiCall({ cmd: 9 }, ({ ok, error, data }) => {
        if (!ok) {
            $(".greenScreenColor").css("background-image", "url(" + "../img/green.png" + ")"); //when no data, it will just blank
            $("#mainContainer").hide();
            stopTimer();
            return;
        }

        if (data.content1 == "") {
            //hide box
            //console.log("hidding green screen");
            $(".greenScreenColor").css("background-image", "url(" + "../img/green.png" + ")"); //when no data, it will just blank
            $("#mainContainer").hide();
            //$("body").removeClass("greenScreenColor");
        } else {
            $("#mainContainer").fadeIn();
            $("body").addClass("greenScreenColor");
            parseLower3rdResponse(data);
            processLower3rdResponse();
        }
        startTimer();
    });
}

/* PROCESS THE REPONSE AND ASSIGN THE RIGHT STRINGS */
function parseLower3rdResponse(t) {
    //Process correctly for the screen resoluton and add headers and footers
    $("#mainContainer").show();
    //var t = txt.split("<newelement>");		//Used to be |, June 23, 2020
    p_title = "";
    p_text1 = "";
    p_text2 = "";

    p_title = t.title;
    p_font1 = t.font1;
    p_font2 = t.font2;
    p_text1 = t.content1;
    p_text2 = t.content2;
}

function apiCall(params, callback = null) {
    const url = [
        "/action",
        new URLSearchParams({
            data: btoa(JSON.stringify(params)),
        }).toString(),
    ].join("?");

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (typeof callback === "function") {
                callback(data);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

/* START TIMER */
function startTimer() {
    //console.log("Start Timer");
    timeVar = setInterval(function () {
        getStageViewContent();
    }, interval);
}

/* STOP TIMER */
function stopTimer() {
    //console.log("Stop Timer");
    clearInterval(timeVar);
}
