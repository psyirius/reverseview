var p_text1_arr = [];
var p_text2_arr = [];
var p_text1_font = "";
var p_text2_font = "";
var p_title = "";
var p_footnote = "";
var p_current_index = 0;
var p_last_index = 0;
var p_bkgnd_filename = "";
var p_bkgnd_motion = false;
var p_font_color = "";
var p_font_color2 = "";
var p_window_X = "800";
var p_window_Y = "600";
var p_ver1ScaleFactor = 1;
var p_ver2ScaleFactor = 1;
var p_bkgnd_color = "000000";
var p_text_orientation = "0";
var p_showDate = true;
var p_window_Y_org = 0;

var header_top = 0;
var header_left = 0;
var header_width = 0;
var header_height = 0;
var content1_top = 0;
var content1_left = 0;
var content1_width = 0;
var content1_height = 0;
var content2_top = 0;
var content2_left = 0;
var content2_width = 0;
var content2_height = 0;
var footer_top = 0;
var footer_left = 0;
var footer_width = 0;
var footer_height = 0;
var footerL_top = 0;
var footerL_left = 0;
var footerL_width = 0;
var footerL_height = 0;
var footerR_top = 0;
var footerR_left = 0;
var footerR_width = 0;
var footerR_height = 0;
var footer_message = "";
var messageFromMain = "";
var calculateFontSize = false;
var MIN_FONT_FOR_OUTLINE = 22;

var __debug = false;

