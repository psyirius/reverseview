function getDate() {
	//console.log("Updating date...");
	var today = new Date();
	var hours = today.getHours();
	var hourStr = "";
	var ampmStr = " AM";
	if (hours == 0) {
		hourStr = 12;
	} else {
		if (hours <= 11) {
			hourStr = hours;
		} else {
			if (hours == 12) {
				hourStr = 12;
				ampmStr = " PM";
			} else {
				hourStr = hours - 12;
				ampmStr = " PM";
			}
		}
	}
	var mins = today.getMinutes();
	if (mins < 10) {
		mins = "0" + mins;
	}

	//console.log("Date  " + today.toDateString() + " &nbsp;&nbsp; " + hourStr + ":" + mins + ampmStr);
	var t = today.toDateString() + " &nbsp;&nbsp; " + hourStr + ":" + mins + ampmStr;
	writeFooter(t);

	//var t = setTimeout(getDate, 5000);
}


function writeFooter(time){
    /*
	if (time != null){
		if (p_showDate && (messageFromMain == "" || messageFromMain == null)){		//No message so just show date
			//footer_message = today.toDateString() + " &nbsp;&nbsp; " + hourStr + ":" + mins + ampmStr;
			footer_message = time;
			$("#footer").css("font-size", "30px");
		} else {
			if (messageFromMain != ""){
				footer_message = messageFromMain;
			} else {
				footer_message = "";
			}
		}
	} else {
		if (messageFromMain != ""){
			footer_message = messageFromMain;
		} else {
			footer_message = "";
		}
	}
    */

    footer_message = time;

	$("#footer").css("font-size", "30px");
	
	$("#footer").html(footer_message);

/*
	if (calculateFontSize){
		var footerSize = 50;
		while ($('#footer').prop('scrollHeight') > $('#footer').prop('clientHeight')) {
			$("#footer").css("font-size", (footerSize + "px"));
			air.trace(footerSize);
			footerSize = footerSize - 5;
		}


		var footerSize = 40;
		while ($('#footerL').prop('scrollHeight') > $('#footerL').prop('clientHeight')) {
			$("#footerL").css("font-size", (footerSize + "px"));
			footerSize = footerSize - 1;
		}

		$("#footerR").css("font-size", (footerSize + "px"));

		calculateFontSize = false;		//Next calculation is only when text changes
	}
    */
}