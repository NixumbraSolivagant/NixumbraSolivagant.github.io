/* global pop */

// ── Pop-up image overlay ──────────────────────────────────────────────────
function toggleClass(selector, className) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        element.classList.toggle(className);
    });
}

function pop(imageURL) {
    var tcMainElement = document.querySelector(".tc-img");
    if (imageURL) {
        tcMainElement.src = imageURL;
    }
    toggleClass(".tc-main", "active");
    toggleClass(".tc", "active");
}

var tc = document.getElementsByClassName('tc');
var tc_main = document.getElementsByClassName('tc-main');
if (tc[0]) {
    tc[0].addEventListener('click', function () { pop(); });
}
if (tc_main[0]) {
    tc_main[0].addEventListener('click', function (event) {
        event.stopPropagation();
    });
}

// Expose globally so Vue can call it
window.pop = pop;

// ── Project item press effect ─────────────────────────────────────────────
function handlePress() { this.classList.add('pressed'); }
function handleRelease() { this.classList.remove('pressed'); }
function handleCancel() { this.classList.remove('pressed'); }

document.querySelectorAll('.projectItem').forEach(function (button) {
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', handleCancel);
    button.addEventListener('touchstart', handlePress, { passive: true });
    button.addEventListener('touchend', handleRelease);
    button.addEventListener('touchcancel', handleCancel);
});

console.log('%cCopyright © 2024 Nix',
    'background-color: #ff00ff; color: white; font-size: 24px; font-weight: bold; padding: 10px;'
);
console.log('%c   /\\_/\\', 'color: #8B4513; font-size: 20px;');
console.log('%c  ( o.o )', 'color: #8B4513; font-size: 20px;');
console.log(' %c  > ^ <', 'color: #8B4513; font-size: 20px;');
console.log('  %c  /  ~ \\', 'color: #8B4513; font-size: 20px;');
console.log('  %c/______\\', 'color: #8B4513; font-size: 20px;');
