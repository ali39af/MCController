const fs = require('fs');

module.exports.change = function (file_path, name, value, callback) {
    fs.readFile(file_path, 'utf-8', function (err, data) {
        if (!err) {
            let re_genrate_file = '';
            let data_line_length = 0;
            let first_line = 'true';
            let data_line_change = 'false';
            data.split('\r\n').forEach(data_line => {
                let next_line = '\r\n';
                if (first_line == 'true') { next_line = ''; first_line = 'false'; }
                data_line = data_line.split('=');
                data_line_length++;
                if (data_line[1] != undefined) {
                    if (data_line[0] == name) {
                        re_genrate_file += data_line[0] + '=' + value + next_line;
                        data_line_change = 'true';
                    } else {
                        re_genrate_file += data_line[0] + '=' + data_line[1] + next_line;
                    }
                } else if (data_line[0] != '' && data_line[0] != undefined) {
                    re_genrate_file += data_line[0] + next_line;
                }
                if (data.split('\r\n').length == data_line_length) {
                    if (data_line_change == 'false') { re_genrate_file += name + '=' + value + next_line; }
                    fs.writeFile(file_path, re_genrate_file, 'utf-8', function (err) {
                        if (!err) {
                            callback('true');
                        } else {
                            callback('error');
                        }
                    });

                }
            });
        } else {
            callback('error');
        }
    });
}

