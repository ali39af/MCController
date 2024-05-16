const fs = require('fs');

module.exports = function (html, language) {
    const lang = require('../languages/'+language+'.json');
    let lang_num = 0;
    lang.forEach(lang_data => {
        html = html.replaceAll('${languages:'+lang_num+'}',lang_data);
        lang_num++;
    });
    return html;
}