console.log('%cCopyright © 2024 Nix',
    'background-color: #ff00ff; color: white; font-size: 24px; font-weight: bold; padding: 10px;'
);
console.log('%c   /\\_/\\', 'color: #8B4513; font-size: 20px;');
console.log('%c  ( o.o )', 'color: #8B4513; font-size: 20px;');
console.log(' %c  > ^ <', 'color: #8B4513; font-size: 20px;');
console.log('  %c /  ~ \\', 'color: #8B4513; font-size: 20px;');
console.log('  %c/______\\', 'color: #8B4513; font-size: 20px;');

// 首页项目卡片的按下反馈
function handlePress() {
    this.classList.add('pressed');
}

function handleRelease() {
    this.classList.remove('pressed');
}

function handleCancel() {
    this.classList.remove('pressed');
}

var buttons = document.querySelectorAll('.projectItem');
buttons.forEach(function (button) {
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', handleCancel);
    button.addEventListener('touchstart', handlePress);
    button.addEventListener('touchend', handleRelease);
    button.addEventListener('touchcancel', handleCancel);
});

function toggleClass(selector, className) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        element.classList.toggle(className);
    });
}

// 赞助/QQ 二维码弹层
function pop(imageURL) {
    var tcMainElement = document.querySelector('.tc-img');
    if (imageURL) {
        tcMainElement.src = imageURL;
    }
    toggleClass('.tc-main', 'active');
    toggleClass('.tc', 'active');
}

var tc = document.getElementsByClassName('tc');
var tc_main = document.getElementsByClassName('tc-main');
tc[0].addEventListener('click', function () {
    pop();
});
tc_main[0].addEventListener('click', function (event) {
    event.stopPropagation();
});

function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

function getCookie(name) {
    var nameEQ = name + '=';
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// script.js 由首页挂载后动态注入，DOM 通常已就绪；
// 保留 DOMContentLoaded 分支仅用于脚本被提前加载的情况。
function initTheme() {
    var html = document.querySelector('html');
    var themeState = getCookie('themeState') || 'Light';
    var tanChiShe = document.getElementById('tanChiShe');

    function changeTheme(theme) {
        tanChiShe.src = '/static/svg/snake-' + theme + '.svg';
        html.dataset.theme = theme;
        setCookie('themeState', theme, 365);
        themeState = theme;
    }

    var Checkbox = document.getElementById('myonoffswitch');
    Checkbox.addEventListener('change', function () {
        changeTheme(themeState == 'Dark' ? 'Light' : 'Dark');
    });

    if (themeState == 'Dark') {
        Checkbox.checked = false;
    }

    changeTheme(themeState);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}
