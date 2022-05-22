const mongoose = require('./mongooseConfigs').mongoose;

//Set the schema
const ticketsSchema = new mongoose.Schema({
    title: String, description: String, email: String, state: Boolean, date: Date
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

module.exports = {
    createTicket, Tickets
}