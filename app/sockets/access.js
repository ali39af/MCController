const app = require('../../index.js');
const fs = require('fs');

let dict_s = 'ZXCVBNM.LKJHGFDSAQWERTYUIOP@#$%^12345678#90z%.xcvbnmlkjhgfdsaqwertyuiop';

module.exports.io = function (socket) {
    socket.on('access_list', (token, access_list_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true) {
                    fs.readdir('./data/users', (err, files) => {
                        if (!err) {
                            let user_list = '';
                            files.forEach(file => {
                                const user_data = require('../../data/users/' + file);
                                user_list += `<tr><td>${user_data.username}</td><td>${user_data.level_permission.slice(0, 45)}</td></tr>`
                            });
                            access_list_callback({ status: 'successful', message: 'Access List Done!', user_list: user_list });
                        } else {
                            access_list_callback({ status: 'error', message: 'FS Error!' });
                        }
                    });
                } else {
                    access_list_callback({ status: 'error', message: 'Permission Require!' });
                }
            } else {
                access_list_callback({ status: 'error', message: 'User Login Failed!' });
                if (socket.handshake.address != '::1') {
                    app.ysql.setData('app_blacklist_ip', app.ysql.getData('app_blacklist_ip') + '\n' + socket.handshake.address, 1);
                    setTimeout(() => {
                        app.ysql.setData('app_blacklist_ip', app.ysql.getData('app_blacklist_ip').replaceAll('\n' + socket.handshake.address, ''), 1);
                    }, 5000);
                }
                socket.emit('go_location', '/login/?errorcode=104');
            }
        });
    });

    socket.on('access_add', (token, username, password, permissions, access_add_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true) {
                    if (username != undefined && password != undefined && permissions != undefined && username != '' && password != '' && permissions != '') {
                        if (!fs.existsSync(`./data/users/${username}.json`)) {
                            let new_user_token = '';
                            for (var i = 0; i < 128; i++) {
                                new_user_token += dict_s.charAt(Math.floor(Math.random() * dict_s.length));
                            }
                            let new_user_salt = '';
                            for (var i = 0; i < 8; i++) {
                                new_user_salt += dict_s.charAt(Math.floor(Math.random() * dict_s.length));
                            }
                            fs.writeFile(`./data/users/${username}.json`, `{
    "username": "${app.app_db_filter(username)}",
    "password": "${app.app_crypto.sha512_hash(password, new_user_salt).dataHash}",
    "salt": "${new_user_salt}",
    "token": "${new_user_token}",
    "level_permission": "${app.app_db_filter(permissions)}"
}`, 'utf-8', function (err) {
                                if (!err) {
                                    access_add_callback({ status: 'successful', message: 'Access Add Done!' });
                                    socket.emit('alert', app.app_languages('${languages:70}', app.ysql.getData('app_language')));
                                } else {
                                    access_add_callback({ status: 'error', message: 'FS Error!' });
                                }
                            });
                        } else {
                            access_add_callback({ status: 'error', message: 'There is a person with this username!' });
                            socket.emit('alert', app.app_languages('${languages:71}', app.ysql.getData('app_language')));
                        }
                    } else {
                        access_add_callback({ status: 'error', message: 'Username, Password ,Permissions Require!' });
                        socket.emit('alert', app.app_languages('${languages:72}', app.ysql.getData('app_language')));
                    }
                } else {
                    access_add_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                access_add_callback({ status: 'error', message: 'User Login Failed!' });
                if (socket.handshake.address != '::1') {
                    app.ysql.setData('app_blacklist_ip', app.ysql.getData('app_blacklist_ip') + '\n' + socket.handshake.address, 1);
                    setTimeout(() => {
                        app.ysql.setData('app_blacklist_ip', app.ysql.getData('app_blacklist_ip').replaceAll('\n' + socket.handshake.address, ''), 1);
                    }, 5000);
                }
                socket.emit('go_location', '/login/?errorcode=104');
            }
        });
    });

    socket.on('access_remove', (token, username, access_add_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true) {
                    if (username != undefined && username != '') {
                        if (fs.existsSync(`./data/users/${username}.json`)) {
                            if (username != user.username) {
                                fs.unlink(`./data/users/${username}.json`, function (err) {
                                    if (!err) {
                                        access_add_callback({ status: 'successful', message: 'Access Remove Done!' });
                                        socket.emit('alert', app.app_languages('${languages:74}', app.ysql.getData('app_language')));
                                    } else {
                                        access_add_callback({ status: 'error', message: 'FS Error!' });
                                    }
                                });
                            } else {
                                access_add_callback({ status: 'error', message: 'You are not allow to remove yourself!' });
                                socket.emit('alert', app.app_languages('${languages:75}', app.ysql.getData('app_language')));
                            }
                        } else {
                            access_add_callback({ status: 'error', message: 'User with this username was not found!' });
                            socket.emit('alert', app.app_languages('${languages:76}', app.ysql.getData('app_language')));
                        }
                    } else {
                        access_add_callback({ status: 'error', message: 'Username, Password ,Permissions Require!' });
                        socket.emit('alert', app.app_languages('${languages:77}', app.ysql.getData('app_language')));
                    }
                } else {
                    access_add_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                access_add_callback({ status: 'error', message: 'User Login Failed!' });
                if (socket.handshake.address != '::1') {
                    app.ysql.setData('app_blacklist_ip', app.ysql.getData('app_blacklist_ip') + '\n' + socket.handshake.address, 1);
                    setTimeout(() => {
                        app.ysql.setData('app_blacklist_ip', app.ysql.getData('app_blacklist_ip').replaceAll('\n' + socket.handshake.address, ''), 1);
                    }, 5000);
                }
                app.ysql.setData('app_blacklist_ip', app.ysql.getData('app_blacklist_ip'), 1)
                socket.emit('go_location', '/login/?errorcode=104');
            }
        });
    });
}