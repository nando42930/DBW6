const mongoose = require('./mongooseConfigs').mongoose;

//Set the schema
const ticketsSchema = new mongoose.Schema({
    title: String, description: String, answer: String, email: String, state: Boolean, date: Date
});

//Compile the schema into a models
const Tickets = mongoose.model('Tickets', ticketsSchema);

function createTicket(ticketData, cb) {
    const tickets = new Tickets(ticketData);
    //Equivalently as the previous lines, mongoose allows the .then .catch mechanism instead of the callbacks (very similar to JS promises)
    tickets.save()
        .then(doc => cb(doc))
        .catch(err => cb(null, err)); //In this case the callback signature should be changed to include the err parameter
}

function list(ticketsData, cb) {
    Tickets.find({ticketsData}, function (err, docs) {
        cb(docs);
    });
}

function findByTitle(ticketsData, cb) {
    Tickets.findOne({ticketsData}, function (err, doc) {
        cb(doc);
    });
}

function patchTicket (title, ticketData, cb) {
    //status code 204 should be returned if we don't want to send back the updated model
    Tickets.findOneAndUpdate({title}, {ticketData}, function (err, doc) {
        cb(doc);
    });
}

module.exports = {
    createTicket, list, findByTitle, patchTicket, Tickets
}