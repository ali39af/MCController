const express = require('express');
const expressip = require('express-ip');
const bodyparser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { port } = require('./config.json');

const loger = require('./app/app_loger.js');
module.exports.loger = (loger);
const ysql = require('./app/app_ysql.js');
module.exports.ysql = (ysql);
ysql.setDataLocation('./data/ysql', function (callback) {
    if (callback == true) {
        module.exports.app = (app);
        module.exports.io = (io);
        module.exports.listen = (listen);

        let dict_s = 'ZXCVBNMLKJHGFDSAQWERTYUIOP1234567890zxcvbnmlkjhgfdsaqwertyuiop'; let download_token = ''; for (var i = 0; i < 128; i++) { download_token += dict_s.charAt(Math.floor(Math.random() * dict_s.length)); }
        module.exports.logs_download_token = download_token;
        module.exports.main_dir = __dirname;
        const user_login = require('./app/app_user_login.js');
        module.exports.user_login = (user_login);
        const app_languages = require('./app/app_languages.js');
        module.exports.app_languages = (app_languages);
        const app_db_filter = require('./app/app_db_filter.js');
        module.exports.app_db_filter = (app_db_filter);
        const app_crypto = require('./app/app_crypto.js');
        module.exports.app_crypto = (app_crypto);
        const addons = require('./app/app_addons.js');
        module.exports.addons = (addons);
        const download = require('./app/app_download.js');
        module.exports.download = (download);
        const ini = require('./app/app_ini.js');
        module.exports.ini = (ini);
        const nav_side_list = require('./app/app_nav_side.js');
        module.exports.nav_side_list = (nav_side_list);
        const server_debug = require('./app/server_debug.js');
        module.exports.server_debug = (server_debug);
        const app_debug = require('./app/app_debug.js');
        module.exports.app_debug = (app_debug);
        const yservices = require('./app/app_yservices.js');
        module.exports.yservices = (yservices);
        const server_mc = require('./app/server_main.js');
        module.exports.server_mc = (server_mc);

        app.use(bodyparser.urlencoded({ extended: true }));
        app.use(expressip().getIpInfoMiddleware);
        app.use('/static', express.static('static'));
        app.use('/static/server-icon.png', express.static('./server/server-icon.png'));
        app.use('/server/logs/download/' + download_token, express.static('./server/logs/'));

        loger.log('McController Is Starting...', 1, 2);

        module.exports.load_app = function (run_type) {
            addons.load(function (callback) {
                if (callback == 'true') {
                    if (run_type == 'again') {
                        app.get('/', function (req, res) {
                            res.redirect('/login/');
                        });
                    }
                    require('./app/app_io.js').start_io(function (callback) {
                        if (callback == 'true') {
                            require('./app/app_views.js').load_views(function (callback) {
                                if (callback == 'true') {
                                    if (run_type == 'again') {
                                        listen();
                                    }
                                    server_debug.check_jdk_files(function (callback) {
                                        if (callback == 'true') {
                                            server_debug.check_software_files(function (callback) {
                                                if (callback == 'true') {
                                                    server_debug.check_files('all', function (callback) {
                                                        if (callback == 'true') {
                                                            loger.log('McController ' + ysql.getData('app_version') + ' Ready For Use', 1, 1);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }

        app_debug.check_files(function (callback) {
            if (callback == 'true') {
                yservices.check_data(function (callback) {
                    if (callback == 'true') {
                        require('./app/app_setup.js');
                    }
                });
            }
        });

        function listen() {
            server.listen(port, () => {
                loger.log('--------------------------------------------', 1, 2);
                loger.log('McControler Yellow Team ©', 1, 1);
                loger.log('Server listening!', 1, 1);
                loger.log(`Web Server Address http://localhost:${port}/`, 1, 1);
                loger.log('--------------------------------------------', 1, 2);
            });
        }
    }
});