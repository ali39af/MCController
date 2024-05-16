const app = require('../../index.js');

module.exports.load = function (callback) {
    app.app.get('/logout/', function (req, res) {
        if (app.ysql.getData('app_connection_type') == 'private') {
            if (req.ipInfo.ip != '::1') {
                return;
            }
        }
        res.send('<script>localStorage.setItem("token","noon");window.location.replace("/login/?errorcode=103");</script>');
    });
    app.loger.log('Loading View Logout Done!', 1, 1);
    callback('true');
}