const SupportModel = require('../models/support');

function createSupport (req, callback) {
    SupportModel.createSupport({title: req.body.title, description: req.body.description}, callback);
}

function list(req, callback) {
    SupportModel.list({}, callback);
}

module.exports = {
    createSupport,
    list
};