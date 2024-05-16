const app = require('../index.js');

addons_lists = '';
module.exports.add_list = function (html) {
    addons_lists += html;
}
module.exports.list = function (level_permission, location, callback) {
    let nav_list = '';
    if (level_permission != undefined && location != undefined) {
        if (level_permission.includes('all') == true || level_permission.includes('server') == true) {
            let active = '';
            if (location == 'server') active = ' active';
            nav_list = nav_list + '<a href="/server/server/" id="side_server" class="nav_link' + active + '"> <i class="bx bx-power-off nav_icon"></i> <span class="nav_name">${languages:13}</span> </a>';
        }
        if (level_permission.includes('all') == true || level_permission.includes('options') == true) {
            let active = '';
            if (location == 'options') active = ' active';
            nav_list = nav_list + '<a href="/server/options/" id="side_options" class="nav_link' + active + '"> <i class="bx bx-slider-alt nav_icon"></i> <span class="nav_name">${languages:32}</span> </a>';
        }
        if (level_permission.includes('all') == true || level_permission.includes('console') == true) {
            let active = '';
            if (location == 'console') active = ' active';
            nav_list = nav_list + '<a href="/server/console/" id="side_console" class="nav_link' + active + '"> <i class="bx bx-terminal nav_icon"></i> <span class="nav_name">${languages:21}</span> </a>';
        }
        if (level_permission.includes('all') == true || level_permission.includes('logs') == true) {
            let active = '';
            if (location == 'logs') active = ' active';
            nav_list = nav_list + '<a href="/server/logs/" id="side_logs" class="nav_link' + active + '"> <i class="bx bx-receipt nav_icon"></i> <span class="nav_name">${languages:24}</span> </a>';
        }
        if (level_permission.includes('all') == true || level_permission.includes('files') == true) {
            let active = '';
            if (location == 'files') active = ' active';
            nav_list = nav_list + '<a href="/server/files/" id="side_files" class="nav_link' + active + '"> <i class="bx bx-file nav_icon"></i> <span class="nav_name">${languages:23}</span> </a>';
        }
        if (level_permission.includes('all') == true || level_permission.includes('general_settings') == true) {
            let active = '';
            if (location == 'general_settings') active = ' active';
            nav_list = nav_list + '<a onclick="general_settings_form();" href="javascript:void(0)" id="side_general_settings" class="nav_link' + active + '"> <i class="bx bx-box nav_icon"></i> <span class="nav_name">${languages:94}</span> </a>';
        }
        if (level_permission.includes('all') == true || level_permission.includes('profile') == true) {
            let active = '';
            if (location == 'profile') active = ' active';
            nav_list = nav_list + `<a onclick="profile_form();" href="javascript:void(0)" id="side_profile" class="nav_link${active}"> <i class="bx bx-user nav_icon"></i> <span class="nav_name">`+'${languages:95}</span> </a>';
        }
        if (level_permission.includes('all') == true || level_permission.includes('access') == true) {
            let active = '';
            if (location == 'access') active = ' active';
            nav_list = nav_list + '<a href="/server/access/" id="side_access" class="nav_link' + active + '"> <i class="bx bx-lock nav_icon"></i> <span class="nav_name">${languages:14}</span> </a>';
        }
    }
    callback(app.app_languages(nav_list + `<script type="text/javascript">
    //profile form
    function profile_form() {
        socket.emit('profile_form', localStorage.getItem('token'), (profile_form_callback) => {
            if (profile_form_callback.status == 'successful') {
                loger('[Profile Form] ' + profile_form_callback.message, 1);
            } else {
                loger('[Profile Form] ' + profile_form_callback.message, 3);
            }
        });
    }

    //profile change password form
    function change_password_form() {
      socket.emit('change_password_form', localStorage.getItem('token'), (change_password_form_callback) => {
        if (change_password_form_callback.status == 'successful') {
            loger('[Change Password Form] ' + change_password_form_callback.message, 1);
        } else {
            loger('[Change Password Form] ' + change_password_form_callback.message, 3);
        }
      });
    }

    //profile change password
    function change_password() {
      const last_password = document.getElementById('chlastpassword');
      const new_password = document.getElementById('chnewpassword');
      socket.emit('change_password', localStorage.getItem('token'), last_password.value, new_password.value, (change_password_callback) => {
        if (change_password_callback.status == 'successful') {
            loger('[Change Password] ' + change_password_callback.message, 1);
        } else {
            loger('[Change Password] ' + change_password_callback.message, 3);
        }
      });
    }

    //general settings form
    function general_settings_form() {
        socket.emit('general_settings_form', localStorage.getItem('token'), (general_settings_form_callback) => {
            if (general_settings_form_callback.status == 'successful') {
                loger('[General Settings Form] ' + general_settings_form_callback.message, 1);
            } else {
                loger('[General Settings Form] ' + general_settings_form_callback.message, 3);
            }
        });
    }

    //general settings change form
    function general_settings_change_form() {
        socket.emit('general_settings_change_form', localStorage.getItem('token'), (general_settings_change_form_callback) => {
            if (general_settings_change_form_callback.status == 'successful') {
                loger('[General Settings Change Form] ' + general_settings_change_form_callback.message, 1);
            } else {
                loger('[General Settings Change Form] ' + general_settings_change_form_callback.message, 3);
            }
        });
    }
    
    //general settings change
    function general_settings_change() {
        const port = document.getElementById('port');
        const public_address = document.getElementById('public_address');
        const min_ram = document.getElementById('min_ram');
        const max_ram = document.getElementById('max_ram');
        const server_name = document.getElementById('server_name');
        const language = document.getElementById('language');
        const connection = document.getElementById('connection');
        socket.emit('general_settings_change', localStorage.getItem('token'), port.value, public_address.value, min_ram.value, max_ram.value, server_name.value, language.value, connection.value, (general_settings_change_callback) => {
            if (general_settings_change_callback.status == 'successful') {
                loger('[General Settings Change] ' + general_settings_change_callback.message, 1);
            } else {
                loger('[General Settings Change] ' + general_settings_change_callback.message, 3);
            }
        });
    }

    //general settings software change form
    function general_settings_software_change_form() {
        socket.emit('general_settings_software_change_form', localStorage.getItem('token'), (general_settings_software_change_form_callback) => {
            if (general_settings_software_change_form_callback.status == 'successful') {
                loger('[General Settings Software Change Form] ' + general_settings_software_change_form_callback.message, 1);
            } else {
                loger('[General Settings Software Change Form] ' + general_settings_software_change_form_callback.message, 3);
            }
        });
    }

    //general settings software change form2
    function general_settings_software_change_form2() {
        const software = document.getElementById('software');
        socket.emit('general_settings_software_change_form2', localStorage.getItem('token'), software.value, (general_settings_software_change_form2_callback) => {
            if (general_settings_software_change_form2_callback.status == 'successful') {
                loger('[General Settings Software Change Form2] ' + general_settings_software_change_form2_callback.message, 1);
            } else {
                loger('[General Settings Software Change Form2] ' + general_settings_software_change_form2_callback.message, 3);
            }
        });
    }
    
    //general settings software change
    function general_settings_software_change(software) {
        const version = document.getElementById('version');
        const eula = document.getElementById('eula');
        socket.emit('general_settings_software_change', localStorage.getItem('token'), software, version.value, eula.value, (general_settings_software_change_callback) => {
            if (general_settings_software_change_callback.status == 'successful') {
                loger('[General Settings Software Change] ' + general_settings_software_change_callback.message, 1);
            } else {
                loger('[General Settings Software Change] ' + general_settings_software_change_callback.message, 3);
            }
        });
    }

    //general settings engine change form
    function general_settings_jdk_change_form() {
        socket.emit('general_settings_jdk_change_form', localStorage.getItem('token'), (general_settings_jdk_change_form_callback) => {
            if (general_settings_jdk_change_form_callback.status == 'successful') {
                loger('[General Settings Engine Change Form] ' + general_settings_jdk_change_form_callback.message, 1);
            } else {
                loger('[General Settings Engine Change Form] ' + general_settings_jdk_change_form_callback.message, 3);
            }
        });
    }
    
    //general settings engine change
    function general_settings_jdk_change() {
        const jdk = document.getElementById('jdk');
        socket.emit('general_settings_jdk_change', localStorage.getItem('token'), jdk.value, (general_settings_jdk_change_callback) => {
            if (general_settings_jdk_change_callback.status == 'successful') {
                loger('[General Settings Engine Change] ' + general_settings_jdk_change_callback.message, 1);
            } else {
                loger('[General Settings Engine Change] ' + general_settings_jdk_change_callback.message, 3);
            }
        });
    }
    </script>`+addons_lists,app.ysql.getData('app_language')));
}