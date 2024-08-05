rvw.provide("rvw.ui").Confirm = {
    setup() {
        $("#vvConfirm_main").hide();
        $("#vvConfirm_main").css({ height: "200px" });
        $("#vvConfirm_main").css({ width: "400px" });
    },
    exec(header, message, onYes = null, onNo = null) {
        $("#vvConfirm_yes").one("click", function () {
            (typeof onYes === 'function') && onYes();
            $("#vvConfirm_main").hide();
        });
        $("#vvConfirm_no").one("click", function () {
            (typeof onNo === 'function') && onNo();
            $("#vvConfirm_main").hide();
        });
        $("#vvConfirm_header").html(header);
        $("#vvConfirm_message").html(message);
        $("#vvConfirm_main").show();
    }
};