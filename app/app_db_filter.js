module.exports = function (db_data) {
    if(db_data!=undefined){
        db_data = db_data.replace(/"/g,'');
        db_data = db_data.replace(/'/g,'');
        db_data = db_data.replace(/`/g,'');
        return db_data;
    }else{
        return '';
    }
}