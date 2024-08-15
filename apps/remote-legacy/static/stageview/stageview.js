/* ADJUST THESE VARIABLES FOR FASTER RESPONSE AND FONT SIZE */
var interval = 200; // Polling time is 1000ms
var minfont = 20; /* Adjust as needed */
var maxfont = 50;

var firstTime = true;

/* FORMATTING CODE STARTS HERE */
var command;

var timeVar;

var p_title;
var p_font1;
var p_font2;
var p_text1;
var p_text2;

var greenScreen = false;
var showdatetime = false;
var alertmessage = "";

/* USE TO IMPLEMENT A GO HOME BUTTON */
function goHome() {
    location.href = "index.html";
}

/* SETUP THE AJAX PARAMETERS */
function getStageViewContent() {
    if (firstTime) {
        firstTime = false;
    } else {
        stopTimer();

        // Command to get the content of the presentation
        apiCall({ cmd: 9 }, ({ ok, error, data }) => {
            if (!ok) {
                $("#mainContainer").hide();
                stopTimer();
                return;
            }

            if (greenScreen) {
                $("body").addClass("greenScreenColor");
                $("body").removeClass("blackScreenColor");
            } else {
                $("body").addClass("blackScreenColor");
                $("body").removeClass("greenScreenColor");
            }

            if (data.content1 == "") {
                $("#mainContainer").hide(); //hide box
            } else {
                $("#mainContainer").fadeIn();
                parseLower3rdResponse(data);
            }
            startTimer();
        });
    }
}

/* PROCESS THE REPONSE AND ASSIGN THE RIGHT STRINGS */
function parseLower3rdResponse(t) {
    // Process correctly for the screen resoluton and add headers and footers
    $("#mainContainer").show();

    p_title = "";
    p_text1 = "";
    p_text2 = "";

    p_title = t.title;
    p_font1 = t.font1;
    p_font2 = t.font2;
    p_text1 = t.content1;
    p_text2 = t.content2;

    if (p_text2.length > 2) {
        //showBothTranslations = true;
    } else {
        //showBothTranslations = false;
    }
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
    // Command to get the setting of stageview
    apiCall({ cmd: 10 }, ({ ok, error, data }) => {
        if (!ok) {
            console.error(error);
            $("#mainContainer").hide();
            startTimer();
            return;
        }

        greenScreen = data.StageGreenScreen;
        showdatetime = data.StageShowTime;
        alertmessage = data.StageAlertMessage;
    });

    timeVar = setInterval(function () {
        getStageViewContent();
    }, interval);
}

/* STOP TIMER */
function stopTimer() {
    clearInterval(timeVar);
}
