const app = require('../../index.js');
const fs = require('fs');
const AdmZip = require('adm-zip');

async function unzip_file(filepath, outputDir, callback) {
    let filepath_save = filepath;
    try {
        const zip = new AdmZip(filepath);
        zip.extractAllTo(outputDir);
        callback('true');
    } catch (e) {
        fs.unlinkSync(filepath_save);
        callback('false');
    }
}
module.exports.io = function (socket) {
    socket.on('files_upload_form', (token, file_manager_location, files_upload_form_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_upload') == true) {
                    files_upload_form_callback({ status: 'successful', message: 'Files Upload Form Load Done!' });
                    socket.emit('modal', {
                        type: 'create',
                        title: app.app_languages('${languages:102}', app.ysql.getData('app_language')),
                        body: app.app_languages('<div style="text-align: center;" id="upload_status">${languages:103} ' + file_manager_location + '</div><input class="form-control form-control-sm" type="file" id="upload_file" accept=".jar,.zip,.yml,.log,.gz,.txt,.bat,.properties,.png,.jpg,.json,.py,.js,.gif,.lock,.dat,.sk" required />', app.ysql.getData('app_language')),
                        footer: app.app_languages(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">` + '${languages:96}' + `</button>
                        <button id="upload_btn" type="button" class="btn btn-primary" onclick="files_upload();">`+ '${languages:104}' + `</button>`, app.ysql.getData('app_language'))
                    });
                } else {
                    files_upload_form_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                files_upload_form_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('files_upload', (token, file_manager_location, file, files_upload_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_upload') == true) {
                    fs.writeFile('./server/' + file_manager_location.replaceAll('..', ''), file, (err) => {
                        if (!err) {
                            files_upload_callback({ status: 'successful', message: 'Files Upload Form Load Done!' });
                        } else {
                            files_upload_callback({ status: 'error', message: 'FS Error!' });
                        }
                    });
                } else {
                    files_upload_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                files_upload_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('files_list_files', (token, file_manager_location, files_list_files_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_list_files') == true) {
                    fs.readdir('./server/' + file_manager_location.replaceAll('..', ''), (err, files) => {
                        let files_data_location = '';
                        let files_data_files = '';
                        let files_data_folders = '';
                        file_manager_location.split('/').forEach(file_locations => {
                            files_data_location += `<a href="javascript:void(0)" onclick="files_location_update('${file_manager_location.split(file_locations)[0]}${file_locations}');">${file_locations}</a><p>/</p>`;
                        });
                        if (files != undefined && files != '') {
                            files.forEach(file => {
                                if (file != 'logs' && file != '.console_history') {
                                    if (file.split('.')[file.split('.').length - 1] == 'gif' || file.split('.')[file.split('.').length - 1] == 'css' || file.split('.')[file.split('.').length - 1] == 'gz' || file.split('.')[file.split('.').length - 1] == 'html' || file.split('.')[file.split('.').length - 1] == 'icon' || file.split('.')[file.split('.').length - 1] == 'jar' || file.split('.')[file.split('.').length - 1] == 'jpg' || file.split('.')[file.split('.').length - 1] == 'js' || file.split('.')[file.split('.').length - 1] == 'json' || file.split('.')[file.split('.').length - 1] == 'log' || file.split('.')[file.split('.').length - 1] == 'png' || file.split('.')[file.split('.').length - 1] == 'properties' || file.split('.')[file.split('.').length - 1] == 'py' || file.split('.')[file.split('.').length - 1] == 'txt' || file.split('.')[file.split('.').length - 1] == 'yml' || file.split('.')[file.split('.').length - 1] == 'zip' || file.split('.')[file.split('.').length - 1] == 'bat' || file.split('.')[file.split('.').length - 1] == 'lock' || file.split('.')[file.split('.').length - 1] == 'dat_old' || file.split('.')[file.split('.').length - 1] == 'dat') {
                                        if (file.split('.')[file.split('.').length - 1] == 'lock' || file.split('.')[file.split('.').length - 1] == 'dat_old' || file.split('.')[file.split('.').length - 1] == 'dat' || file.split('.')[file.split('.').length - 1] == '0') {
                                            files_data_files += `<tr><th onclick="files_location_update('${file_manager_location}/${file}');" class="d-flex" scope="row"><img src="/static/images/file_type/any-icon.png" width="32px" height="32px" /><p style="color: white;margin-bottom: 0;margin-top: 5px;margin-left: 4px;">${file}</p></th><td>`;
                                            if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_open') == true || user.level_permission.split(',').includes('files_delete') == true) {
                                                files_data_files += '<div class="dropdown"><button type="button" class="btn btn-primary btn-sm" data-bs-toggle="dropdown" aria-expanded="false"><i class="bx bx-dots-horizontal-rounded"></i></button><ul class="dropdown-menu">';
                                            }
                                            if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_open') == true) {
                                                files_data_files += `<li><a href="javascript:void(0)" onclick="files_location_update('${file_manager_location}/${file}');" type="button" class="dropdown-item">Open</a></li>`;
                                            }
                                            if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_delete') == true) {
                                                files_data_files += `<li><button onclick="files_delete('${file_manager_location}/${file}');" type="button" class="dropdown-item">Delete</button></li>`;
                                            }
                                            if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_open') == true || user.level_permission.split(',').includes('files_delete') == true) {
                                                files_data_files += '</ul></div>';
                                            }
                                            files_data_files += '</td>';
                                        } else {
                                            files_data_files += `<tr><th onclick="files_location_update('${file_manager_location}/${file}');" class="d-flex" scope="row"><img src="/static/images/file_type/${file.split('.')[file.split('.').length - 1]}-icon.png" width="32px" height="32px" /><p style="color: white;margin-bottom: 0;margin-top: 5px;margin-left: 4px;">${file}</p></th><td>`;
                                            if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_open') == true || user.level_permission.split(',').includes('files_delete') == true) {
                                                files_data_files += '<div class="dropdown"><button type="button" class="btn btn-primary btn-sm" data-bs-toggle="dropdown" aria-expanded="false"><i class="bx bx-dots-horizontal-rounded"></i></button><ul class="dropdown-menu">';
                                            }
                                            if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_open') == true) {
                                                files_data_files += `<li><a href="javascript:void(0)" onclick="files_location_update('${file_manager_location}/${file}');" type="button" class="dropdown-item">Open</a></li>`;
                                            }
                                            if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_delete') == true) {
                                                files_data_files += `<li><button onclick="files_delete('${file_manager_location}/${file}');" type="button" class="dropdown-item">Delete</button></li>`;
                                            }
                                            if (file.split('.')[file.split('.').length - 1] == 'zip') {
                                                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_unzip') == true) {
                                                    files_data_files += `<li><button onclick="files_unzip('${file_manager_location}/${file}');" type="button" class="dropdown-item">Unzip Here</button></li>`;
                                                }
                                            }
                                            if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_open') == true || user.level_permission.split(',').includes('files_delete') == true) {
                                                files_data_files += '</ul></div>';
                                            }
                                            files_data_files += '</td>';
                                        }
                                    } else {
                                        files_data_folders += `<tr><th onclick="files_location_update('${file_manager_location}/${file}');" class="d-flex" scope="row"><img src="/static/images/file_type/folder-icon.png" width="32px" height="32px" /><p style="color: white;margin-bottom: 0;margin-top: 5px;margin-left: 4px;">${file}</p></th><td><div class="dropdown"><button type="button" class="btn btn-primary btn-sm" data-bs-toggle="dropdown" aria-expanded="false"><i class="bx bx-dots-horizontal-rounded"></i></button><ul class="dropdown-menu"><li><a href="javascript:void(0)" onclick="files_location_update('${file_manager_location}/${file}');" type="button" class="dropdown-item">Open</a></li>`;
                                        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_delete') == true) {
                                            files_data_folders += `<li><button onclick="files_delete_folder('${file_manager_location}/${file}');" type="button" class="dropdown-item">Delete</button></li>`;
                                        }
                                        files_data_folders += '</ul></div></td>';
                                    }
                                }
                            });
                            files_list_files_callback({ status: 'successful', message: 'Files List Files Done!', files_data: `<div class="d-flex"><a href="javascript:void(0)" onclick="files_location_update('');">Server</a>${files_data_location}</div><table class="table table-dark"><thead><tr><th scope="col"><i class="bx bx-file bx-sm"></i>Name</th><th scope="col">Actions</th></tr></thead><tbody>${files_data_folders}${files_data_files}</tbody>` });
                        } else {
                            if (file_manager_location.split('.')[1] == undefined) {
                                if (err) {
                                    files_list_files_callback({ status: 'successful', message: 'Files List Files Form Done!', files_data: `<div class="d-flex"><a href="javascript:void(0)" onclick="files_location_update('');">Server</a>${files_data_location}</div> <center><h4>This path does not exist!</h4></center>` });
                                } else {
                                    files_list_files_callback({ status: 'successful', message: 'Files List Files Form Done!', files_data: `<div class="d-flex"><a href="javascript:void(0)" onclick="files_location_update('');">Server</a>${files_data_location}</div> <center><h4>This Folder is Empty!</h4></center>` });
                                }
                            } else {
                                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_edit') == true && user.level_permission.split(',').includes('files_open') == true) {
                                    let file_type = file_manager_location.split('.')[file_manager_location.split('.').length - 1];
                                    if (fs.existsSync('./server/' + file_manager_location.replaceAll('..', ''))) {
                                        if (file_type == 'js' || file_type == 'yml' || file_type == 'txt' || file_type == 'properties' || file_type == 'json' || file_type == 'log' || file_type == 'sk' || file_type == 'bat' || file_type == 'py' || file_type == 'html' || file_type == 'css') {
                                            fs.readFile('./server/' + file_manager_location.replaceAll('..', ''), 'utf8', (err, data) => {
                                                if (!err) {
                                                    files_list_files_callback({ status: 'successful', message: 'Files List Files Form Done!', files_data: `<div class="d-flex"><a href="javascript:void(0)" onclick="files_location_update('');">Server</a>${files_data_location}</div> <div class="d-flex justify-content-center"><button style="margin-bottom: 5px;margin-right: 5px;" type="button" class="btn btn-primary btn-sm" onclick="files_edit();"><i class="bx bx-save"></i></button></div><p><textarea id="lineCounter" wrap="off" readonly>1.</textarea><textarea id="codeEditor" wrap="off">${data}</textarea></p>` });
                                                } else {
                                                    files_list_files_callback({ status: 'successful', message: 'Files List Files Form Done!', files_data: `<div class="d-flex"><a href="javascript:void(0)" onclick="files_location_update('');">Server</a>${files_data_location}</div> <center><h4>There was a problem reading the file!</h4></center>` });
                                                }
                                            });
                                        } else {
                                            files_list_files_callback({ status: 'successful', message: 'Files List Files Form Done!', files_data: `<div class="d-flex"><a href="javascript:void(0)" onclick="files_location_update('');">Server</a>${files_data_location}</div> <center><h4>This file is unknown and the fable is not open!</h4></center>` });
                                        }
                                    } else {
                                        files_list_files_callback({ status: 'successful', message: 'Files List Files Form Done!', files_data: `<div class="d-flex"><a href="javascript:void(0)" onclick="files_location_update('');">Server</a>${files_data_location}</div> <center><h4>This path does not exist!</h4></center>` });
                                    }
                                } else {
                                    files_list_files_callback({ status: 'error', message: 'Permission Require!' });
                                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                                }
                            }
                        }
                    });
                } else {
                    files_list_files_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                files_list_files_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('files_edit', (token, file_manager_location, file, files_edit_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_edit') == true) {
                    fs.writeFile('./server/' + file_manager_location.replaceAll('..', ''), file, 'utf8', (err) => {
                        if (!err) {
                            files_edit_callback({ status: 'successful', message: 'File Edit Done!' });
                            socket.emit('alert', app.app_languages('${languages:78}', app.ysql.getData('app_language')));
                        } else {
                            files_edit_callback({ status: 'error', message: 'FS Error!' });
                        }
                    });
                } else {
                    files_edit_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                files_edit_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('files_delete', (token, file, files_delete_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_delete') == true) {
                    fs.unlink('./server/' + file, (err) => {
                        if (!err) {
                            files_delete_callback({ status: 'successful', message: 'File Delete Done!' });
                            socket.emit('alert', app.app_languages('${languages:79}', app.ysql.getData('app_language')));
                        } else {
                            files_delete_callback({ status: 'error', message: 'FS Error!' });
                        }
                    });
                } else {
                    files_delete_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                files_delete_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('files_unzip', (token, file, file_manager_location, files_unzip_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_unzip') == true) {
                    unzip_file('./server/'+file, './server/'+file_manager_location.replaceAll('..', ''), function (unzip_file_callback) {
                        if (unzip_file_callback == 'true') {
                            files_unzip_callback({ status: 'successful', message: 'File Unzip Done!' });
                            socket.emit('alert', app.app_languages('${languages:137}', app.ysql.getData('app_language')));
                        } else if (unzip_file_callback == 'false') {
                            files_unzip_callback({ status: 'error', message: 'FS Error!' });
                        }
                    });
                } else {
                    files_unzip_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                files_unzip_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('files_delete_folder', (token, folder, files_delete_folder_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('files_delete') == true) {
                    fs.readdir('./server/' + folder, (err, files) => {
                        if (!err) {
                            if (files != undefined && files != '') {
                                let files_del_length = 0;
                                files.forEach(file => {
                                    fs.unlink('./server/' + folder + '/' + file, (err) => {
                                        if (!err) {
                                            files_del_length++;
                                            if (files_del_length == files.length) {
                                                fs.rmdir('./server/' + folder, (err) => {
                                                    if (!err) {
                                                        files_delete_folder_callback({ status: 'successful', message: 'Folder Delete Done!' });
                                                        socket.emit('alert', app.app_languages('${languages:80}', app.ysql.getData('app_language')));
                                                    } else {
                                                        files_delete_folder_callback({ status: 'error', message: 'FS Error!' });
                                                    }
                                                });
                                            }
                                        } else {
                                            files_delete_folder_callback({ status: 'error', message: 'FS Error!' });
                                        }
                                    });
                                });
                            } else {
                                fs.rmdir('./server/' + folder, (err) => {
                                    if (!err) {
                                        files_delete_folder_callback({ status: 'successful', message: 'Folder Delete Done!' });
                                        socket.emit('alert', app.app_languages('${languages:80}', app.ysql.getData('app_language')));
                                    } else {
                                        files_delete_folder_callback({ status: 'error', message: 'FS Error!' });
                                    }
                                });
                            }
                        } else {
                            files_delete_folder_callback({ status: 'error', message: 'FS Error!' });
                        }
                    });
                } else {
                    files_delete_folder_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                files_delete_folder_callback({ status: 'error', message: 'User Login Failed!' });
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