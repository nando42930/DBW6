const mongoose = require('./mongooseConfigs').mongoose;

//Set the schema
const faqSchema = new mongoose.Schema({
    category: String, question: String, answer: String
});

//Compile the schema into a model
const Faq = mongoose.model('Faq', faqSchema);

function createFaq(faqData, cb) {
    const faq = new Faq(faqData);
    //Equivalently as the previous lines, mongoose allows the .then .catch mechanism instead of the callbacks (very similar to JS promises)
    faq.save()
        .then(doc => cb(doc))
        .catch(err => cb(null, err)); //In this case the callback signature should be changed to include the err parameter
}

module.exports = {
    createFaq, Faq
}