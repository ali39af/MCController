const app = require('../index.js');
const request = require('request');
const fs = require('fs');
const cliProgress = require('cli-progress');
const { XMLHttpRequest } = require('xmlhttprequest');

module.exports.download = function (url, filename, callback) {
    const progressBar = new cliProgress.SingleBar({
        format: '{bar} {percentage}% | ETA: {eta}s'
    }, cliProgress.Presets.shades_classic);
    if (fs.existsSync(filename)) {
        const stats = fs.statSync(filename);
        const fileSizeInBytes = stats.size;
        app.download.get_size(url, function (totalBytes) {
            if (totalBytes != fileSizeInBytes) {
                app.loger.log(`Downloading For Update ${filename} Started`, 1, 2);
                const file = fs.createWriteStream(filename);
                let receivedBytes = 0
                request.get(url)
                    .on('response', (response) => {
                        const totalBytes = response.headers['content-length'];
                        progressBar.start(totalBytes, 0);
                    })
                    .on('data', (chunk) => {
                        receivedBytes += chunk.length;
                        progressBar.update(receivedBytes);
                    })
                    .pipe(file)
                    .on('error', (err) => {
                        fs.unlinkSync(filename);
                        progressBar.stop();
                        return callback('false');
                    });

                file.on('finish', () => {
                    progressBar.stop();
                    file.close();
                    callback('true');
                });

                file.on('error', (err) => {
                    fs.unlinkSync(filename);
                    progressBar.stop();
                    return callback('false');
                });
            } else {
                callback('true');
            }
        });
    } else {
        app.loger.log(`Downloading ${filename} Started`, 1, 2);
        const file = fs.createWriteStream(filename);
        let receivedBytes = 0;

        request.get(url)
            .on('response', (response) => {
                const totalBytes = response.headers['content-length'];
                progressBar.start(totalBytes, 0);
            })
            .on('data', (chunk) => {
                receivedBytes += chunk.length;
                progressBar.update(receivedBytes);
            })
            .pipe(file)
            .on('error', (err) => {
                fs.unlinkSync(filename);
                progressBar.stop();
                return callback('false');
            });

        file.on('finish', () => {
            progressBar.stop();
            file.close();
            callback('true');
        });

        file.on('error', (err) => {
            fs.unlinkSync(filename);
            progressBar.stop();
            return callback('false');
        });
    }
}

module.exports.get_size = function (url, callback) {
    let save_url_size = url.replaceAll('/','');
    save_url_size = save_url_size.replaceAll(':','');
    save_url_size = save_url_size.replaceAll('.','');
    if (app.ysql.getData(save_url_size) == undefined) {
        const xhr = new XMLHttpRequest();
        xhr.open("HEAD", url, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == this.DONE) {
                if(parseInt(xhr.getResponseHeader("Content-Length")).toString()!='NaN') app.ysql.setData(save_url_size,parseInt(xhr.getResponseHeader("Content-Length")).toString(),1);
                callback(parseInt(xhr.getResponseHeader("Content-Length")));
            }
        };
        xhr.send();
    }else{
        callback(app.ysql.getData(save_url_size));
    }
}