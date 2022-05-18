const mongoose = require('mongoose');
require('dotenv/config');

mongoose.connect(process.env.DB_CONNECTION)
    .then(()=>{
        console.log('MongoDB is connected')
    });

exports.mongoose = mongoose;