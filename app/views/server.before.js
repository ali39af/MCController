const app = require('../../index.js');
const fs = require('fs');

let html_error_403 = '';

module.exports.load = function (callback) {
    fs.readFile(`./themes/${app.ysql.getData('app_theme')}/403.html`, 'utf8', function (err, data) {
        if (!err) {
            html_error_403 = data;
            app.app.get('/server/', function (req, res) {
                if (app.ysql.getData('app_connection_type') == 'private') {
                    if (req.ipInfo.ip != '::1') {
                        return;
                    }
                }
                res.send('<script>const token = localStorage.getItem("token");document.write(`<form id="sendform" action="${document.location.href}" method="post"><input type="hidden" value="${token}" name="token"></form>`);document.getElementById("sendform").submit();</script>');
            });
            app.app.post('/server/', function (req, res) {
                if (app.ysql.getData('app_connection_type') == 'private') {
                    if (req.ipInfo.ip != '::1') {
                        return;
                    }
                }
                if (app.ysql.getData('app_blacklist_ip').split('\n').includes(req.ipInfo.ip) == true) {
                    res.status(403).send(app.app_languages(html_error_403, app.ysql.getData('app_language')));
                } else {
                    app.user_login(req.body.token, function (user) {
                        if (user.status != 'error') {
                            res.redirect('/server/server/');
                        } else {
                            if (req.ipInfo.ip != '::1') {
                                app.ysql.setData('app_blacklist_ip', app.ysql.getData('app_blacklist_ip') + '\n' + req.ipInfo.ip,1);
                                res.redirect('/login/?errorcode=101');
                                setTimeout(() => {
                                    app.ysql.setData('app_blacklist_ip', app.ysql.getData('app_blacklist_ip').replaceAll('\n' + req.ipInfo.ip, ''),1);
                                }, 5000);
                            } else {
                                res.redirect('/login/?errorcode=101');
                            }
                        }
                    });
                }
            });
            app.loger.log('Loading View Dashboard Done!', 1, 1);
            callback('true');
        } else {
            app.loger.log('Loading View Dashboard.403 Failed!', 3, 3);
        }
    });
}