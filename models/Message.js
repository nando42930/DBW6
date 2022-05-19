var mongoose = require('./mongooseConfigs').mongoose;

function insertMessage(message, callback) {
    mongoose.connection.db.collection('DBW6').insertOne({message: message}, function (err, result) {
        callback(err, result);
    });
}

module.exports = {
    insertMessage
};