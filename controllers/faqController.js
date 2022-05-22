const FaqModel = require('../models/faq');

//we take care of the request here not in the route, i.e. req.body.message is here, this is the job of the controller, take care of requests
function insert(req, callback) {
    FaqModel.createFaq({
        category: req.body.category, question: req.body.question, answer: req.body.answer, pinned: req.body.pinned
    }, callback);
}

module.exports = {
    insert
}