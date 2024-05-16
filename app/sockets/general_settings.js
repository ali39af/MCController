const app = require('../../index.js');
const fs = require('fs');
const { port } = require('../../config.json');
const jdk_json = require('../../data/yservices/jdk.json');
const software_json = require('../../data/yservices/software.json');

let software_all = [];
let software_all_length = 0;
software_json.software.forEach(software_data => {
  software_all[software_all_length] = software_data.use;
  software_all_length++;
});
let jdk_all = [];
let jdk_all_length = 0;
jdk_json.jdk.forEach(jdk_data => {
  jdk_all[jdk_all_length] = jdk_data.use;
  jdk_all_length++;
});

module.exports.io = function (socket) {
  socket.on('general_settings_form', (token, general_settings_form_callback) => {
    app.user_login(token, (user) => {
      if (user.status != 'error') {
        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('general_settings') == true) {
          general_settings_form_callback({ status: 'successful', message: 'General Settings Form Load Done!' });
          let general_settings_btns = '';
          if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('general_settings_change') == true) {
            general_settings_btns += '<button type="button" class="btn btn-primary" onclick="general_settings_change_form();">${languages:105}</button>';
          }
          if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('general_settings_software_change') == true) {
            general_settings_btns += '<button type="button" class="btn btn-primary" onclick="general_settings_software_change_form();">${languages:106}</button>';
          }
          if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('general_settings_jdk_change') == true) {
            general_settings_btns += '<button type="button" class="btn btn-primary" onclick="general_settings_jdk_change_form();">${languages:107}</button>';
          }
          general_settings_btns = app.app_languages(general_settings_btns, app.ysql.getData('app_language'))
          socket.emit('modal', {
            type: 'create',
            title: app.app_languages('${languages:94}', app.ysql.getData('app_language')),
            body: `<div class="d-grid gap-2">
            ${general_settings_btns}
            </div>`,
            footer: app.app_languages('<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${languages:96}</button>', app.ysql.getData('app_language'))
          });
        } else {
          general_settings_form_callback({ status: 'error', message: 'Permission Require!' });
          socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
        }
      } else {
        general_settings_form_callback({ status: 'error', message: 'User Login Failed!' });
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

  socket.on('general_settings_change_form', (token, general_settings_change_form_callback) => {
    app.user_login(token, (user) => {
      if (user.status != 'error') {
        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('general_settings_change') == true) {
          general_settings_change_form_callback({ status: 'successful', message: 'General Settings Change Form Load Done!' });
          fs.readdir('./languages/', (err, files) => {
            if (!err) {
              let languages_num = 0;
              let languages_options = '';
              files.forEach(file => {
                languages_num++;
                let languages_selected = '';
                if (file.split('.')[0] == app.ysql.getData('app_language')) languages_selected = ' selected';
                languages_options += `<option value="${file.split('.')[0]}"${languages_selected}>${file.split('.')[0]}</option>`;
                if (languages_num == files.length) {
                  let app_connection_type_sel = '';
                  if (app.ysql.getData('app_connection_type') == 'private') app_connection_type_sel = ' selected';
                  socket.emit('modal', {
                    type: 'create',
                    title: app.app_languages('${languages:94} - ${languages:105}', app.ysql.getData('app_language')),
                    body: app.app_languages(`<div class="form-floating mb-3">
            <input value="${app.ysql.getData('server_port')}" type="number" class="form-control" id="port" name="port" placeholder="` + '${languages:108}' + `" >
            <label for="port">`+ '${languages:108}' + `</label>
        </div>
        <div class="form-floating mb-3">
          <input value="${app.ysql.getData('server_public_address')}" type="text" class="form-control" id="public_address" placeholder="` + '${languages:109}' + `">
          <label for="public_address">`+ '${languages:109}' + `</label>
        </div>
        <div class="form-floating mb-3">
            <input value="${app.ysql.getData('server_min_ram')}" type="number" class="form-control" id="min_ram" name="min_ram" placeholder="` + '${languages:110}' + `">
            <label for="min_ram">`+ '${languages:110}' + `</label>
        </div>
        <div class="form-floating mb-3">
            <input value="${app.ysql.getData('server_max_ram')}" type="number" class="form-control" id="max_ram" name="max_ram" placeholder="` + '${languages:111}' + `">
            <label for="max_ram">`+ '${languages:111}' + `</label>
        </div>
        <div class="form-floating mb-3">
            <input value="${app.ysql.getData('app_server_name')}" type="text" class="form-control" id="server_name"
                placeholder="`+ '${languages:112}' + `">
            <label for="server_name">`+ '${languages:112}' + `</label>
        </div>
        <div class="form-select mb-3">
            <label class="form-check-label" for="language">
            `+ '${languages:113}' + `
            </label>
            <select id="language" class="form-select mb-3">
                ${languages_options}
            </select>
        </div>
        <div class="form-select mb-3">
            <label class="form-check-label" for="connection">
            `+ '${languages:114}' + `
            </label>
            <select id="connection" class="form-select mb-3">
                <option value="public">`+ '${languages:115}' + `</option>
                <option value="private"${app_connection_type_sel}>` + '${languages:116}' + `</option>
            </select>
        </div>`, app.ysql.getData('app_language')),
                    footer: app.app_languages(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">` + '${languages:100}' + `</button>
            <button type="button" class="btn btn-primary" onclick="general_settings_change();">`+ '${languages:101}' + `</button>`, app.ysql.getData('app_language'))
                  });
                }
              });
            } else {
              general_settings_change_form_callback({ status: 'error', message: 'FS Error!' });
            }
          });
        } else {
          general_settings_change_form_callback({ status: 'error', message: 'Permission Require!' });
          socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
        }
      } else {
        general_settings_change_form_callback({ status: 'error', message: 'User Login Failed!' });
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

  socket.on('general_settings_change', (token, s_port, public_address, min_ram, max_ram, server_name, language, connection, general_settings_change_callback) => {
    app.user_login(token, (user) => {
      if (user.status != 'error') {
        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('general_settings_change') == true) {
          if (app.ysql.getData('server_status') != 'true') {
            if (server_name != undefined && server_name != '' && language != undefined && language != '' && connection != undefined && connection != '' && s_port > 0 && s_port != port && public_address != undefined && public_address != '' && min_ram > 0 && max_ram >= min_ram) {
              general_settings_change_callback({ status: 'successful', message: 'General Settings Change Done!' });
              app.ysql.setData('app_connection_type', connection, 1);
              app.ysql.setData('app_language', language, 1);
              app.ysql.setData('server_public_address', public_address, 1);
              app.ysql.setData('app_server_name', server_name, 1);
              app.ysql.setData('server_min_ram', min_ram, 1);
              app.ysql.setData('server_max_ram', max_ram, 1);
              app.ysql.setData('server_port', s_port, 1);
              socket.emit('alert', app.app_languages('${languages:83}', app.ysql.getData('app_language')));
              socket.emit('reload', 'reload');
            } else {
              general_settings_change_callback({ status: 'error', message: 'Data Invalid Please Try Again' });
              socket.emit('alert', app.app_languages('${languages:82}', app.ysql.getData('app_language')));
            }
          } else {
            general_settings_change_callback({ status: 'error', message: 'Server Is Online Please First Turn Off' });
            socket.emit('alert', app.app_languages('${languages:84}', app.ysql.getData('app_language')));
          }
        } else {
          general_settings_change_callback({ status: 'error', message: 'Permission Require!' });
          socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
        }
      } else {
        general_settings_change_callback({ status: 'error', message: 'User Login Failed!' });
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

  socket.on('general_settings_jdk_change_form', (token, general_settings_jdk_change_form_callback) => {
    app.user_login(token, (user) => {
      if (user.status != 'error') {
        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('general_settings_jdk_change') == true) {
          general_settings_jdk_change_form_callback({ status: 'successful', message: 'General Settings Change JDK Form Load Done!' });
          let c_jdk_div = '';
          jdk_json.jdk.forEach(jdk_data => {
            let selected = '';
            if (jdk_data.use == app.ysql.getData('server_jdk')) selected = ' selected';
            c_jdk_div += '<option value="' + jdk_data.use + '"' + selected + '>' + jdk_data.use + '</option>';
          });
          socket.emit('modal', {
            type: 'create',
            title: app.app_languages('${languages:94} - ${languages:117}', app.ysql.getData('app_language')),
            body: app.app_languages(`<div class="form-select mb-3">
                <label class="form-check-label" for="jdk">`+ '${languages:118}' + `</label>
                <select id="jdk" class="form-select mb-3">
                    ${c_jdk_div}
                </select>
            </div>`, app.ysql.getData('app_language')),
            footer: app.app_languages(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">` + '${languages:100}' + `</button>
        <button type="button" class="btn btn-primary" onclick="general_settings_jdk_change();">`+ '${languages:101}' + `</button>`, app.ysql.getData('app_language'))
          });
        } else {
          general_settings_jdk_change_form_callback({ status: 'error', message: 'Permission Require!' });
          socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
        }
      } else {
        general_settings_jdk_change_form_callback({ status: 'error', message: 'User Login Failed!' });
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

  socket.on('general_settings_jdk_change', (token, jdk, general_settings_jdk_change_callback) => {
    app.user_login(token, (user) => {
      if (user.status != 'error') {
        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('general_settings_jdk_change') == true) {
          if (app.ysql.getData('server_status') != 'true') {
            if (jdk) {
              if (jdk_all.includes(jdk) == true) {
                general_settings_jdk_change_callback({ status: 'successful', message: 'General Settings Change JDK Done!' });
                socket.emit('alert', app.app_languages('${languages:85}', app.ysql.getData('app_language')));
                socket.emit('reload', 'reload');
                app.ysql.setData('server_jdk', jdk, 1);
                app.server_debug.check_jdk_files(function (callback) { });
              } else {
                general_settings_jdk_change_callback({ status: 'error', message: 'Data Invalid Please Try Again' });
                socket.emit('alert', app.app_languages('${languages:82}', app.ysql.getData('app_language')));
              }
            } else {
              general_settings_jdk_change_callback({ status: 'error', message: 'Data Invalid Please Try Again' });
              socket.emit('alert', app.app_languages('${languages:82}', app.ysql.getData('app_language')));
            }
          } else {
            general_settings_jdk_change_callback({ status: 'error', message: 'Server Is Online Please First Turn Off' });
            socket.emit('alert', app.app_languages('${languages:84}', app.ysql.getData('app_language')));
          }
        } else {
          general_settings_jdk_change_callback({ status: 'error', message: 'Permission Require!' });
          socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
        }
      } else {
        general_settings_jdk_change_callback({ status: 'error', message: 'User Login Failed!' });
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

  socket.on('general_settings_software_change_form', (token, general_settings_software_change_form_callback) => {
    app.user_login(token, (user) => {
      if (user.status != 'error') {
        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('general_settings_software_change') == true) {
          general_settings_software_change_form_callback({ status: 'successful', message: 'General Settings Change Software Form Load Done!' });
          let c_software_div = '';
          software_json.software.forEach(software_data => {
            let selected = '';
            if (app.ysql.getData('server_software') == software_data.use) selected = ' selected';
            if (software_data.type == 'server') {
              c_software_div += '<option value="' + software_data.use + '"' + selected + '>' + software_data.use + '</option>';
            }
          });
          socket.emit('modal', {
            type: 'create',
            title: app.app_languages('${languages:94} - ${languages:119}', app.ysql.getData('app_language')),
            body: app.app_languages(`<div class="form-select mb-3">
            <label class="form-check-label" for="software">
              `+ '${languages:120}' + `
            </label>
            <select id="software" class="form-select mb-3">
              ${c_software_div}
            </select>
        </div>`, app.ysql.getData('app_language')),
            footer: app.app_languages(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">` + '${languages:100}' + `</button>
            <button type="button" class="btn btn-primary" onclick="general_settings_software_change_form2();">`+ '${languages:121}' + `</button>`, app.ysql.getData('app_language'))
          });
        } else {
          general_settings_software_change_form_callback({ status: 'error', message: 'Permission Require!' });
          socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
        }
      } else {
        general_settings_software_change_form_callback({ status: 'error', message: 'User Login Failed!' });
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

  socket.on('general_settings_software_change_form2', (token, software, general_settings_software_change_form2_callback) => {
    app.user_login(token, (user) => {
      if (user.status != 'error') {
        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('general_settings_software_change') == true) {
          if (software_all.includes(software) == true) {
            general_settings_software_change_form2_callback({ status: 'successful', message: 'General Settings Change Software Form2 Load Done!' });
            let software_version_div = '';
            software_json.software.forEach(software_data => {
              if (software_data.use == software) {
                software_data.downloads.forEach(downloads_data => {
                  software_version_div += '<option value="' + downloads_data.version + '">' + downloads_data.version + '</option>';
                });
              }
            });
            socket.emit('modal', {
              type: 'create',
              title: app.app_languages('${languages:94} - ${languages:122}', app.ysql.getData('app_language')),
              body: app.app_languages(`<div class="form-select mb-3">
                      <label class="form-check-label" for="version">`+ '${languages:123}' + `</label>
                      <select id="version" class="form-select mb-3">
                        ${software_version_div}
                      </select>
                  </div>
                  <div class="form-check mb-3">
                      <input class="form-check-input" type="checkbox" value="true" id="eula">
                      <label class="form-check-label" for="eula">`+ '${languages:124}' + ` <a href="https://www.minecraft.net/en-us/eula">` + '${languages:125}' + `</a></label>
                  </div>`, app.ysql.getData('app_language')),
              footer: app.app_languages(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">` + '${languages:100}' + `</button>
                <button type="button" class="btn btn-primary" onclick="general_settings_software_change('${software}');">` + '${languages:101}' + `</button>`, app.ysql.getData('app_language'))
            });
          } else {
            general_settings_software_change_form2_callback({ status: 'error', message: 'Data Invalid Please Try Again' });
            socket.emit('alert', app.app_languages('${languages:82}', app.ysql.getData('app_language')));
          }
        } else {
          general_settings_software_change_form2_callback({ status: 'error', message: 'Permission Require!' });
          socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
        }
      } else {
        general_settings_software_change_form2_callback({ status: 'error', message: 'User Login Failed!' });
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

  socket.on('general_settings_software_change', (token, software, version, eula, general_settings_software_change_callback) => {
    app.user_login(token, (user) => {
      if (user.status != 'error') {
        if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('general_settings_software_change') == true) {
          if (app.ysql.getData('server_status') != 'true') {
            if (software && version && eula) {
              if (eula == 'true') {
                if (software_all.includes(software) == true) {
                  general_settings_software_change_callback({ status: 'successful', message: 'General Settings Change Software Done!' });
                  socket.emit('alert', app.app_languages('${languages:81}', app.ysql.getData('app_language')));
                  socket.emit('reload', 'reload');
                  app.ysql.setData('server_software', software, 1);
                  app.ysql.setData('server_version', version, 1);
                  app.ysql.setData('server_eula', 'true', 1);
                  app.server_debug.check_software_files(function (callback) { });
                } else {
                  general_settings_software_change_callback({ status: 'error', message: 'Data Invalid Please Try Again' });
                  socket.emit('alert', app.app_languages('${languages:82}', app.ysql.getData('app_language')));
                }
              } else {
                general_settings_software_change_callback({ status: 'error', message: 'Please Accept Minecraft EULA' });
                socket.emit('alert', app.app_languages('${languages:86}', app.ysql.getData('app_language')));
              }
            } else {
              general_settings_software_change_callback({ status: 'error', message: 'Data Invalid Please Try Again' });
              socket.emit('alert', app.app_languages('${languages:82}', app.ysql.getData('app_language')));
            }
          } else {
            general_settings_software_change_callback({ status: 'error', message: 'Server Is Online Please First Turn Off' });
            socket.emit('alert', app.app_languages('${languages:84}', app.ysql.getData('app_language')));
          }
        } else {
          general_settings_software_change_callback({ status: 'error', message: 'Permission Require!' });
          socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
        }
      } else {
        general_settings_software_change_callback({ status: 'error', message: 'User Login Failed!' });
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