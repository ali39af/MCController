const fs = require('fs');

module.exports = function (token, callback) {
    if (token != undefined) {
        fs.readdir('./data/users/', (err, files) => {
            if (!err) {
                let length_files = 0;
                files.forEach(file => {
                    file = file.split('.');
                    fs.readFile(`./data/users/${file[0]}.json`, 'utf8', function (err, file_data) {
                        if (!err) {
                            datajson = JSON.parse(file_data);
                            if (token == datajson.token) {
                                datajson['status'] = 'successful';
                                callback(datajson);
                            } else {
                                length_files++;
                                if(length_files==files.length){
                                    callback({ 'status': 'error' });
                                }
                            }
                        } else {
                            length_files++;
                            if(length_files==files.length){
                                callback({ 'status': 'error' });
                            }
                        }
                    });
                });
            } else {
                callback({ 'status': 'error' });
            }
        });
    } else {
        callback({ 'status': 'error' });
    }
}