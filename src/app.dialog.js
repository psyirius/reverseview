rvw.provide("rvw.ui").Dialog = {
    setup: function () {
        $("#vvdialog_close").click(function () {
            $("#somemessage").hide();
        });
        $("#somemessage").css({ marginTop: "-=60px" });
        $("#somemessage").hide();
    },
    show: function (header, message) {
        $("#vvdialog_header").html(header);
        $("#vvdialog_message").html(message);
        $("#somemessage").show();
        setTimeout(function () {
            $("#somemessage").hide();
        }, 8000);
    },
    hold: function (header, message) {
        $("#dialogHeader").html(header);
        $("#dialogMsg").html(message);
        $("#message").modal("show");
    },
};