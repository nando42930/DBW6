var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var messageController = require('./controller/messageController');
var mongoConfigs = require('./model/mongoConfigs');
const session = require("express-session");
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const passport = require("passport");

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('assets'));
var jsonParser = bodyParser.json();

const sessionMiddleware = session({ secret: "changeit", resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
const LocalStrategy = require("passport-local").Strategy;

const mongoose = require('./model/mongoConfigs').mongoose;

//constants for our view and messenger
const defaultMessage = "Type your message here";
const messengerRoute = '/messenger';
const textboxId = 'typeMessage';
const textboxSelector = '#' + textboxId;
const resultSelector = '#result';

app.listen(3000, function () {
    console.log("Express web server listening on port 3000");
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

app.get('/answerTicket', function (req, res) {
    res.render('answerTicket');
});

app.get('/chatSupport', function (req, res) {
    res.render('chatSupport');
});

app.get('/checkTicket', function (req, res) {
    res.render('checkTicket');
});

app.get('/newFAQ', function (req, res) {
    res.render('newFAQ');
});

app.get('/newSupport', function (req, res) {
    res.render('newSupport');
});

app.get('/newTicket', function (req, res) {
    res.render('newTicket');
});

app.get('/register', ensureLoggedOut('/'), function (req, res) {
    res.render('register');
});

app.get('/ticket', function (req, res) {
    res.render('ticket');
});

//Set the schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

//Compile the schema into a model
const User = mongoose.model('User', userSchema);

//Set the behaviour
userSchema.methods.verifyPassword = function (password) {
    return password === this.password;
}

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);

app.post("/register",function(req,res){
    //New User in the DB
    const instance = new User({ username: req.body.username, password: req.body.password });
    instance.save(function (err, instance) {
        if (err) return console.error(err);

        //Let's redirect to the login post which has auth
        res.redirect(307, '/login');
    });
});