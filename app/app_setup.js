const app = require('../index.js');
const { port } = require('../config.json');

app.loger.log('Checking Setup Status...', 1, 2);
if (app.ysql.getData('app_setup') == 1) {
  app.loger.log('Checking Setup Status Done!', 1, 1);
  app.load_app('again');
} else if (app.ysql.getData('app_setup') == 0) {
  const fs = require('fs');

  const software_json = require('../data/yservices/software.json');
  let software_div = '';
  let software_all = [];
  let software_all_length = 0;
  software_json.software.forEach(software_data => {
    if (software_data.type == 'server') {
      software_div += '<option value="' + software_data.use + '">' + software_data.use + '</option>';
    }
    software_all[software_all_length] = software_data.use;
    software_all_length++;
  });
  const jdk_json = require('../data/yservices/jdk.json');
  let jdk_div = '';
  let jdk_all = [];
  let jdk_all_length = 0;
  jdk_json.jdk.forEach(jdk_data => {
    jdk_div += '<option value="' + jdk_data.use + '">' + jdk_data.use + '</option>';
    jdk_all[jdk_all_length] = jdk_data.use;
    jdk_all_length++;
  });

  let html_setup = '';

  fs.readFile(`./themes/${app.ysql.getData('app_theme')}/setup.html`, 'utf8', function (err, data) {
    if (!err) {
      app.listen();
      app.loger.log('Fill Out The Setup Form', 1, 2);

      let dict_s = 'ZXCVBNM.LKJHGFDSAQWERTYUIOP@#$%^12345678#90z%.xcvbnmlkjhgfdsaqwertyuiop';

      html_setup = data;
      app.app.get('/', function (req, res) {
        if (app.ysql.getData('app_setup') == 0) {
          res.send(app.app_languages(html_setup, app.ysql.getData('app_language')));
        } else {
          if (app.ysql.getData('app_connection_type') == 'private') {
            if (req.ipInfo.ip != '::1') {
              return;
            }
          }
          res.redirect('/login/');
        }
      });
      app.io.on('connection', (socket) => {
        if (app.ysql.getData('app_setup') == 0) {
          socket.on('change_language_form', (change_language_form_callback) => {
            if (app.ysql.getData('app_setup') == 0) {
              fs.readdir('./languages/', (err, files) => {
                if (!err) {
                  let languages_options = '';
                  files.forEach(file => {
                    let languages_selected = '';
                    if (file.split('.')[0] == app.ysql.getData('app_language')) languages_selected = ' selected';
                    languages_options += `<option value="${file.split('.')[0]}"${languages_selected}>${file.split('.')[0]}</option>`;
                  });
                  change_language_form_callback({ status: 'successful', message: 'Change Language Form Load Form Done!' });
                  socket.emit('modal', {
                    type: 'create',
                    title: app.app_languages('${languages:64} - ${languages:136}', app.ysql.getData('app_language')),
                    body: app.app_languages(`<div class="form-select mb-3">
                      <label class="form-check-label" for="language">
                      `+ '${languages:113}' + `
                      </label>
                      <select id="language" class="form-select mb-3">
                        ${languages_options}
                      </select>
                    </div>`, app.ysql.getData('app_language')),
                    footer: app.app_languages(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">` + '${languages:100}' + `</button>
                    <button type="button" class="btn btn-primary" onclick="change_language();">`+ '${languages:101}' + `</button>`, app.ysql.getData('app_language'))
                  });
                } else {
                  change_language_form_callback({ status: 'error', message: 'FS Error' });
                }
              });
            }
          });
          socket.on('change_language', (language, change_language_callback) => {
            if (app.ysql.getData('app_setup') == 0) {
              if (language != undefined && language != '') {
                change_language_callback({ status: 'successful', message: 'Change Language Done!' });
                app.ysql.setData('app_language', language, 1);
                socket.emit('reload', 'reload');
              } else {
                change_language_callback({ status: 'error', message: 'Data Invalid Please Try Again' });
                socket.emit('alert', app.app_languages('${languages:82}', app.ysql.getData('app_language')));
              }
            }
          });
          socket.on('setup', (data) => {
            if (app.ysql.getData('app_setup') == 0) {
              if (data.event != undefined) {
                if (data.event == 'setup_f1') {
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
                          socket.emit('modal', {
                            type: 'create',
                            title: app.app_languages('${languages:64} - ${languages:126}', app.ysql.getData('app_language')),
                            body: app.app_languages(`<div class="form-floating mb-3">
                          <input type="text" class="form-control" id="username" placeholder="`+ '${languages:130}' + `">
                          <label for="username">`+ '${languages:130}' + `</label>
                      </div>
                      <div class="form-floating mb-3">
                          <input type="password" class="form-control" id="password"
                              placeholder="`+ '${languages:131}' + `">
                          <label for="password">`+ '${languages:131}' + `</label>
                      </div>
                      <div class="form-floating mb-3">
                          <input value="localhost" type="text" class="form-control" id="public_address"
                              placeholder="`+ '${languages:109}' + `">
                          <label for="public_address">`+ '${languages:109}' + `</label>
                      </div>
                      <div class="form-floating mb-3">
                          <input type="text" class="form-control" id="server_name"
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
                              <option value="private">`+ '${languages:116}' + `</option>
                          </select>
                      </div>`, app.ysql.getData('app_language')),
                            footer: app.app_languages(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">` + '${languages:100}' + `</button>
                          <button type="button" class="btn btn-primary" onclick="setup_f2();">`+ '${languages:121}' + `</button>`, app.ysql.getData('app_language'))
                          });
                        }
                      });
                    }
                  });
                }
                if (data.event == 'setup_f2') {
                  if (data.username != undefined && data.username != '' && data.password != undefined && data.password != '' && data.server_name != undefined && data.server_name != '' && data.language != undefined && data.language != '' && data.connection != undefined && data.connection != '' && data.public_address != undefined && data.public_address != '') {
                    socket.emit('modal', {
                      type: 'create',
                      title: app.app_languages('${languages:64} - ${languages:127}', app.ysql.getData('app_language')),
                      body: app.app_languages(`<div class="form-floating mb-3">
                    <input type="number" class="form-control" id="port" name="port" placeholder="`+ '${languages:108}' + `" >
                    <label for="port">`+ '${languages:108}' + `</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" id="min_ram" name="min_ram" placeholder="`+ '${languages:110}' + `">
                    <label for="min_ram">`+ '${languages:110}' + `</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" id="max_ram" name="max_ram" placeholder="`+ '${languages:111}' + `">
                    <label for="max_ram">`+ '${languages:111}' + `</label>
                </div>
                <div class="form-select mb-3">
                    <label class="form-check-label" for="jdk">
                    `+ '${languages:118}' + `
                    </label>
                    <select id="jdk" class="form-select mb-3">
                        ${jdk_div}
                    </select>
                </div>
                <div class="form-select mb-3">
                    <label class="form-check-label" for="software">
                    `+ '${languages:120}' + `
                    </label>
                    <select id="software" class="form-select mb-3">
                      ${software_div}
                    </select>
                </div>`, app.ysql.getData('app_language')),
                      footer: app.app_languages(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">` + '${languages:100}' + `</button>
                    <button type="button" class="btn btn-primary" onclick="setup_f3('${data.username}','${data.password}','${data.public_address}','${data.server_name}','${data.language}','${data.connection}');">` + '${languages:121}' + `</button>`, app.ysql.getData('app_language'))
                    });
                  } else {
                    socket.emit('modal', {
                      type: 'create',
                      title: app.app_languages('${languages:129}', app.ysql.getData('app_language')),
                      body: app.app_languages('${languages:82}', app.ysql.getData('app_language')),
                      footer: app.app_languages('<button type="button" class="btn btn-danger" data-bs-dismiss="modal">${languages:96}</button>', app.ysql.getData('app_language'))
                    });
                  }
                }
                if (data.event == 'setup_f3') {
                  if (data.username != undefined && data.username != '' && data.password != undefined && data.password != '' && data.server_name != undefined && data.server_name != '' && data.language != undefined && data.language != '' && data.connection != undefined && data.connection != '' && data.public_address != undefined && data.public_address != '' && data.port > 0 && data.port != port && data.min_ram > 0 && data.max_ram >= data.min_ram && data.jdk != undefined && data.jdk != '' && data.software != undefined && data.software != '') {
                    let software_version_div = '';
                    software_json.software.forEach(software_data => {
                      if (software_data.use == data.software) {
                        software_data.downloads.forEach(downloads_data => {
                          software_version_div += '<option value="' + downloads_data.version + '">' + downloads_data.version + '</option>';
                        });
                      }
                    });
                    socket.emit('modal', {
                      type: 'create',
                      title: app.app_languages('${languages:64} - ${languages:128}', app.ysql.getData('app_language')),
                      body: app.app_languages(`<div class="form-select mb-3">
                    <label class="form-check-label" for="version">
                      `+ '${languages:123}' + `
                    </label>
                    <select id="version" class="form-select mb-3">
                      ${software_version_div}
                    </select>
                </div>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" value="true" id="eula">
                    <label class="form-check-label" for="eula">
                      `+ '${languages:124}' + ` <a href="https://www.minecraft.net/en-us/eula">` + '${languages:125}' + `</a>
                    </label>
                </div>`, app.ysql.getData('app_language')),
                      footer: app.app_languages(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">` + '${languages:100}' + `</button>
                    <button type="button" class="btn btn-primary" onclick="setup('${data.username}','${data.password}','${data.public_address}','${data.server_name}','${data.language}','${data.connection}','${data.port}','${data.min_ram}','${data.max_ram}','${data.jdk}', '${data.software}');">` + '${languages:64}' + `</button>`, app.ysql.getData('app_language'))
                    });
                  } else {
                    socket.emit('modal', {
                      type: 'create',
                      title: app.app_languages('${languages:129}', app.ysql.getData('app_language')),
                      body: app.app_languages('${languages:82}', app.ysql.getData('app_language')),
                      footer: app.app_languages('<button type="button" class="btn btn-danger" data-bs-dismiss="modal">${languages:96}</button>', app.ysql.getData('app_language'))
                    });
                  }
                }
                if (data.event == 'setup') {
                  if (data.username != undefined && data.username != '' && data.password != undefined && data.password != '' && data.server_name != undefined && data.server_name != '' && data.language != undefined && data.language != '' && data.connection != undefined && data.connection != '' && data.port != undefined && data.port != '' && data.port != port && data.public_address != undefined && data.public_address != '' && data.min_ram != undefined && data.min_ram != '' && data.max_ram != undefined && data.max_ram != '' && data.jdk != undefined && data.jdk != '' && data.software != undefined && data.software != '' && data.version != undefined && data.version != '' && data.eula != undefined && data.eula == 'true') {
                    let new_user_token = '';
                    for (var i = 0; i < 128; i++) {
                      new_user_token += dict_s.charAt(Math.floor(Math.random() * dict_s.length));
                    }
                    let new_user_salt = '';
                    for (var i = 0; i < 8; i++) {
                      new_user_salt += dict_s.charAt(Math.floor(Math.random() * dict_s.length));
                    }
                    if (!fs.existsSync('./data/users')) {
                      fs.mkdirSync('./data/users');
                    }
                    fs.writeFile(`data/users/${data.username}.json`, `{
    "username": "${data.username}",
    "password": "${app.app_crypto.sha512_hash(data.password, new_user_salt).dataHash}",
    "salt": "${new_user_salt}",
    "token": "${new_user_token}",
    "level_permission": "all"
}`, 'utf-8', function (err) {
                      if (!err) {
                        app.ysql.setData('app_setup', '1', 1);
                        app.ysql.setData('app_connection_type', data.connection, 1);
                        app.ysql.setData('app_theme', app.ysql.getData('app_theme'), 1);
                        app.ysql.setData('app_language', data.language, 1);
                        app.ysql.setData('server_public_address', data.public_address, 1);
                        app.ysql.setData('app_server_name', data.server_name, 1);
                        app.ysql.setData('server_min_ram', data.min_ram, 1);
                        app.ysql.setData('server_max_ram', data.max_ram, 1);
                        app.ysql.setData('server_version', data.version, 1);
                        app.ysql.setData('server_jdk', data.jdk, 1);
                        app.ysql.setData('server_software', data.software, 1);
                        app.ysql.setData('server_eula', data.eula, 1);
                        app.ysql.setData('server_port', data.port, 1);
                        app.ysql.setData('server_status', 'false', 1);
                        app.loger.log('Setup Done!', 1, 1);
                        app.load_app();
                        setTimeout(() => {
                          socket.emit('go_location', '/login/?errorcode=102');
                        }, 250);
                      } else {
                        socket.emit('modal', {
                          type: 'create',
                          title: app.app_languages('${languages:129}', app.ysql.getData('app_language')),
                          body: app.app_languages('${languages:82}', app.ysql.getData('app_language')),
                          footer: app.app_languages('<button type="button" class="btn btn-danger" data-bs-dismiss="modal">${languages:96}</button>', app.ysql.getData('app_language'))
                        });
                      }
                    });
                  } else {
                    socket.emit('modal', {
                      type: 'create',
                      title: app.app_languages('${languages:129}', app.ysql.getData('app_language')),
                      body: app.app_languages('${languages:82}', app.ysql.getData('app_language')),
                      footer: app.app_languages('<button type="button" class="btn btn-danger" data-bs-dismiss="modal">${languages:96}</button>', app.ysql.getData('app_language'))
                    });
                  }
                }
              }
            }
          });
        }
      });
    } else {
      app.loger.log('Loading View Setup Failed!', 3, 3);
    }
  });
}