const MessageModel = require('../models/Message');

//we take care of the request here not in the route, i.e. req.body.message is here, this is the job of the controller, take care of requests
function addMessage(req, callback) {
    MessageModel.insert(req.body.message, callback);
}

module.exports = {
    addMessage
};