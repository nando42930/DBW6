const mongoose = require('./mongooseConfigs').mongoose;

//Set the schema
const supportSchema = new mongoose.Schema({
    username: String, title: String, description: String,
});

//Set the behaviour
supportSchema.methods.verifyusername = function (username) {
    return username === this.username;
}

//Compile the schema into a models
const Support = mongoose.model('Support', supportSchema);

//search all support issues from a certain user
exports.searchUser = (username, cb) => {
    Support.find({username: username})
        .then(doc => cb(doc))
        .catch(err => cb(null, err)); //In this case the callback signature should be changed to include the err parameter
};

exports.createSupport = (supportData, cb) => {
    const support = new Support(supportData);
    //Equivalently as the previous lines, mongoose allows the .then .catch mechanism instead of the callbacks (very similar to JS promises)
    support.save()
        .then(doc => cb(doc))
        .catch(err => cb(null, err)); //In this case the callback signature should be changed to include the err parameter
};