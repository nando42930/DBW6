var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var messageController = require('./controller/messageController');
var mongoConfigs = require('./model/mongoConfigs');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('assets'));

var jsonParser = bodyParser.json();

//constants for our view and messenger
const defaultMessage = "Type your message here";
const messengerRoute = '/messenger';
const textboxId = 'typeMessage';
const textboxSelector = '#' + textboxId;
const resultSelector = '#result';

//Setup mongo connection and web server upon callback
mongoConfigs.connect(function (err) {
    if (!err) {
        app.listen(3000, function () {
            console.log("Express web server listening on port 3000");
        });
    }
});

app.get('/', function (req, res) {
    res.render('index');
});

app.post(messengerRoute, jsonParser, function (req, res) {

    //add to mongoDB
    messageController.addMessage(req, function () {

        //We have to send JSON back or the success ajax event does not work
        res.status(200).send({data: 'OK'});

    });
});

app.get('/support', function (req, res) {
    res.render('support');
});

app.get('/tickets', function (req, res) {
    res.render('tickets');
});

app.get('/faq', function (req, res) {
    res.render('faq');
});

app.get('/login', function (req, res) {
    res.render('login');
});