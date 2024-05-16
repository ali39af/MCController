const app = require('../../index.js');
const fs = require('fs');
const url = require('url');

let html_login = '';
let html_error_403 = '';

module.exports.load = function (callback) {
    fs.readFile(`./themes/${app.ysql.getData('app_theme')}/login.html`, 'utf8', function (err, data) {
        if (!err) {
            html_login = data;
            fs.readFile(`./themes/${app.ysql.getData('app_theme')}/403.html`, 'utf8', function (err, data) {
                if (!err) {
                    html_error_403 = data;
                    app.app.get('/login/', function (req, res) {
                        if (app.ysql.getData('app_connection_type') == 'private') {
                            if (req.ipInfo.ip != '::1') {
                                return;
                            }
                        }
                        const params = url.parse(req.url, true).query;
                        let errorcode = params.errorcode;
                        let errormsg = "";
                        if (errorcode == "101") {
                            errormsg = '<center><div class="alert alert-danger" role="alert">${languages:65}</div></center>';
                        }
                        if (errorcode == "102") {
                            errormsg = '<center><div class="alert alert-success" role="alert">${languages:66}</div></center>';
                        }
                        if (errorcode == "103") {
                            errormsg = '<center><div class="alert alert-success" role="alert">${languages:67}</div></center>';
                        }
                        if (errorcode == "104") {
                            errormsg = '<center><div class="alert alert-danger" role="alert">${languages:68}</div></center>';
                        }
                        if (errorcode == "105") {
                            errormsg = '<center><div class="alert alert-danger" role="alert">${languages:69}</div></center>';
                        }
                        if (errorcode == null) {
                            errormsg = "";
                        }
                        let new_html_login = html_login.replaceAll('${errormsg}', errormsg);
                        res.send(app.app_languages(new_html_login, app.ysql.getData('app_language')));
                    });
                    app.app.post('/login/', function (req, res) {
                        if (app.ysql.getData('app_connection_type') == 'private') {
                            if (req.ipInfo.ip != '::1') {
                                return;
                            }
                        }
                        if (fs.existsSync(`./data/users/${req.body.username}.json`)) {
                            fs.readFile(`./data/users/${req.body.username}.json`, 'utf8', function (err, data) {
                                if (!err) {
                                    datajson = JSON.parse(data);
                                    if (app.app_crypto.sha512_hash(req.body.password, datajson.salt).dataHash == datajson.password) {
                                        res.send(`<script>localStorage.setItem("token","${datajson.token}");window.location.replace("/server/");</script>`);
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
                                }
                            });
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
                    app.loger.log('Loading View Login Done!', 1, 1);
                    callback('true');
                } else {
                    app.loger.log('Loading View Login.403 Failed!', 3, 3);
                }
            });
        } else {
            app.loger.log('Loading View Login Failed!', 3, 3);
        }
    });
}