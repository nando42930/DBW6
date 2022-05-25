const TicketsModel = require('../models/tickets');

//we take care of the request here not in the route, i.e. req.body.message is here, this is the job of the controller, take care of requests
function insert(req, callback) {
    TicketsModel.createTicket({
        title: req.body.title,
        description: req.body.description,
        answer: null,
        email: req.body.email,
        state: true,
        date: new Date(),
    }, callback);
}

function list(req, callback) {
    TicketsModel.list({category: req.body.category}, callback);
}

function findByTitle(req, callback) {
    TicketsModel.findByTitle({}, callback);
}

function patchByTitle(req, callback) {
    TicketsModel.patchTicket({title: req.body.title}, {answer: req.body.answer, state: false}, callback);
}

module.exports = {
    insert, list, findByTitle, patchByTitle
}