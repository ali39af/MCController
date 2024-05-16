const app = require('../../index.js');
const fs = require('fs');

function logs_list_files(user, callback) {
    fs.readdir('./server/logs', 'utf8', function (err, files) {
        if (!err) {
            let files_num = 0;
            let receive_files = '';
            let receive_files_log = '';
            let receive_files_gz = '';
            if (files != '' && files != undefined) {
                files.forEach(file => {
                    files_num++;
                    if (file.split('.')[file.split('.').length - 1] == 'log') {
                        receive_files_log += `<tr> <th scope="row"><img src="/static/images/file_type/${file.split('.')[file.split('.').length - 1]}-icon.png" width="32px" height="32px" /></th> <td>${file}</td> <td>`;
                        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_select') == true || user.level_permission.split(',').includes('logs_download') == true || user.level_permission.split(',').includes('logs_delete') == true) {
                            receive_files_log += '<div class="dropdown"><button type="button" class="btn btn-primary btn-sm" data-bs-toggle="dropdown" aria-expanded="false"><i class="bx bx-dots-horizontal-rounded"></i></button><ul class="dropdown-menu">';
                        }
                        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_download') == true) {
                            receive_files_log += `<li><button onclick="logs_download('${file}')" type="button" class="dropdown-item">Download</button></li>`;
                        }
                        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_select') == true) {
                            receive_files_log += `<li><button onclick="logs_select('${file}')" type="button" class="dropdown-item">Select</button></li>`;
                        }
                        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_delete') == true) {
                            receive_files_log += `<li><button onclick="logs_delete('${file}');" type="button" class="dropdown-item">Delete</button></li>`;
                        }
                        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_select') == true || user.level_permission.split(',').includes('logs_download') == true || user.level_permission.split(',').includes('logs_delete') == true) {
                            receive_files_log += '</ul></div>';
                        }
                        receive_files_log += '</td> </tr>';
                    }
                    if (file.split('.')[file.split('.').length - 1] == 'gz') {
                        receive_files_gz += `<tr> <th scope="row"><img src="/static/images/file_type/${file.split('.')[file.split('.').length - 1]}-icon.png" width="32px" height="32px" /></th> <td>${file}</td> <td>`;
                        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_download') == true || user.level_permission.split(',').includes('logs_delete') == true) {
                            receive_files_gz += '<div class="dropdown"><button type="button" class="btn btn-primary btn-sm" data-bs-toggle="dropdown" aria-expanded="false"><i class="bx bx-dots-horizontal-rounded"></i></button><ul class="dropdown-menu">';
                        }
                        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_download') == true) {
                            receive_files_gz += `<li><a href="/server/logs/download/${app.logs_download_token}/${file}" type="button" class="dropdown-item">Download</a></li>`;
                        }
                        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_delete') == true) {
                            receive_files_gz += `<li><button onclick="logs_delete('${file}');" type="button" class="dropdown-item">Delete</button></li>`;
                        }
                        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_download') == true || user.level_permission.split(',').includes('logs_delete') == true) {
                            receive_files_gz += '</ul></div>';
                        }
                        receive_files_gz += '</td> </tr>';
                    }
                    receive_files = receive_files_log + receive_files_gz;
                    if (files.length == files_num) {
                        callback(receive_files);
                    }
                });
            } else {
                callback('');
            }
        } else {
            callback('');
        }
    });
}

module.exports.io = function (socket) {
    socket.on('logs_list_files', (token, logs_list_files_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_list_files') == true) {
                    logs_list_files(user, function (logs_list_files) {
                        logs_list_files_callback({ status: 'successful', message: 'Logs List Files Load Done!', list: logs_list_files });
                    });
                } else {
                    logs_list_files_callback({ status: 'error', message: 'Permission Require!' });
                }
            } else {
                logs_list_files_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('logs_delete', (token, file, logs_delete_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_delete') == true) {
                    if (file != undefined) {
                        fs.unlink('./server/logs/' + file, function (err) {
                            if (!err) {
                                logs_delete_callback({ status: 'successful', message: 'Logs Delete File Done!' });
                            } else {
                                logs_delete_callback({ status: 'error', message: 'FS Error!' });
                                socket.emit('alert', app.app_languages('${languages:87}', app.ysql.getData('app_language')));
                            }
                        });
                    } else {
                        logs_delete_callback({ status: 'error', message: 'Undefined File Value!' });
                    }
                } else {
                    logs_delete_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                logs_delete_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('logs_select', (token, file, logs_select_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_select') == true) {
                    if (file != undefined) {
                        if (file.split('.')[1] == 'log' && file.split('.')[2] == undefined) {
                            fs.readFile('./server/logs/' + file, function (err, data) {
                                if (!err) {
                                    logs_select_callback({ status: 'successful', message: 'Logs Select File Done!', data: data.toString() });
                                } else {
                                    logs_select_callback({ status: 'error', message: 'FS Error!' });
                                    socket.emit('alert', app.app_languages('${languages:87}', app.ysql.getData('app_language')));
                                }
                            });
                        } else {
                            logs_select_callback({ status: 'error', message: 'Format Not Supported!' });
                        }
                    } else {
                        logs_select_callback({ status: 'error', message: 'Undefined File Value!' });
                    }
                } else {
                    logs_select_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                logs_select_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('logs_download', (token, file, logs_download_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('logs_download') == true) {
                    if (file != undefined) {
                        if (file.split('.')[1] == 'log' && file.split('.')[2] == undefined) {
                            fs.readFile('./server/logs/' + file, function (err, data) {
                                if (!err) {
                                    logs_download_callback({ status: 'successful', message: 'Logs Download File Done!', data: data.toString() });
                                } else {
                                    logs_download_callback({ status: 'error', message: 'FS Error!' });
                                    socket.emit('alert', app.app_languages('${languages:87}', app.ysql.getData('app_language')));
                                }
                            });
                        } else {
                            logs_download_callback({ status: 'error', message: 'Format Not Supported!' });
                        }
                    } else {
                        logs_download_callback({ status: 'error', message: 'Undefined File Value!' });
                    }
                } else {
                    logs_download_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                logs_download_callback({ status: 'error', message: 'User Login Failed!' });
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
