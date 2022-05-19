var express = require('express');
var userController = require('../controllers/userController');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const router = express.Router();

router.post('/register', jsonParser, function (req, res) {
    userController.insert(req, res);
});

//Let's expose these routes
module.exports = router;