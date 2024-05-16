$("#app_loader").show();
$("#app_body").hide();
$(window).on('load', function () {
    $("#app_loader").hide();
    $("#app_body").show();
});
document.addEventListener("DOMContentLoaded", function (event) {
    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId)
        if (toggle && nav && bodypd && headerpd) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('show_nav');
                toggle.classList.toggle('bx-x');
                bodypd.classList.toggle('body-pd');
                headerpd.classList.toggle('body-pd');
            });
        }
    }
    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');
    const linkColor = document.querySelectorAll('.nav_link');
    function colorLink() {
        if (linkColor) {
            linkColor.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        }
    }
    linkColor.forEach(l => l.addEventListener('click', colorLink));
});
function enable_codeeditor() {
    const codeEditor = document.getElementById('codeEditor');
    const lineCounter = document.getElementById('lineCounter');
    codeEditor.addEventListener('scroll', () => {
        lineCounter.scrollTop = codeEditor.scrollTop;
        lineCounter.scrollLeft = codeEditor.scrollLeft;
    });
    codeEditor.addEventListener('keydown', (e) => {
        let { keyCode } = e;
        let { value, selectionStart, selectionEnd } = codeEditor;
        if (keyCode === 9) {
            e.preventDefault();
            codeEditor.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
            codeEditor.setSelectionRange(selectionStart + 2, selectionStart + 2)
        }
    });
    var lineCountCache = 0;
    line_counter();
    function line_counter() {
        var lineCount = codeEditor.value.split('\n').length;
        var outarr = new Array();
        if (lineCountCache != lineCount) {
            for (var x = 0; x < lineCount; x++) {
                outarr[x] = (x + 1) + ' ';
            }
            lineCounter.value = outarr.join('\n');
        }
        lineCountCache = lineCount;
    }
    codeEditor.addEventListener('input', () => {
        line_counter();
    });
}