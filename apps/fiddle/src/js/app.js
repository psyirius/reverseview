function $load() {
    // alert('load');

    $('#html-editor').on('input', function(e) {
        /** @type {HTMLIFrameElement} */
        const sb = document.getElementById('sandbox')

        window.xxx = sb.contentWindow;

        sb.contentWindow.location.reload();
    });
}

function $onSandboxLoad() {
    // alert('$sandboxLoad');
}

function $reload() {
    window.location.reload();

    // clientInformation
}

function $action() {

}

document.addEventListener('DOMContentLoaded', function() {
    // alert('DOMContentLoaded');
});

window.addEventListener('resize', function() {
    // alert('resize');
});