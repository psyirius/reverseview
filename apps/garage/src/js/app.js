function $reload() {
    window.location.reload();

    // clientInformation
}

function $action() {
    $('.ui.basic.modal')
        .modal('show')
    ;
}

function updateBGSize() {
    const el = document.getElementById('__bg__');

    // el.style.height = window.innerHeight + 'px';
    // el.style.width = window.innerWidth + 'px';
}

document.addEventListener('DOMContentLoaded', function() {
    updateBGSize();
});

window.addEventListener('resize', function() {
    updateBGSize();
    // document.getElementById('__wsz__').textContent = window.innerWidth + 'x' + window.innerHeight;
});