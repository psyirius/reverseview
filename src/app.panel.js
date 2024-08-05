rvw.provide("rvw.ui").Panel = {
    setup() {
        $("#vvPanel_close").click(function () {
            $("#vvPanel_main").hide();
        });
        $("#vvPanel_main").css({
            top: "400px",
            left: "350px",
            width: "400px",
            height: "300px",
        });
        $("#vvPanel_main").hide();
    },
    show(header, message) {
        $("#vvPanel_header").html(header);
        $("#vvPanel_message").html(message);
        $("#vvPanel_main").show();
        if (header == "Suggestions") {
            setTimeout(function () {
                $("#vvPanel_main").hide();
            }, 6000);
        }
    },
    close() {
        $("#vvPanel_main").hide();
    },
    toggle() {
        $("#vvPanel_main").toggle();
    }
};