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
    res.render('index',
        //data to be passed to the view
        {
            data: {
                messengerRoute: messengerRoute,
                resultSelector: resultSelector,
                textboxSelector: textboxSelector,
                textboxId: textboxId,
                defaultMessage: defaultMessage
            }
        });
});

app.post(messengerRoute, jsonParser, function (req, res) {

    //add to mongoDB
    messageController.addMessage(req, function () {

        //We have to send JSON back or the success ajax event does not work
        res.status(200).send({data: 'OK'});

    });
});