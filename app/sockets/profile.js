const app = require('../../index.js');
const fs = require('fs');

let dict_s = 'ZXCVBNM.LKJHGFDSAQWERTYUIOP@#$%^12345678#90z%.xcvbnmlkjhgfdsaqwertyuiop';

module.exports.io = function (socket) {
    socket.on('profile_form', (token, profile_form_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('profile') == true) {
                    profile_form_callback({ status: 'successful', message: 'Profile Form Load Done!' });
                    let change_password_btn = '';
                    if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('profile_change_password') == true) {
                        change_password_btn = app.app_languages('<button type="button" class="btn btn-primary" onclick="change_password_form();">${languages:97}</button>', app.ysql.getData('app_language'));
                    }
                    socket.emit('modal', {
                        type: 'create',
                        title: app.app_languages('${languages:95}', app.ysql.getData('app_language')),
                        body: `<center class="mb-3">
                            <img src="/static/images/logo.png" alt="" height="120px" width="120px">
                            <h4 style="margin-top: 15px;">Username: ${user.username}</h4>
                            <span class="badge bg-secondary">Permissions: ${user.level_permission.slice(0, 45)}</span><br />
                          </center><div class="d-grid gap-2">
                          ${change_password_btn}
                          </div>`,
                        footer: app.app_languages('<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${languages:96}</button>', app.ysql.getData('app_language'))
                    });
                } else {
                    profile_form_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                profile_form_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('change_password_form', (token, change_password_form_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('profile_change_password') == true) {
                    change_password_form_callback({ status: 'successful', message: 'Profile Form Load Done!' });
                    socket.emit('modal', {
                        type: 'create',
                        title: app.app_languages('${languages:95} - ${languages:97}', app.ysql.getData('app_language')),
                        body: app.app_languages(`<div style="color:Black;" class="form-floating mb-3">
                          <input type="password" class="form-control" id="chlastpassword" name="chlastpassword"
                            placeholder="`+ '${languages:98}' + `">
                          <label for="chlastpassword">`+ '${languages:98}' + `</label>
                        </div>
                        <div style="color:Black;" class="form-floating mb-3">
                          <input type="password" class="form-control" id="chnewpassword" name="chnewpassword"
                            placeholder="`+ '${languages:99}' + `">
                          <label for="chnewpassword">`+ '${languages:99}' + `</label>
                        </div>`, app.ysql.getData('app_language')),
                        footer: app.app_languages(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">` + '${languages:100}' + `</button>
                        <button type="button" class="btn btn-primary" onclick="change_password();">`+ '${languages:101}' + `</button>`, app.ysql.getData('app_language'))
                    });
                } else {
                    change_password_form_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                change_password_form_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('change_password', (token, last_password, new_password, change_password_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('profile_change_password') == true) {
                    if (app.app_crypto.sha512_hash(last_password, user.salt).dataHash == user.password) {
                        if (new_password) {
                            let new_user_token = '';
                            for (var i = 0; i < 128; i++) {
                                new_user_token += dict_s.charAt(Math.floor(Math.random() * dict_s.length));
                            }
                            let new_user_salt = '';
                            for (var i = 0; i < 8; i++) {
                                new_user_salt += dict_s.charAt(Math.floor(Math.random() * dict_s.length));
                            }
                            fs.writeFile(`./data/users/${datajson.username}.json`, `{
    "username": "${user.username}",
    "password": "${app.app_crypto.sha512_hash(new_password, new_user_salt).dataHash}",
    "salt": "${new_user_salt}",
    "token": "${new_user_token}",
    "level_permission": "${user.level_permission}"
}`, 'utf-8', function (err) {
                                if (!err) {
                                    change_password_callback({ status: 'successful', message: 'Password Changed Successfully! Redirecting To Login' });
                                    socket.emit('alert', app.app_languages('${languages:89}', app.ysql.getData('app_language')));
                                    socket.emit('go_location', '/login/');
                                } else {
                                    change_password_callback({ status: 'error', message: 'Unknown Error' });
                                    socket.emit('alert', app.app_languages('${languages:90}', app.ysql.getData('app_language')));
                                }
                            });
                        } else {
                            change_password_callback({ status: 'error', message: 'The new password is not correct!' });
                        }
                    } else {
                        change_password_callback({ status: 'error', message: 'The last password is not correct!' });
                        socket.emit('alert', app.app_languages('${languages:91}', app.ysql.getData('app_language')));
                    }
                } else {
                    change_password_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                change_password_callback({ status: 'error', message: 'User Login Failed!' });
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

}