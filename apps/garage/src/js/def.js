// window.addEventListener('DOMContentLoaded', function() {
//     alert('DOMContentLoaded');
// });
//
// alert('XOXO');
//
// alert(window.navigator.userAgent);

// var dragging = false;
// var startDragOffset = null;
//
// var appel = document.getElementById('app');
// appel.addEventListener('mousedown', function (e) {
//     dragging = true;
//     startDragOffset = new air.Point(e.stageX - nativeWindow.x, e.stageY - nativeWindow.y);
// });
// window.stage.addEventListener('mousemove', function (e) {
//     if (dragging) {
//         window.nativeWindow.x = e.stageX - startDragOffset.x;
//         window.nativeWindow.y = e.stageY - startDragOffset.y;
//     }
// });
// appel.addEventListener('mouseup', function (e) {
//     dragging = false;
//     startDragOffset = null;
//     window.removeEventListener('mousemove');
// });