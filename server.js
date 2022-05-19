var express = require('express');
var bodyParser = require('body-parser');
var supportController = require('./controllers/supportController');
var messageController = require('./controllers/messageController');
var userController = require('./controllers/userController');
const session = require("express-session");
const passport = require("passport");
const User = require("./models/user").User;
const LocalStrategy = require("passport-local").Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const port = process.env.PORT || 8080;

var app = express();
const server = require("http").createServer(app);
app.set('view engine', 'ejs');
app.use(express.static('assets'));
var jsonParser = bodyParser.json();

const sessionMiddleware = session({ secret: "changeit", resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

//constants for our view and messenger
const defaultMessage = "Type your message here";
const messengerRoute = '/messenger';
const textboxId = 'typeMessage';
const textboxSelector = '#' + textboxId;
const resultSelector = '#result';

server.listen(port, function () {
    console.log(`Application running @ http://localhost:${port}`);
});

app.get("/", (req, res) => {
    const isAuthenticated = !!req.user;
    if (isAuthenticated) {
        console.log(`User authenticated. Session ID: ${req.session.id}`);
    } else {
        console.log("Unknown user.");
    }
    res.render(isAuthenticated ? "index" : "index", { root: __dirname });
});

app.get('/register', ensureLoggedOut('/'), function (req, res) {
    res.render('register');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/support', function (req, res) {
    res.render('support');
});

app.get('/newSupport', function (req, res) {
    res.render('newSupport');
});

app.get('/chatSupport', function (req, res) {
    res.render('chatSupport');
});

app.get('/tickets', function (req, res) {
    res.render('tickets');
});

app.get('/newTicket', function (req, res) {
    res.render('newTicket');
});

app.get('/checkTicket', function (req, res) {
    res.render('checkTicket');
});

app.get('/ticket', function (req, res) {
    res.render('ticket');
});

app.get('/faq', function (req, res) {
    res.render('faq');
});

app.get('/answerTicket', function (req, res) {
    res.render('answerTicket');
});

app.get('/newFAQ', function (req, res) {
    res.render('newFAQ');
});

app.post("/register", jsonParser, function(req,res){
    userController.insert(req, function () {
        //We have to send JSON back or the success ajax event does not work
        // res.status(200).send({data: 'OK'});
        res.redirect(307, '/login');
    });
});

app.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);

app.post(messengerRoute, jsonParser, function (req, res) {
    //add to mongoDB
    messageController.addMessage(req, function () {
        //We have to send JSON back or the success ajax event does not work
        res.status(200).send({data: 'OK'});
    });
});

app.post('/newSupport', function (req, res) {
    supportController.createSupport(req, function () {
        res.redirect(307, '/chatSupport');
    })
});

passport.serializeUser((user, cb) => {
    console.log(`serializeUser ${user.id}`);
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    console.log(`deserializeUser ${id}`);
    User.findById(id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

const io = require('socket.io')(server);

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
    if (socket.request.user) {
        next();
    } else {
        next(new Error('unauthorized'))
    }
});

io.on('connect', (socket) => {
    console.log(`new connection ${socket.id}`);
    socket.on('whoami', (cb) => {
        cb(socket.request.user.username);
    });

    const session = socket.request.session;
    console.log(`saving sid ${socket.id} in session ${session.id}`);
    session.socketId = socket.id;
    session.save();

    //Chat
    socket.on("join", function () {
        console.log(socket.request.user.username + " joined server");
        io.emit("update", socket.request.user.username + " has joined the server.");
    });


    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        var mensagem = {msg: msg, id: socket.request.user.username};
        io.emit('chat message', mensagem);
    })

});

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