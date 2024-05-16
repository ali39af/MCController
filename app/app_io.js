const app = require('../index.js');
const fs = require('fs');

module.exports.start_io = function (callback) {
    app.loger.log('IO Connection Starting...', 1, 2);
    fs.readdir('./app/sockets', function (err, files_sockets) {
        if (!err) {
            app.io.on('connection', (socket) => {
                if (app.ysql.getData('app_connection_type') == 'private') {
                    if (socket.handshake.address != '::1') {
                        return;
                    }
                }
                if (app.ysql.getData('app_blacklist_ip').split('\n').includes(socket.handshake.address) == true) {
                    socket.emit('alert', app.app_languages('${languages:1}\n${languages:2}\n${languages:3}', app.ysql.getData('app_language')));
                } else {
                    socket.emit('connected');
                    app.server_mc.io(socket);
                    files_sockets.forEach(file => {
                        require('./sockets/' + file).io(socket);
                    });
                    app.addons.addons_files.forEach(file => {
                        require('../addons/addons/' + file).io(socket);
                    });
                }
            });
            app.loger.log('IO Connection Started!', 1, 1);
            callback('true');
        } else {
            app.loger.log('Loading IO Files Socket Failed!', 3, 3);
        }
    });
}