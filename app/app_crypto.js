const crypto = require('crypto');

module.exports.sha512_hash = function(data, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(data);
    var value = hash.digest('hex');
    return {
        salt:salt,
        dataHash:value
    };
};