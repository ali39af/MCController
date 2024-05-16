const app = require('../../index.js');
const fs = require('fs');

let html_options = '';
let html_server_components = '';
let html_error_403 = '';

module.exports.load = function (callback) {
    fs.readFile(`./themes/${app.ysql.getData('app_theme')}/server_options.html`, 'utf8', function (err, data) {
        if (!err) {
            html_options = data;
            fs.readFile(`./themes/${app.ysql.getData('app_theme')}/server_components.html`, 'utf8', function (err, data) {
                if (!err) {
                    html_server_components = data;
                    fs.readFile(`./themes/${app.ysql.getData('app_theme')}/403.html`, 'utf8', function (err, data) {
                        if (!err) {
                            html_error_403 = data;
                            app.app.get('/server/options/', function (req, res) {
                                if (app.ysql.getData('app_connection_type') == 'private') {
                                    if (req.ipInfo.ip != '::1') {
                                        return;
                                    }
                                }
                                res.send('<script>const token = localStorage.getItem("token");document.write(`<form id="sendform" action="${document.location.href}" method="post"><input type="hidden" value="${token}" name="token"></form>`);document.getElementById("sendform").submit();</script>');
                            });
                            app.app.post('/server/options/', function (req, res) {
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
                                            if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('options') == true) {
                                                app.nav_side_list.list(user.level_permission.split(','), 'options', function (nav_side_list) {
                                                    let new_html_options = html_options.replaceAll('${server_components}', html_server_components);
                                                    new_html_options = new_html_options.replaceAll('${nav_side_list}', nav_side_list)
                                                    new_html_options = new_html_options.replaceAll('${server_public_address}', app.ysql.getData('server_public_address'));
                                                    new_html_options = new_html_options.replaceAll('${server_port}', app.ysql.getData('server_port'));
                                                    new_html_options = new_html_options.replaceAll('${server_motd}', app.ysql.getData('server_motd'));
                                                    new_html_options = new_html_options.replaceAll('${server_spawn_protection}', app.ysql.getData('server_spawn_protection'));
                                                    new_html_options = new_html_options.replaceAll('${server_slots}', app.ysql.getData('server_slots'));
                                                    new_html_options = new_html_options.replaceAll('${server_resource_pack}', app.ysql.getData('server_resource_pack_url'));
                                                    new_html_options = new_html_options.replaceAll('"${server_commandblocks}"', app.ysql.getData('server_commandblocks'));
                                                    new_html_options = new_html_options.replaceAll('"${server_whitelist}"', app.ysql.getData('server_whitelist'));
                                                    new_html_options = new_html_options.replaceAll('"${server_cracked}"', app.ysql.getData('server_cracked'));
                                                    new_html_options = new_html_options.replaceAll('"${server_pvp}"', app.ysql.getData('server_pvp'));
                                                    new_html_options = new_html_options.replaceAll('"${server_fly}"', app.ysql.getData('server_fly'));
                                                    new_html_options = new_html_options.replaceAll('"${server_animals}"', app.ysql.getData('server_animals'));
                                                    new_html_options = new_html_options.replaceAll('"${server_monster}"', app.ysql.getData('server_monster'));
                                                    new_html_options = new_html_options.replaceAll('"${server_villagers}"', app.ysql.getData('server_villagers'));
                                                    new_html_options = new_html_options.replaceAll('"${server_nether}"', app.ysql.getData('server_nether'));
                                                    new_html_options = new_html_options.replaceAll('"${server_force_gamemode}"', app.ysql.getData('server_force_gamemode'));
                                                    new_html_options = new_html_options.replaceAll('"${server_gamemode}"', app.ysql.getData('server_gamemode'));
                                                    new_html_options = new_html_options.replaceAll('"${server_difficulty}"', app.ysql.getData('server_difficulty'));
                                                    res.send(app.app_languages(new_html_options, app.ysql.getData('app_language')));
                                                });
                                            } else {
                                                res.redirect('/server/console/');
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
                            app.loger.log('Loading View Options Done!', 1, 1);
                            callback('true');
                        } else {
                            app.loger.log('Loading View Options.403 Failed!', 3, 3);
                        }
                    });
                } else {
                    app.loger.log('Loading View Options Components Failed!', 3, 3);
                }
            });
        } else {
            app.loger.log('Loading View Options Failed!', 3, 3);
        }
    });
}