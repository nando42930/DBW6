var mongoConfigs = require('./mongoConfigs');

function insertMessage(message, callback) {
    var db = mongoConfigs.getDB();
    db.collection('DBW6').insertOne({message: message}, function (err, result) {
        callback(err, result);
    });
}

module.exports = {
    insertMessage
};