function initStageView() {
    _debug_log('initStageView');
    passVariable(1);
    getDate();
    p_window_Y_org = p_window_Y;
    updatePresentation();
}
function updatePresentation() {
    var C = p_window_X / p_window_Y;
    var o = false;
    if (C > 2.5) {
        o = true;
    }
    var b = 10;
    var i = p_text_orientation.split("|");
    var p_text_orientation_local = i[0];
    var p = i[1];
    var h = i[4];
    var z = i[5];
    var k = i[6];
    var F = parseInt(i[2]) / 100;
    var E = i[8] == "true" ? true : false;
    var d = i[7] == "true" ? true : false;
    var A = i[9] == "true" ? true : false;
    var H = i[10] == "true" ? true : false;
    var G = i[11] == "true" ? true : false;
    var e = i[12] == "true" ? true : false;
    var u = i[13] == "true" ? true : false;
    var c = false;
    if (i[3] == "true") {
        c = true;
    }
    var q = false;
    if (i[14] == "true") {
        q = true;
    }
    if (p_text2_arr[0] == null || p_text2_arr[0].length < 2) {
        c = true;
        q = false;
    }
    if (o) {
        if (p_text_orientation_local == "2") {
            p_text_orientation_local = "1";
            p_text2_arr = p_text1_arr;
            p_text2_font = p_text1_font;
        } else {
            p_text_orientation_local = "1";
        }
    }
    $("#presentationTitle").css("opacity", 1);
    $("#content1Container").css("opacity", 1);
    $("#content2Container").css("opacity", 1);
    $("#backgroundLayer").show();
    $("#backgroundLayer3rd").hide();
    $("#backgroundLayer3rdBorder").hide();
    if (H) {
        $("#content1Container").removeClass("textCenter textLeft textRight");
        $("#content1Container").addClass("textLeft");
        $("#content2Container").removeClass("textCenter textLeft textRight");
        $("#content2Container").addClass("textLeft");
    } else {
        $("#content1Container").removeClass("textCenter textLeft textRight");
        $("#content1Container").addClass("textCenter");
        $("#content2Container").removeClass("textCenter textLeft textRight");
        $("#content2Container").addClass("textCenter");
    }
    switch (p_text_orientation_local) {
        case "0":
        default:
            var l = p_text1_arr[p_current_index].length;
            var j = p_text2_arr[p_current_index].length;
            var w = l + j;
            var g = (l / w) * 0.8;
            var f = (j / w) * 0.8;
            header_top = 0;
            header_left = 0;
            header_width = p_window_X;
            header_height = parseInt(p_window_Y * 0.1);
            content1_top = header_top + header_height + 1;
            content1_left = header_left;
            content1_width = p_window_X;
            content1_height = parseInt(p_window_Y * g);
            content2_top = content1_top + content1_height + 1;
            content2_left = header_left;
            content2_width = p_window_X;
            content2_height = parseInt(p_window_Y * f);
            footer_top = content2_top + content2_height + 1;
            footer_left = header_left;
            footer_width = p_window_X;
            footer_height = parseInt(p_window_Y * 0.1);
            if (c) {
                $("#content2Container").hide();
                content1_height = parseInt(p_window_Y * 0.8);
            } else {
                $("#content2Container").show();
            }
            $("#presentationTitle").show();
            $("#presentationTitle2").hide();
            $("#footer").show();
            $("#footerL").hide();
            $("#footerR").hide();
            break;
        case "1":
            header_top = 0;
            header_left = 0;
            header_width = p_window_X;
            header_height = parseInt(p_window_Y * 0.1);
            content1_top = header_top + header_height + 1;
            content1_left = header_left;
            content1_width = parseInt(p_window_X * 0.5);
            content1_height = parseInt(p_window_Y * 0.8);
            content2_top = header_top + header_height + 1;
            content2_left = header_left + content1_width + 1;
            content2_width = parseInt(p_window_X * 0.5);
            content2_height = parseInt(p_window_Y * 0.8);
            if (o) {
                footerL_top = content2_top + content2_height + 1;
                footerL_left = header_left;
                footerL_width = parseInt(p_window_X * 0.5);
                footerL_height = parseInt(p_window_Y * 0.1);
                footerR_top = content2_top + content2_height + 1;
                footerR_left = header_left + footerL_width + 1;
                footerR_width = parseInt(p_window_X * 0.5);
                footerR_height = parseInt(p_window_Y * 0.1);
                $("#footer").hide();
                $("#footerL").show();
                $("#footerR").show();
            } else {
                footer_top = content2_top + content2_height + 1;
                footer_left = header_left;
                footer_width = p_window_X;
                footer_height = parseInt(p_window_Y * 0.1);
                $("#footer").show();
                $("#footerL").hide();
                $("#footerR").hide();
            }
            if (c) {
                $("#content2Container").hide();
                $("#presentationTitle2").hide();
                content1_width = parseInt(p_window_X);
            } else {
                $("#content2Container").show();
            }
            $("#presentationTitle").show();
            $("#presentationTitle2").show();
            break;
        case "2":
            if (o) {
            } else {
                header_top = 0;
                header_left = 0;
                header_width = p_window_X;
                header_height = parseInt(p_window_Y * 0.05);
                content1_top = header_top + header_height + 1;
                content1_left = header_left;
                content1_width = p_window_X;
                content1_height = parseInt(p_window_Y * 0.85);
                content2_top = content1_top + content1_height + 1;
                content2_left = header_left;
                content2_width = p_window_X;
                content2_height = 0;
                footer_top = content2_top + content2_height + 1;
                footer_left = header_left;
                footer_width = p_window_X;
                footer_height = parseInt(p_window_Y * 0.1);
                $("#footer").show();
                $("#footerL").hide();
                $("#footerR").hide();
            }
            break;
        case "3":
            $("#footer").hide();
            $("#footerL").hide();
            $("#footerR").hide();
            $("#presentationTitle2").hide();
            $("#backgroundLayer3rd").show();
            $("#backgroundLayer3rdBorder").show();
            $("#backgroundLayer3rd").css("background-color", h);
            $("#backgroundLayer3rd").css("opacity", p);
            $("#backgroundLayer3rdBorder").css("z-index", 6);
            $("#backgroundLayer3rdBorder").css({
                "border-color": "#white",
                "border-width": "5px",
                "border-style": "solid",
            });
            var m = 1 - F;
            p_window_Y = p_window_Y_org - 40;
            header_top = parseInt(p_window_Y * m);
            header_left = 0;
            header_width = p_window_X;
            header_height = 0;
            content1_top = parseInt(p_window_Y * m);
            content1_left = 0;
            content1_width = parseInt(p_window_X * 0.5);
            content1_height = parseInt(p_window_Y * F);
            content2_top = parseInt(p_window_Y * m) + 5;
            content2_left = parseInt(p_window_X * 0.5);
            content2_width = parseInt(p_window_X * 0.5);
            content2_height = parseInt(p_window_Y * F);
            if (c) {
                $("#content2Container").hide();
                content1_width = parseInt(p_window_X);
            } else {
                if (q) {
                    content2_top = content1_top;
                    content2_left = content1_left;
                    content2_width = parseInt(p_window_X);
                    content2_height = content1_height;
                } else {
                    $("#content2Container").show();
                    if (u) {
                        var t = parseInt(p_window_Y * F);
                        var y = parseInt(t / 2);
                        var x = p_window_Y - t;
                        var v = p_window_Y - y;
                        content1_top = x;
                        content1_left = 0;
                        content1_width = p_window_X;
                        content1_height = y;
                        content2_top = v;
                        content2_left = 0;
                        content2_width = p_window_X;
                        content2_height = y;
                    } else {
                        if (G) {
                            $("#content1Container").removeClass(
                                "textCenter textLeft textRight"
                            );
                            $("#content1Container").addClass("textRight");
                            $("#content2Container").removeClass(
                                "textCenter textLeft textRight"
                            );
                            $("#content2Container").addClass("textLeft");
                        }
                    }
                }
            }
            break;
        case "4":
            header_top = 0;
            header_left = 0;
            header_width = p_window_X;
            header_height = parseInt(p_window_Y * 0.1);
            content1_top = header_top + header_height + 1;
            content1_left = header_left;
            content1_width = p_window_X;
            content1_height = parseInt(p_window_Y * 0.45);
            content2_top = content1_top + content1_height + 1;
            content2_left = header_left;
            content2_width = p_window_X;
            content2_height = parseInt(p_window_Y * 0.45);
            footer_top = 0;
            footer_left = 0;
            footer_width = p_window_X;
            footer_height = 0;
            $("#footer").hide();
            $("#footerL").hide();
            $("#footerR").hide();
            break;
    }
    $("#content1").show();
    $("#content2").show();
    if (A) {
        if (h == "26FF2A") {
            $("#backgroundLayer").css("background-color", "#26ff2a");
        } else {
            $("#backgroundLayer").css("background-color", "#00b140");
        }
    } else {
        $("#backgroundLayer").css("background-color", "black");
    }
    $("#content1").css("color", p_font_color);
    $("#content2").css("color", p_font_color);
    $("#presentationTitle").css("color", p_font_color);
    $("#presentationTitle2").css("color", p_font_color);
    $("#presentationTitle").css({
        top: header_top,
        left: header_left,
        position: "absolute",
    });
    $("#presentationTitle").css("font-family", p_text1_font);
    var s = formatReferenceWithFonts(p_title, p_text1_font, p_text2_font);
    $("#presentationTitle").html(s);
    $("#presentationTitle").css("padding-left", "50px");
    $("#presentationTitle2").css({
        top: header_top,
        left: content2_left,
        position: "absolute",
    });
    $("#presentationTitle2").css("font-family", "Arial, Helvetica, Sans-Serif");
    $("#presentationTitle2").css("font-size", "60px");
    $("#presentationTitle2").html(p_title);
    $("#presentationTitle2").css("padding-left", "50px");
    $("#content1Container").css({
        top: content1_top,
        left: content1_left,
        width: content1_width,
        height: content1_height,
        position: "absolute",
    });
    $("#content1").css("font-family", p_text1_font);
    $("#content1").css("color", p_font_color);
    $("#content1").css("font-size", "120px");
    $("#content1").css("padding-left", "50px");
    $("#content1").css("padding-right", "50px");
    $("#content1").html(p_text1_arr[p_current_index]);
    $("#content1Container").removeClass("contentTextShadow contentTextOutline");
    $("#content2Container").removeClass("contentTextShadow contentTextOutline");
    $("#presentationTitle").removeClass("contentTextShadow contentTextOutline");
    $("#presentationTitle2").removeClass("contentTextShadow contentTextOutline");
    if (d) {
        $("#content1Container").addClass("contentTextOutline");
        $("#content2Container").addClass("contentTextOutline");
        $("#presentationTitle").addClass("contentTextOutline");
        $("#presentationTitle2").addClass("contentTextOutline");
    }
    if (E) {
        $("#content1Container").addClass("contentTextShadow");
        $("#content2Container").addClass("contentTextShadow");
        $("#presentationTitle").addClass("contentTextShadow");
        $("#presentationTitle2").addClass("contentTextShadow");
    }
    var D = 120;
    var B = 120;
    var l = 0;
    var j = 0;
    var l = p_text1_arr[p_current_index].length;
    if (l > 1) {
        while (
            $("#content1Container").prop("scrollHeight") >
            $("#content1Container").prop("clientHeight") &&
            D > 10
            ) {
            $("#content1").css("font-size", D + "px");
            D = D - 3;
        }
    } else {
        D = 10;
        $("#content1").css("font-size", D + "px");
    }
    if (D > k) {
        D = k;
        $("#content1").css("font-size", D + "px");
    }
    $("#content2Container").css({
        top: content2_top,
        left: content2_left,
        width: content2_width,
        height: content2_height,
        position: "absolute",
    });
    $("#content2").css("font-family", p_text2_font);
    $("#content2").css("font-size", "120px");
    $("#content2").css("padding-left", "50px");
    $("#content2").css("padding-right", "50px");
    $("#content2").html(p_text2_arr[p_current_index]);
    if (!c) {
        if (p_text2_arr[p_current_index] != null) {
            var j = p_text2_arr[p_current_index].length;
            if (j > 1) {
                while (
                    $("#content2Container").prop("scrollHeight") >
                    $("#content2Container").prop("clientHeight") &&
                    B > 10
                    ) {
                    $("#content2").css("font-size", B + "px");
                    B = B - 3;
                }
            } else {
                B = 10;
                $("#content2").css("font-size", B + "px");
            }
            if (B > k) {
                B = k;
                $("#content2").css("font-size", B + "px");
            }
        } else {
            B = 0;
        }
    } else {
        B = 0;
    }
    var n = false;
    if (!c) {
        if (D < B) {
            if (D < MIN_FONT_FOR_OUTLINE) {
                n = true;
            }
        } else {
            if (B < MIN_FONT_FOR_OUTLINE) {
                n = true;
            }
        }
    } else {
        if (D < MIN_FONT_FOR_OUTLINE) {
            n = true;
        }
    }
    if (d) {
        if (n) {
            $("#content1Container").removeClass("contentTextOutline");
            $("#content2Container").removeClass("contentTextOutline");
            $("#presentationTitle").removeClass("contentTextOutline");
            $("#presentationTitle2").removeClass("contentTextOutline");
            $("#content1Container").addClass("contentTextOutlineSmall");
            $("#content2Container").addClass("contentTextOutlineSmall");
            $("#presentationTitle").addClass("contentTextOutlineSmall");
            $("#presentationTitle2").addClass("contentTextOutlineSmall");
        } else {
            $("#content1Container").removeClass("contentTextOutlineSmall");
            $("#content2Container").removeClass("contentTextOutlineSmall");
            $("#presentationTitle").removeClass("contentTextOutlineSmall");
            $("#presentationTitle2").removeClass("contentTextOutlineSmall");
            $("#content1Container").addClass("contentTextOutline");
            $("#content2Container").addClass("contentTextOutline");
            $("#presentationTitle").addClass("contentTextOutline");
            $("#presentationTitle2").addClass("contentTextOutline");
        }
    } else {
        $("#content1Container").removeClass("contentTextOutline");
        $("#content2Container").removeClass("contentTextOutline");
        $("#presentationTitle").removeClass("contentTextOutline");
        $("#presentationTitle2").removeClass("contentTextOutline");
        $("#content1Container").removeClass("contentTextOutlineSmall");
        $("#content2Container").removeClass("contentTextOutlineSmall");
        $("#presentationTitle").removeClass("contentTextOutlineSmall");
        $("#presentationTitle2").removeClass("contentTextOutlineSmall");
    }
    $("#presentationTitle").css("font-size", "40px");
    $("#presentationTitle2").css("font-size", "40px");
    var r = (parseInt(D) + parseInt(B)) / 2;
    if (p_text_orientation_local == "3") {
        if (!c) {
            if (q) {
                $("#presentationTitle").css("font-size", B);
            } else {
                if (r < 15) {
                    r = 15;
                }
                $("#presentationTitle").css("font-size", r);
            }
        } else {
            $("#presentationTitle").css("font-size", D);
        }
        header_top = header_top - $("#presentationTitle").height();
        $("#presentationTitle").css({
            top: header_top,
            left: header_left,
            position: "absolute",
        });
    }
    if (p_text_orientation_local == "0") {
        if (!c) {
            $("#presentationTitle").css("font-size", r * 0.8);
        } else {
            $("#presentationTitle").css("font-size", D * 0.8);
        }
    }
    if (p_text_orientation_local == "1") {
        $("#presentationTitle").css("font-size", D * 0.6);
        $("#presentationTitle2").css("font-size", D * 0.6);
    }
    if (p_text_orientation_local == "2") {
        $("#presentationTitle").css("font-size", D * 0.6);
        $("#presentationTitle2").hide();
    }
    var a = content1_height + content2_height + $("#presentationTitle").height();
    if ($("#presentationTitle").height() != 0) {
        $("#backgroundLayer3rd").css({
            top: header_top,
            left: header_left,
            width: header_width,
            height: a,
            position: "absolute",
        });
    } else {
        $("#backgroundLayer3rd").css({
            top: content1_top,
            left: content1_left,
            width: header_width,
            height: a,
            position: "absolute",
        });
    }
    if (p_text_orientation_local == "3" && q) {
        $("#content1").hide();
    } else {
        $("#content1").show();
    }
    $("#content2").show();
    if (o) {
        $("#footerL").css({
            top: footerL_top,
            left: footerL_left,
            width: footerL_width,
            height: footerL_height,
            position: "absolute",
        });
        $("#footerL").css("font-family", "Arial");
        $("#footerL").css("background-color", "grey");
        $("#footerL").css("padding-left", "50px");
        $("#footerR").css({
            top: footerR_top,
            left: footerR_left,
            width: footerR_width,
            height: footerR_height,
            position: "absolute",
        });
        $("#footerR").css("font-family", "Arial");
        $("#footerR").css("background-color", "grey");
        $("#footerR").css("padding-left", "50px");
    } else {
        $("#footer").css({
            top: footer_top,
            left: footer_left,
            width: footer_width,
            height: footer_height,
            position: "absolute",
        });
        $("#footer").css("font-family", "Arial");
        $("#footer").css("background-color", "grey");
        $("#footer").css("padding-left", "50px");
    }
}
function updateContent() {
    $("#content1").html(p_text1_arr[p_current_index]);
    $("#content2").html(p_text2_arr[p_current_index]);
}
function get_next_index() {
    var a = p_current_index * 1 + 1;
    if (p_current_index == p_last_index) {
        a = 0;
    }
    return a;
}
function get_prev_index() {
    var a = p_current_index * 1 - 1;
    if (p_current_index == 0) {
        a = p_last_index;
    }
    return a;
}
function nextSlide() {
    p_current_index = get_next_index();
    document.getElementById("content1").style.textShadow = null;
    document.getElementById("content2").style.textShadow = null;
    updatePresentation();
}
function prevSlide() {
    p_current_index = get_prev_index();
    document.getElementById("content1").style.textShadow = null;
    document.getElementById("content2").style.textShadow = null;
    updatePresentation();
}
function postMessage(a) {
    messageFromMain = a;
    calculateFontSize = true;
    writeFooter();
}
function showBlankProcess() {
    $("#footer").hide();
    $("#footerL").hide();
    $("#footerR").hide();
    $("#presentationTitle").hide();
    $("#presentationTitle2").hide();
    $("#backgroundLayer3rd").hide();
    $("#backgroundLayer3rdBorder").hide();
    $("#content1").hide();
    $("#content2").hide();
}
function clearPresenter() {
    window.close();
}
function onBodyKeyUp(a) {
    key = a.keyCode;
    switch (key) {
        case 27:
            clearPresenter();
            break;
    }
    window.onunload = function (b) {
        window.parent.iamclosingPresentation();
    };
}
function getDate() {
    var d = new Date();
    var c = d.getHours();
    var b = "";
    var a = " AM";
    if (c == 0) {
        b = 12;
    } else {
        if (c <= 11) {
            b = c;
        } else {
            if (c == 12) {
                b = 12;
                a = " PM";
            } else {
                b = c - 12;
                a = " PM";
            }
        }
    }
    var f = d.getMinutes();
    if (f < 10) {
        f = "0" + f;
    }
    var e = d.toDateString() + " &nbsp;&nbsp; " + b + ":" + f + a;
    writeFooter(e);
    var e = setTimeout(getDate, 5000);
}
function writeFooter(a) {
    if (a != null) {
        if (p_showDate && (messageFromMain == "" || messageFromMain == null)) {
            footer_message = a;
            $("#footer").css("font-size", "30px");
        } else {
            if (messageFromMain != "") {
                footer_message = messageFromMain;
            } else {
                footer_message = "";
            }
        }
    } else {
        if (messageFromMain != "") {
            footer_message = messageFromMain;
        } else {
            footer_message = "";
        }
    }
    $("#footer").css("font-size", "30px");
    $("#footer").html(footer_message);
    $("#footerL").html(footer_message);
    $("#footerR").html(footer_message);
    if (calculateFontSize) {
        var b = 50;
        while (
            $("#footer").prop("scrollHeight") > $("#footer").prop("clientHeight")
            ) {
            $("#footer").css("font-size", b + "px");
            air.trace(b);
            b = b - 5;
        }
        var b = 40;
        while (
            $("#footerL").prop("scrollHeight") > $("#footerL").prop("clientHeight")
            ) {
            $("#footerL").css("font-size", b + "px");
            b = b - 1;
        }
        $("#footerR").css("font-size", b + "px");
        calculateFontSize = false;
    }
}
function formatReferenceWithFonts(i, c, b) {
    var h = "";
    var a = i.split(")");
    if (a[1] != null) {
        var f = a[1];
        var g = a[0].split("(");
        var e = g[0];
        var d = g[1];
        h += '<span style="font-family:' + c + ';">' + e + "</span>";
        h += '<span style="font-family:' + b + ';"> (' + d + ") </span>";
        h += '<span style="font-family:' + c + ';">' + f + "</span>";
    } else {
        h += '<span style="font-family:' + c + ';">' + i + "</span>";
    }
    return h;
}
function _debug_log(msg) {
    if (__debug) {
        air.trace('StageView:....' + msg);
    }
}

// user from parent
// window.nextSlide = nextSlide;
// window.prevSlide = prevSlide;
// window.postMessage = postMessage;
// window.showBlankProcess = showBlankProcess;
// window.updatePresentation = updatePresentation;
// window.updateContent = updateContent;
//
// // dom callbacks
// window.initStageView = initStageView;
// window.onBodyKeyUp = onBodyKeyUp;