const app = require('../index.js');
const fs = require('fs');

module.exports.check_files = function (callback) {
    app.loger.log('Checking App Files...', 1, 2);
    if (!fs.existsSync('./addons/addons')) {
        fs.mkdirSync('./addons/addons');
    }
    if (!fs.existsSync('./addons/data')) {
        fs.mkdirSync('./addons/data');
    }
    if (!fs.existsSync('./data/users')) {
        fs.mkdirSync('./data/users');
    }
    if (!fs.existsSync('./data/yservices')) {
        fs.mkdirSync('./data/yservices');
    }
    if (!fs.existsSync('./data/ysql')) {
        fs.mkdirSync('./data/ysql');
    }
    if (!fs.existsSync('./server')) {
        fs.mkdirSync('./server');
    }
    setTimeout(() => {
        check_ysql_data(function (callback_check) {
            if (callback_check == 'true') {
                app.loger.log('Checking App Files Done!', 1, 1);
                callback('true');
            }
        });
    }, 100);
}

function check_ysql_data(callback_check) {
    if (app.ysql.getData('server_motd') == undefined) {
        app.ysql.setData('server_motd', 'Best Minecraft Server', 1);
    }
    if (app.ysql.getData('server_commandblocks') == undefined) {
        app.ysql.setData('server_commandblocks', 'false', 1);
    }
    if (app.ysql.getData('server_whitelist') == undefined) {
        app.ysql.setData('server_whitelist', 'false', 1);
    }
    if (app.ysql.getData('server_cracked') == undefined) {
        app.ysql.setData('server_cracked', 'true', 1);
    }
    if (app.ysql.getData('server_pvp') == undefined) {
        app.ysql.setData('server_pvp', 'true', 1);
    }
    if (app.ysql.getData('server_fly') == undefined) {
        app.ysql.setData('server_fly', 'false', 1);
    }
    if (app.ysql.getData('server_animals') == undefined) {
        app.ysql.setData('server_animals', 'true', 1);
    }
    if (app.ysql.getData('server_monster') == undefined) {
        app.ysql.setData('server_monster', 'true', 1);
    }
    if (app.ysql.getData('server_villagers') == undefined) {
        app.ysql.setData('server_villagers', 'true', 1);
    }
    if (app.ysql.getData('server_nether') == undefined) {
        app.ysql.setData('server_nether', 'true', 1);
    }
    if (app.ysql.getData('server_force_gamemode') == undefined) {
        app.ysql.setData('server_force_gamemode', 'false', 1);
    }
    if (app.ysql.getData('server_spawn_protection') == undefined) {
        app.ysql.setData('server_spawn_protection', '16', 1);
    }
    if (app.ysql.getData('server_slots') == undefined) {
        app.ysql.setData('server_slots', '20', 1);
    }
    if (app.ysql.getData('server_gamemode') == undefined) {
        app.ysql.setData('server_gamemode', '0', 1);
    }
    if (app.ysql.getData('server_difficulty') == undefined) {
        app.ysql.setData('server_difficulty', '2', 1);
    }
    if (app.ysql.getData('server_resource_pack_url') == undefined) {
        app.ysql.setData('server_resource_pack_url', '', 1);
    }
    if (app.ysql.getData('server_min_ram') == undefined) {
        app.ysql.setData('server_min_ram', '', 1);
    }
    if (app.ysql.getData('server_max_ram') == undefined) {
        app.ysql.setData('server_max_ram', '', 1);
    }
    if (app.ysql.getData('server_version') == undefined) {
        app.ysql.setData('server_version', '', 1);
    }
    if (app.ysql.getData('server_jdk') == undefined) {
        app.ysql.setData('server_jdk', '', 1);
    }
    if (app.ysql.getData('server_software') == undefined) {
        app.ysql.setData('server_software', '', 1);
    }
    if (app.ysql.getData('server_eula') == undefined) {
        app.ysql.setData('server_eula', '', 1);
    }
    if (app.ysql.getData('server_status') == undefined || app.ysql.getData('server_status') == '') {
        app.ysql.setData('server_status', 'false', 1);
    }
    if (app.ysql.getData('server_port') == undefined) {
        app.ysql.setData('server_port', '25565', 1);
    }
    if (app.ysql.getData('server_public_address') == undefined) {
        app.ysql.setData('server_public_address', 'localhost', 1);
    }
    if (app.ysql.getData('app_language') == undefined || app.ysql.getData('app_language') == '') {
        app.ysql.setData('app_language', 'US-en', 1);
    }
    if (app.ysql.getData('app_server_name') == undefined) {
        app.ysql.setData('app_server_name', '', 1);
    }
    if (app.ysql.getData('app_setup') == undefined || app.ysql.getData('app_setup') == '') {
        app.ysql.setData('app_setup', '0', 1);
    }
    if (app.ysql.getData('app_theme') == undefined || app.ysql.getData('app_theme') == '') {
        app.ysql.setData('app_theme', 'default', 1);
    }
    if (app.ysql.getData('app_connection_type') == undefined || app.ysql.getData('app_connection_type') == '') {
        app.ysql.setData('app_connection_type', 'private', 1);
    }
    if (app.ysql.getData('app_blacklist_ip') == undefined) {
        app.ysql.setData('app_blacklist_ip', '', 1);
    }
    if (app.ysql.getData('app_version') == undefined || app.ysql.getData('app_version') == '') {
        app.ysql.setData('app_version', '2.30', 1);
    }
    app.ysql.setData('is_online', 'false', 0);
    callback_check('true');
}