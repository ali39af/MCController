const app = require('../index.js');

module.exports.check_jdk_files = function (callback) {
    app.loger.log('Checking JDK Engines Files...', 1, 2);
    const jdk_json = require('../data/yservices/jdk.json');
    const fs = require('fs');
    const AdmZip = require('adm-zip');

    async function unzip_jdk_files(filepath, outputDir) {
        let filepath_save = filepath;
        try {
            app.loger.log('Fixing JDK Files...', 1, 2);
            const zip = new AdmZip(filepath);
            zip.extractAllTo(outputDir);
            app.loger.log('Fixing JDK Files Successfully', 1, 1);
            callback('true');
        } catch (e) {
            app.loger.log(`Fixing JDK Files ${e}`, 3, 3);
            fs.unlinkSync(filepath_save);
            app.loger.log('Run Again Program', 2, 2);
            throw err;
        }
    }

    jdk_json.jdk.forEach(jdk_version => {
        if (app.ysql.getData('server_jdk').includes(jdk_version.use) == true) {
            if (fs.existsSync(`./java/jdk/${jdk_version.use}`)) {
                app.loger.log(`Checking ${jdk_version.use} Files Successfully!`, 1, 1);
                callback('true');
            } else {
                app.download.download(jdk_version.download, `./java/jdk/${jdk_version.use}.zip`, (download_callback) => {
                    if (download_callback == 'true') {
                        app.loger.log(`Downloading ${jdk_version.use}.zip Done!`, 1, 1);
                        unzip_jdk_files(`./java/jdk/${jdk_version.use}.zip`, './java/jdk');
                    }
                });
            }
        }
    });
}

module.exports.check_software_files = function (callback) {
    app.loger.log('Checking Software Files...', 1, 2);
    const software_json = require('../data/yservices/software.json');

    let software_downloads = `${app.ysql.getData('server_software')}-${app.ysql.getData('server_version')}`;
    software_json.software.forEach(software => {
        software.downloads.forEach(downloads => {
            if (software_downloads.includes(software.use + '-' + downloads.version) == true) {
                app.download.download(downloads.download, `./java/software/${software.use}-${downloads.version}.jar`, (download_callback) => {
                    if (download_callback == 'true') {
                        app.loger.log(`Downloading ${software.use}-${downloads.version}.jar Done!`, 1, 1);
                        app.loger.log('Checking Software Files Done!', 1, 1);
                        callback('true');
                    }
                });
            }
        });
    });
}

module.exports.check_files = function (type, callback) {
    app.loger.log('Checking Servers...', 1, 2);
    const fs = require('fs');
    const AdmZip = require('adm-zip');

    async function unzip_server_files(filepath) {
        try {
            app.loger.log('Fixing Server Files...', 1, 2);
            const zip = new AdmZip(filepath);
            zip.extractAllTo('./server/');
            app.loger.log('Fixing Server Files Successfully', 1, 1);
            app.loger.log('Checking Server Files Done!', 1, 1);
            callback('true');
        } catch (e) {
            app.loger.log(`Fixing Server Files Error: ${e}`, 3, 3);
            throw err;
        }
    }

    app.loger.log('Checking Server Files', 1, 2);
    if (app.ysql.getData('server_status') == 'true' && type == 'all') {
        app.loger.log('A possible crash was found communicating with server.js', 2, 2);
        app.server_mc.server_start();
    }
    if (fs.existsSync('./server/')) {
        fs.readdir('./server/', (err, data) => {
            if (!err) {
                if (data.includes('eula.txt') == false || data.includes('server.properties') == false || data.includes('server-icon.png') == false || data.includes('logs') == false || data.includes('start.bat') == false) {
                    unzip_server_files('./data/default_src/server_de.zip');
                } else {
                    app.loger.log('Checking Server Files Done!', 1, 1);
                    callback('true');
                }
            } else {
                app.loger.log('Server Files Check Error!', 3, 3);
                throw err;
            }
        });
    } else {
        unzip_server_files('./data/default_src/server_de.zip');
    }
}