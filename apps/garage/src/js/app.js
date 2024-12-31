function $reload() {
    window.location.reload();

    // clientInformation
}

function getAnimationList(){
// Return a list of all of the animation keyframes in all style sheets.
    var ss = document.styleSheets;
    var anims = [];
    // loop through all the style sheets
    for (var s = 0; s < ss.length; s++) {
        if (ss[s].cssRules) {
            // loop through all the rules
            for (var r = ss[s].cssRules.length - 1; r >= 0; r--) {
                var rule = ss[s].cssRules[r];
                if ((rule.type === window.CSSRule.KEYFRAMES_RULE || rule.type === window.CSSRule.WEBKIT_KEYFRAMES_RULE)) {
                    anims.push(rule);
                }
            }
        }
    }
    return anims;
};

function $action() {
    const el = document.getElementById('app');

    // Invalidating the cache
    const s = window.getComputedStyle(el);

    document.getElementById('fxp').innerText = s.cssText;
    document.getElementById('fxp').innerText = getAnimationList().map(function(a) { return a.name; }).join(', ');
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