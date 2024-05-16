const fs = require('fs');
const app = require('../index.js');

module.exports.setDataLocation = function (Location, callback) {
    let cache_storage = {};
    let data_location = Location;
    fs.readdir(Location, function (err, files) {
        if (!err) {
            let files_length = 0;
            if (files.length == 0) {
                callback(true);
            } else {
                files.forEach(file => {
                    fs.readFile(Location + '/' + file, 'utf8', function (err, data) {
                        if (!err) {
                            cache_storage[file] = data;
                            files_length++;
                            if (files.length == files_length) {
                                callback(true);
                            }
                        } else {
                            callback(false);
                        }
                    });
                });
            }
        } else {
            callback(false);
        }
    });
    module.exports.getData = function (Key) {
        if (cache_storage[Key] != undefined) {
            return cache_storage[Key];
        }else{
            return undefined;
        }
    }

    module.exports.setData = function (Key, Value, Save) {
        cache_storage[Key] = Value;
        if (Save == 1) {
            fs.writeFile(data_location + '/' + Key, Value, 'utf8', function (err) {
                if (!err) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    }
}