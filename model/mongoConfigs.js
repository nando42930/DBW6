const mongo = require('mongodb');

var MongoClient = mongo.MongoClient;
var db;

module.exports = {

    connect: function (callback) {
        MongoClient.connect('mongodb+srv://DBW6:Ql9Veh9enx7UPVax@clusterdbw.1dbjr.mongodb.net/DBW6?authSource=admin&replicaSet=atlas-bek8xj-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', {useUnifiedTopology: true}, function (err, database) {
            console.log('Connected the database on port 27017');
            db = database.db('DBW6');
            callback(err);
        })
    },
    getDB: function () {
        return db;
    }
}