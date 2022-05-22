const TicketsModel = require('../models/tickets');

//we take care of the request here not in the route, i.e. req.body.message is here, this is the job of the controller, take care of requests
function insert(req, callback) {
    TicketsModel.createTicket({
        title: req.body.title,
        description: req.body.description,
        email: req.body.email,
        state: req.body.state,
        date: req.headers["Date"]
    }, callback);
}

module.exports = {
    insert
}