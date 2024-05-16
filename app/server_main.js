const app = require('../index.js');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const pidusage = require('pidusage');
const jdk_json = require('../data/yservices/jdk.json');
const software_json = require('../data/yservices/software.json');

let mini_console_text = 'no';
let server_error_report = '';
let server_error_report_number = 0;

module.exports.server_start = function () {
    app.loger.log('Server | Starting', 1, 1);
    app.server_debug.check_jdk_files((check_callback) => {
        if (check_callback == 'true') {
            app.server_debug.check_software_files((check_callback) => {
                if (check_callback == 'true') {
                    app.server_debug.check_files('files', (check_callback) => {
                        if (check_callback == 'true') {
                            app.ini.change('./server/server.properties', 'server-port', app.ysql.getData('server_port'), (callback_change) => {
                                if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                    app.ini.change('./server/server.properties', 'server-ip', app.ysql.getData('server_public_address'), (callback_change) => {
                                        if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                            app.ini.change('./server/server.properties', 'allow-nether', app.ysql.getData('server_nether'), (callback_change) => {
                                                if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                    app.ini.change('./server/server.properties', 'force-gamemode', app.ysql.getData('server_force_gamemode'), (callback_change) => {
                                                        if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                            app.ini.change('./server/server.properties', 'spawn-npcs', app.ysql.getData('server_villagers'), (callback_change) => {
                                                                if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                    app.ini.change('./server/server.properties', 'enable-command-block', app.ysql.getData('server_commandblocks'), (callback_change) => {
                                                                        if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                            app.ini.change('./server/server.properties', 'allow-flight', app.ysql.getData('server_fly'), (callback_change) => {
                                                                                if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                                    app.ini.change('./server/server.properties', 'spawn-monsters', app.ysql.getData('server_monster'), (callback_change) => {
                                                                                        if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                                            app.ini.change('./server/server.properties', 'spawn-animals', app.ysql.getData('server_animals'), (callback_change) => {
                                                                                                if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                                                    app.ini.change('./server/server.properties', 'pvp', app.ysql.getData('server_pvp'), (callback_change) => {
                                                                                                        if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                                                            app.ini.change('./server/server.properties', 'online-mode', app.ysql.getData('server_cracked'), (callback_change) => {
                                                                                                                if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                                                                    app.ini.change('./server/server.properties', 'white-list', app.ysql.getData('server_whitelist'), (callback_change) => {
                                                                                                                        if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                                                                            app.ini.change('./server/server.properties', 'difficulty', app.ysql.getData('server_difficulty'), (callback_change) => {
                                                                                                                                if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                                                                                    app.ini.change('./server/server.properties', 'gamemode', app.ysql.getData('server_gamemode'), (callback_change) => {
                                                                                                                                        if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                                                                                            app.ini.change('./server/server.properties', 'max-players', app.ysql.getData('server_slots'), (callback_change) => {
                                                                                                                                                if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                                                                                                    app.ini.change('./server/server.properties', 'spawn-protection', app.ysql.getData('server_spawn_protection'), (callback_change) => {
                                                                                                                                                        if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else if (callback_change == 'true') {
                                                                                                                                                            app.ini.change('./server/server.properties', 'motd', app.ysql.getData('server_motd'), (callback_change) => {
                                                                                                                                                                if (callback_change == 'error') { app.loger.log('Error starting the server', 3, 3); } else {
                                                                                                                                                                    fs.writeFile('./server/eula.txt', "eula=true", 'utf-8', function (err) {
                                                                                                                                                                        if (!err) {
                                                                                                                                                                            app.loger.log('Server | Accept Minecraft EULA!', 1, 2);
                                                                                                                                                                            let start_bat;
                                                                                                                                                                            if (app.ysql.getData('server_software') == 'paper') {
                                                                                                                                                                                if (app.ysql.getData('server_max_ram') < 12) {
                                                                                                                                                                                    start_bat = `@echo off\n"./../java/jdk/${app.ysql.getData('server_jdk')}/bin/java" -Xms${app.ysql.getData('server_min_ram')}G -Xmx${app.ysql.getData('server_max_ram')}G --add-modules=jdk.incubator.vector -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -XX:G1NewSizePercent=40 -XX:G1MaxNewSizePercent=50 -XX:G1HeapRegionSize=16M -XX:G1ReservePercent=15 -jar "./../java/software/${app.ysql.getData('server_software')}-${app.ysql.getData('server_version')}.jar" --nogui`;
                                                                                                                                                                                }
                                                                                                                                                                                if (app.ysql.getData('server_max_ram') >= 12) {
                                                                                                                                                                                    start_bat = `@echo off\n"./../java/jdk/${app.ysql.getData('server_jdk')}/bin/java" -Xms${app.ysql.getData('server_min_ram')}G -Xmx${app.ysql.getData('server_max_ram')}G --add-modules=jdk.incubator.vector -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -jar "./../java/software/${app.ysql.getData('server_software')}-${app.ysql.getData('server_version')}.jar" --nogui`;
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                start_bat = `@echo off\n"./../java/jdk/${app.ysql.getData('server_jdk')}/bin/java" -Xms${app.ysql.getData('server_min_ram')}G -Xmx${app.ysql.getData('server_max_ram')}G -XX:+UseG1GC -jar "./../java/software/${app.ysql.getData('server_software')}-${app.ysql.getData('server_version')}.jar" nogui`;
                                                                                                                                                                            }
                                                                                                                                                                            fs.writeFile(`./server/start.bat`, start_bat, 'utf-8', function (err) {
                                                                                                                                                                                if (!err) {
                                                                                                                                                                                    server_error_report = '';
                                                                                                                                                                                    server_error_report_number = 0;
                                                                                                                                                                                    minecraft = spawn('cmd.exe', ['/C', 'start.bat'], { cwd: './server/' });
                                                                                                                                                                                    exec('tasklist /FI "ImageName eq java.exe" /FO CSV', (error, stdout) => {
                                                                                                                                                                                        if (!error) {
                                                                                                                                                                                            minecraft.pid = stdout.split('"')[13];
                                                                                                                                                                                        } else {
                                                                                                                                                                                            minecraft.pid = undefined;
                                                                                                                                                                                        }
                                                                                                                                                                                    });
                                                                                                                                                                                    app.loger.log('Server | Start', 1, 1);
                                                                                                                                                                                    app.ysql.setData('server_status', 'true', 1);
                                                                                                                                                                                    minecraft.stdout.on('data', function (data) {
                                                                                                                                                                                        if (data != undefined) {
                                                                                                                                                                                            app.addons.addons_files.forEach(file => {
                                                                                                                                                                                                require('../addons/addons/' + file).console(data);
                                                                                                                                                                                            });
                                                                                                                                                                                            mini_console_text = data.toString().replaceAll('\n', '').slice(0, 90);
                                                                                                                                                                                            if (data.indexOf('type "help"') != -1) {
                                                                                                                                                                                                app.ysql.setData('server_is_online', 'true', 0);
                                                                                                                                                                                            }
                                                                                                                                                                                            if (data.indexOf('ERROR') != -1) {
                                                                                                                                                                                                server_error_report += '\n' + data.toString();
                                                                                                                                                                                                server_error_report_number++;
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    });
                                                                                                                                                                                    minecraft.on('exit', (code, signal) => {
                                                                                                                                                                                        exec('taskkill /PID ' + minecraft.pid + ' /F', (error, stdout) => {
                                                                                                                                                                                            app.ysql.setData('server_status', 'false', 1);
                                                                                                                                                                                            app.ysql.setData('server_is_online', 'false', 0);
                                                                                                                                                                                            if (signal) app.loger.log('Server | Killed With Signal: ' + signal, 1, 3);
                                                                                                                                                                                            app.loger.log('Server | Stop', 1, 2);
                                                                                                                                                                                            minecraft.kill();
                                                                                                                                                                                        });
                                                                                                                                                                                    });
                                                                                                                                                                                    module.exports.server = (minecraft);
                                                                                                                                                                                    return (minecraft);
                                                                                                                                                                                } else {
                                                                                                                                                                                    app.loger.log('Error starting the server', 3, 3);
                                                                                                                                                                                }
                                                                                                                                                                            });
                                                                                                                                                                        } else {
                                                                                                                                                                            app.loger.log('Error starting the server', 3, 3);
                                                                                                                                                                        }
                                                                                                                                                                    });
                                                                                                                                                                }
                                                                                                                                                            });
                                                                                                                                                        }
                                                                                                                                                    });
                                                                                                                                                }
                                                                                                                                            });
                                                                                                                                        }
                                                                                                                                    });
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }
                                                                                                                    });
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

module.exports.io = function (socket) {
    socket.on('server_usage', (token, server_usage_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('server_usage') == true) {
                    if (app.ysql.getData('server_status') == 'true') {
                        if (minecraft.pid != undefined) {
                            pidusage(minecraft.pid, (err, stats) => {
                                if (!err) {
                                    if (stats.memory != undefined && stats.cpu != undefined) {
                                        server_usage_callback({ status: 'successful', memory_usage: ((stats.memory / 1024) / 1024), cpu_usage: stats.cpu })
                                    }
                                } else {
                                    server_usage_callback({ status: 'error', message: 'System Get Data Error!' });
                                }
                            });
                        } else {
                            server_usage_callback({ status: 'error', message: 'Server PID Not Found!' });
                        }
                    } else {
                        server_usage_callback({ status: 'error', message: 'Server Is Offline!' });
                    }
                } else {
                    server_usage_callback({ status: 'error', message: 'Permission Require!' });
                }
            } else {
                server_usage_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('server_status', (token, server_status_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('server_status') == true) {
                    jdk_json.jdk.forEach(jdk_versions => {
                        if (jdk_versions.use.includes(app.ysql.getData('server_jdk')) == true) {
                            const stats = fs.statSync(`./java/jdk/${app.ysql.getData('server_jdk')}.zip`);
                            const fileSizeInBytes = stats.size;
                            app.download.get_size(jdk_versions.download, function (totalBytes) {
                                let totalMegabytes = Math.round(totalBytes / 1024 / 1024);
                                let fileSizeInMegabytes = Math.round(fileSizeInBytes / 1024 / 1024);
                                if (totalBytes != fileSizeInBytes) {
                                    server_status_callback({ status: 'successful', server_status_text: app.app_languages(`<h4>` + '${languages:132}' + ` (${app.ysql.getData('server_jdk')})[${fileSizeInMegabytes}MB/${totalMegabytes}MB]</h4>`, app.ysql.getData('app_language')), server_status_color: '#ffc107', server_mini_console_text: 'no', server_status: 'downloading' });
                                } else {
                                    let software_downloads = `${app.ysql.getData('server_software')}-${app.ysql.getData('server_version')}`;
                                    software_json.software.forEach(software => {
                                        software.downloads.forEach(downloads => {
                                            if (software_downloads.includes(software.use + '-' + downloads.version) == true) {
                                                const stats = fs.statSync(`./java/software/${software_downloads}.jar`);
                                                const fileSizeInBytes = stats.size;
                                                app.download.get_size(downloads.download, function (totalBytes) {
                                                    totalMegabytes = Math.round(totalBytes / 1024 / 1024);
                                                    fileSizeInMegabytes = Math.round(fileSizeInBytes / 1024 / 1024);
                                                    if (totalBytes != fileSizeInBytes) {
                                                        server_status_callback({ status: 'successful', server_status_text: app.app_languages(`<h4>` + '${languages:133}' + ` (${app.ysql.getData('server_software')}-${app.ysql.getData('server_version')})[${fileSizeInMegabytes}MB/${totalMegabytes}MB]</h4>`, app.ysql.getData('app_language')), server_status_color: '#ffc107', server_mini_console_text: 'no', server_status: 'downloading' });
                                                    } else {
                                                        if (app.ysql.getData('server_is_online') == 'true') {
                                                            server_status_callback({ status: 'successful', server_status_text: app.app_languages('<h4>${languages:134}</h4>', app.ysql.getData('app_language')), server_status_color: '#198754', server_status: 'online' });
                                                        } else {
                                                            if (app.ysql.getData('server_status') == 'true') {
                                                                server_status_callback({ status: 'successful', server_status_text: app.app_languages('<h4><i class="bx bx-loader-circle rotate"></i> ${languages:135}</h4>', app.ysql.getData('app_language')), server_status_color: '#6c757d', server_mini_console_text: mini_console_text, server_status: 'process' });
                                                            } else {
                                                                server_status_callback({ status: 'successful', server_status_text: app.app_languages('<h4><i class="bx bx-stop-circle"></i> ${languages:22}</h4>', app.ysql.getData('app_language')), server_status_color: '#dc3545', server_status: 'offline' });
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                } else {
                    server_status_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                server_status_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('server_start', (token, server_start_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('server_start') == true) {
                    if (app.ysql.getData('server_status') == 'false') {
                        server_start_callback({ status: 'successful', message: 'Server Is Started!' });
                        app.server_mc.server_start();
                    } else {
                        server_start_callback({ status: 'error', message: 'Server is running, cannot be Run Again' });
                        socket.emit('alert', app.app_languages('${languages:92}', app.ysql.getData('app_language')));
                    }
                } else {
                    server_start_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                server_start_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('server_stop', (token, server_stop_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('server_stop') == true) {
                    if (app.ysql.getData('server_status') == 'true') {
                        server_stop_callback({ status: 'successful', message: 'Server Is Stopped!' });
                        minecraft.stdin.write('stop' + '\r');
                        app.ysql.setData('server_is_online', 'false', 0);
                    } else {
                        server_stop_callback({ status: 'error', message: 'Server is offline' });
                        socket.emit('alert', app.app_languages('${languages:93}', app.ysql.getData('app_language')));
                    }
                } else {
                    server_stop_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                server_stop_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('server_kill', (token, server_kill_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('server_kill') == true) {
                    if (app.ysql.getData('server_status') == 'true') {
                        server_kill_callback({ status: 'successful', message: 'Server Is Stopped!' });
                        minecraft.kill();
                    } else {
                        server_kill_callback({ status: 'error', message: 'Server is offline' });
                        socket.emit('alert', app.app_languages('${languages:93}', app.ysql.getData('app_language')));
                    }
                } else {
                    server_kill_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                }
            } else {
                server_kill_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('server_error_report', (token, server_error_report_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('server_error_report') == true) {
                    if (app.ysql.getData('server_status') == 'false') {
                        server_error_report_callback({ status: 'successful', message: 'Server Error Report Form Load!' });
                        if (server_error_report.split('\n').length != 0) {
                            let report_log_length = 0;
                            let all_report_log = '';
                            server_error_report.split('\n').forEach(report_log => {
                                all_report_log += '<h6>' + report_log.replace('ERROR', '<span style="color:#FF0000;">ERROR</span>') + '</h6>';
                                report_log_length++;
                                if (report_log_length == server_error_report.split('\n').length) {
                                    if (all_report_log != '<h6></h6>') {
                                        socket.emit('modal', {
                                            type: 'create',
                                            title: 'Server Error Report',
                                            body: `<ul style="height: 20rem; background-color: #232323;"
                                    class="text-light rounded p-3 overflow-scroll">
                                    <div id="container">
                                      <ul id="server_error_report_message">
                                      ${all_report_log}
                                      </ul>
                                    </div>
                                  </ul>`,
                                            footer: `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
                                        });
                                    }
                                }
                            });
                        }
                    } else {
                        server_error_report_callback({ status: 'error', message: 'Server is online' });
                    }
                } else {
                    server_error_report_callback({ status: 'error', message: 'Permission Require!' });
                }
            } else {
                server_error_report_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('console_receive', (token, console_receive_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('console_receive') == true) {
                    if (app.ysql.getData('server_status') == 'true') {
                        console_receive_callback({ status: 'successful', message: 'Console Receive Set!' });
                        minecraft.stdout.on('data', function (data) {
                            if (data != undefined) {
                                socket.emit('console_receive', { console_log: data.toString() });
                            }
                        });
                    } else {
                        console_receive_callback({ status: 'error', message: 'Server Is Offline!' });
                    }
                } else {
                    console_receive_callback({ status: 'error', message: 'Permission Require!' });
                }
            } else {
                console_receive_callback({ status: 'error', message: 'User Login Failed!' });
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

    socket.on('console_send_cmd', (token, cmd, console_send_cmd_callback) => {
        app.user_login(token, (user) => {
            if (user.status != 'error') {
                if (user.level_permission.split(',').includes('all') == true || user.level_permission.split(',').includes('console_send_cmd') == true) {
                    if (app.ysql.getData('server_status') == 'true') {
                        if (cmd) {
                            if (cmd != undefined && cmd != 'stop' && cmd != 'restart' && cmd != 'reload' && cmd != '') {
                                console_send_cmd_callback({ status: 'successful', message: 'CMD Insert Into Console!' });
                                minecraft.stdin.write(cmd + '\r');
                            } else {
                                console_send_cmd_callback({ status: 'error', message: 'CMD Not Set' });
                                socket.emit('console_receive', { console_log: 'You do not have permission to use this command here ❌' });
                            }
                        } else {
                            console_send_cmd_callback({ status: 'error', message: 'CMD Not Set' });
                        }
                    } else {
                        console_send_cmd_callback({ status: 'error', message: 'Server Is Offline!' });
                    }
                } else {
                    console_send_cmd_callback({ status: 'error', message: 'Permission Require!' });
                    socket.emit('alert', app.app_languages('${languages:73}', app.ysql.getData('app_language')));
                    socket.emit('console_receive', { console_log: 'You do not have permission to use commands ❌' });
                }
            } else {
                console_send_cmd_callback({ status: 'error', message: 'User Login Failed!' });
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