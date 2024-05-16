const app = require('../../index.js');

module.exports.io = function (socket) {
    socket.on('options_change', (token, server_motd, server_spawn_protection, server_slots, server_gamemode, server_difficulty, server_resource_pack, server_whitelist, server_cracked, server_pvp, server_monster, server_fly, server_animals, server_commandblocks, server_villagers, server_force_gamemode, server_nether, options_change_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('options_change') == true) {
                    if (app.ysql.getData('server_status') != 'true') {
                        if (server_motd != undefined && server_spawn_protection >= 0 && server_slots >= 0 && server_gamemode >= 0 && server_difficulty >= 0 && server_resource_pack != undefined && server_whitelist == true || server_whitelist == false && server_cracked == true || server_cracked == false && server_pvp == true || server_pvp == false && server_monster == true || server_monster == false && server_fly == true || server_fly == false && server_animals == true || server_animals == false && server_commandblocks == true || server_commandblocks == false && server_villagers == true || server_villagers == false && server_force_gamemode == true || server_force_gamemode == false && server_nether == true || server_nether == false) {
                            options_change_callback({ status: 'successful', message: 'Options Change Done!' });
                            app.ysql.setData('server_motd', server_motd, 1);
                            app.ysql.setData('server_commandblocks', server_commandblocks.toString(), 1);
                            app.ysql.setData('server_whitelist', server_whitelist.toString(), 1);
                            app.ysql.setData('server_cracked', server_cracked.toString(), 1);
                            app.ysql.setData('server_pvp', server_pvp.toString(), 1);
                            app.ysql.setData('server_fly', server_fly.toString(), 1);
                            app.ysql.setData('server_animals', server_animals.toString(), 1);
                            app.ysql.setData('server_monster', server_monster.toString(), 1);
                            app.ysql.setData('server_villagers', server_villagers.toString(), 1);
                            app.ysql.setData('server_nether', server_nether.toString(), 1);
                            app.ysql.setData('server_force_gamemode', server_force_gamemode.toString(), 1);
                            app.ysql.setData('server_spawn_protection', server_spawn_protection, 1);
                            app.ysql.setData('server_slots', server_slots, 1);
                            app.ysql.setData('server_gamemode', server_gamemode, 1);
                            app.ysql.setData('server_difficulty', server_difficulty, 1);
                            app.ysql.setData('server_resource_pack_url', server_resource_pack, 1);
                            socket.emit('alert', app.app_languages('${languages:88}', app.ysql.getData('app_language')));
                            socket.emit('reload', 'reload');
                        } else {
                            options_change_callback({ status: 'error', message: 'Data Invalid Please Try Again' });
                            socket.emit('alert', app.app_languages('${languages:82}', app.ysql.getData('app_language')));
                        }
                    } else {
                        options_change_callback({ status: 'error', message: 'Server Is Online Please First Turn Off' });
                        socket.emit('alert', app.app_languages('${languages:84}', app.ysql.getData('app_language')));
                    }
                } else {
                    options_change_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }

            } else {
                options_change_callback({ status: 'error', message: 'User Login Failed!' });
                if (socket.handshake.address != '::1') {
                    app.ysql.setData('app_blacklist_ip', app.ysql.getData('app_blacklist_ip') + '\n' + socket.handshake.address, 1);
                    setTimeout(() => {
                        app.ysql.setData('app_blacklist_ip', app.ysql.getData('app_blacklist_ip').replaceAll('\n' + socket.handshake.address, ''), 1);
                    }, 5000);
                }
                socket.emit('go_location', '/login/?errorcode=104');
            }
        });
    });
}