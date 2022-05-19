const UserModel = require('../models/user');

//The callback code could have been refactored in to a single function
exports.insert = (req, res) => {
    UserModel.createUser(req.body, (doc, err) => {
        if (!err) res.status(201).send({id: doc._id});
        else res.status(500).send({message: err.message});
    });
};