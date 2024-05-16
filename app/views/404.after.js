const app = require('../../index.js');
const fs = require('fs');

let html_error_404 = '';

module.exports.load = function (callback) {
    fs.readFile(`./themes/${app.ysql.getData('app_theme')}/404.html`,'utf8', function(err, data){
        if(!err){
            html_error_404 = data;
            app.app.get('*', function (req, res) {
                if (app.ysql.getData('app_connection_type') == 'private') {
                    if (req.ipInfo.ip != '::1') {
                        return;
                    }
                }
                res.status(404).send(app.app_languages(html_error_404,app.ysql.getData('app_language')));
            });
            app.app.post('*', function (req, res) {
                if (app.ysql.getData('app_connection_type') == 'private') {
                    if (req.ipInfo.ip != '::1') {
                        return;
                    }
                }
                res.status(404).send(app.app_languages(html_error_404,app.ysql.getData('app_language')));
            });
            app.loger.log('Loading View 404 Done!',1,1);
            callback('true');
        }else{
            app.loger.log('Loading View 404 Failed!',3,3);
        }
    });
}