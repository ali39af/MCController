const app = require('../../index.js');
const fs = require('fs');

let html_console = '';
let html_server_components = '';
let html_error_403 = '';

module.exports.load = function (callback) {
    fs.readFile(`./themes/${app.ysql.getData('app_theme')}/server_console.html`, 'utf8', function (err, data) {
        if (!err) {
            html_console = data;
            fs.readFile(`./themes/${app.ysql.getData('app_theme')}/server_components.html`, 'utf8', function (err, data) {
                if (!err) {
                    html_server_components = data;
                    fs.readFile(`./themes/${app.ysql.getData('app_theme')}/403.html`, 'utf8', function (err, data) {
                        if (!err) {
                            html_error_403 = data;
                            app.app.get('/server/console/', function (req, res) {
                                if (app.ysql.getData('app_connection_type') == 'private') {
                                    if (req.ipInfo.ip != '::1') {
                                        return;
                                    }
                                }
                                res.send('<script>const token = localStorage.getItem("token");document.write(`<form id="sendform" action="${document.location.href}" method="post"><input type="hidden" value="${token}" name="token"></form>`);document.getElementById("sendform").submit();</script>');
                            });
                            app.app.post('/server/console/', function (req, res) {
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
                                            if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('console') == true) {
                                                app.nav_side_list.list(user.level_permission.split(','), 'console', function (nav_side_list) {
                                                    let new_html_console = html_console.replaceAll('${server_components}', html_server_components);
                                                    new_html_console = new_html_console.replace('${nav_side_list}', nav_side_list);
                                                    res.send(app.app_languages(new_html_console, app.ysql.getData('app_language')));
                                                });
                                            } else {
                                                res.redirect('/server/logs/');
                                            }
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
                            app.loger.log('Loading View Console Done!', 1, 1);
                            callback('true');
                        } else {
                            app.loger.log('Loading View Console.403 Failed!', 3, 3);
                        }
                    });
                } else {
                    app.loger.log('Loading View Console Components Failed!', 3, 3);
                }
            });
        } else {
            app.loger.log('Loading View Console Failed!', 3, 3);
        }
    });
}