const app = require('../index.js');
const fs = require('fs');

module.exports.load = function (callback) {
    app.loger.log('Loading Addons Files...', 1, 2);
    fs.readdir('./addons/addons', (err, files) => {
        if (!err) {
            module.exports.addons_files = files;
            if (files == '') { app.loger.log('Loading Addons Done!', 1, 1); callback('true'); } else {
                let file_length = 0;
                let before_files_length = 0;
                let before_files = [];
                let after_files_length = 0;
                let after_files = [];
                files.forEach(file => {
                    file_length++;
                    let file_type = file.split('.');
                    if (file_type[2] == 'js') {
                        if (file_type[1] == 'before') {
                            before_files[before_files_length] = file;
                            before_files_length++;
                        } else if (file_type[1] == 'after') {
                            after_files[after_files_length] = file;
                            after_files_length++;
                        }
                        if (file_length == files.length) {
                            before_files_load_length = 0;
                            before_files.forEach(file => {
                                app.loger.log(`Loading Addons File: ${file.split('.')[0]}`, 1, 2);
                                require(`../addons/addons/${file}`).start(function (callback_before) {
                                    if (callback_before == 'true') {
                                        before_files_load_length++;
                                        if (before_files_load_length == before_files.length) {
                                            after_files_load_length = 0;
                                            after_files.forEach(file => {
                                                app.loger.log(`Loading Addons File: ${file.split('.')[0]}`, 1, 2);
                                                require(`../addons/addons/${file}`).start(function (callback_after) {
                                                    if (callback_after == 'true') {
                                                        after_files_load_length++;
                                                        if (after_files_load_length == after_files.length) {
                                                            app.loger.log('Loading Addons Done!', 1, 1);
                                                            callback('true');
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            }
        }
    });
}