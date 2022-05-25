const mongoose = require('./mongooseConfigs').mongoose;

//Set the schema
const messageSchema = new mongoose.Schema({
    title: String, message: String
});

//Compile the schema into a models
const Message = mongoose.model('Message', messageSchema);

function insert(messageData, cb) {
    const message = new Message(messageData);
    message.save({message: messageData}, function (err, result) {
        cb(err, result);
    });
}

module.exports = {
    insert
};