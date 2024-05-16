const app = require('../index.js');

module.exports.check_data = function (callback) {
    const request = require('request');
    const fs = require('fs');

    app.loger.log('Getting Yservices Data...', 1, 2);

    request.get('https://api.yservices.ir/', (error, resp, body) => {
        if (error) {
            app.loger.log("Can't Connect to Yservices Api [Offline]", 3, 3);
            callback('true');
        } else {
            if (body == undefined) {
                app.loger.log('Get Yservices Status Field [Offline]', 3, 3);
                callback('true');
            } else {
                const respjson = JSON.parse(body);
                if (respjson.status == "202" && respjson.message == "api is online") {
                    app.loger.log('Getting Yservices Data Done!', 1, 1);
                    var checking_status = 0;
                    app.loger.log('Getting Yservices JDK...', 1, 2);
                    request.get('https://api.yservices.ir/data/?id=1009&get=check', (error, resp, body) => {
                        if (error) {
                            app.loger.log("Can't Getting to Yservices Api [Offline]", 3, 3);
                            callback('true');
                        } else {
                            if (body == undefined) {
                                app.loger.log('Getting JDK Data Field [Offline]', 3, 3);
                                callback('true');
                            } else {
                                const respjson_jdk = JSON.parse(body);
                                if (respjson_jdk.status == "202" && respjson_jdk.message == "data exist") {
                                    request.get('https://api.yservices.ir/data/?id=1009&get=data', (error, resp, body) => {
                                        if (error) {
                                            app.loger.log("Can't Getting to Yservices Api [Offline]", 3, 3);
                                            callback('true');
                                        } else {
                                            if (body == undefined) {
                                                app.loger.log('Getting JDK Data Field [Offline]', 3, 3);
                                                callback('true');
                                            } else {
                                                fs.writeFile('./data/yservices/jdk.json', body, function (err) {
                                                    if (err) {
                                                        app.loger.log('Save JDK Data Field', 3, 3);
                                                    } else {
                                                        app.loger.log('Getting JDK Data Done!', 1, 1);
                                                        checking_status++;
                                                        checking_callback();
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });
                    app.loger.log('Getting Yservices Software...', 1, 2);
                    request.get('https://api.yservices.ir/data/?id=1007&get=check', (error, resp, body) => {
                        if (error) {
                            app.loger.log("Can't Getting to Yservices Api [Offline]", 3, 3);
                            callback('true');
                        } else {
                            if (body == undefined) {
                                app.loger.log('Getting Software Data Field [Offline]', 3, 3);
                                callback('true');
                            } else {
                                const respjson_software = JSON.parse(body);
                                if (respjson_software.status == "202" && respjson_software.message == "data exist") {
                                    request.get('https://api.yservices.ir/data/?id=1007&get=data', (error, resp, body) => {
                                        if (error) {
                                            app.loger.log("Can't Getting to Yservices Api [Offline]", 3, 3);
                                            callback('true');
                                        } else {
                                            if (body == undefined) {
                                                app.loger.log('Getting Software Data Field [Offline]', 3, 3);
                                                callback('true');
                                            } else {
                                                fs.writeFile('./data/yservices/software.json', body, function (err) {
                                                    if (err) {
                                                        app.loger.log('Save Software Data Field', 3, 3);
                                                    } else {
                                                        app.loger.log('Getting Software Data Done!', 1, 1);
                                                        checking_status++;
                                                        checking_callback();
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });
                    function checking_callback() {
                        if (checking_status == 2) {
                            callback('true');
                        }
                    }
                } else {
                    app.loger.log('Get Yservices Status Field [Offline]', 3, 3);
                    let err = 'Getting Software Data Field [Offline]';
                    throw err;
                }
            }
        }
    });
}