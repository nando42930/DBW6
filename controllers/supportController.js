const SupportModel = require('../models/support');

//The callback code could have been refactored in to a single function
function search (req, callback) {
    SupportModel.searchUser(req.body.username, callback);
}

function createSupport (req, callback) {
    SupportModel.createSupport({username: req.body.username, title: req.body.title, description: req.body.description}, callback);
}

module.exports = {
    createSupport,
    search
};