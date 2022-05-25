var express = require('express');
var bodyParser = require('body-parser');
var supportController = require('./controllers/supportController');
var userController = require('./controllers/userController');
var faqController = require('./controllers/faqController');
var ticketsController = require('./controllers/ticketsController');
const session = require("express-session");
const passport = require("passport");
const User = require("./models/user").User;
const LocalStrategy = require("passport-local").Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const port = process.env.PORT || 8080;

var app = express();
const server = require("http").createServer(app);
// Setting up Embedded JavaScript Template Engine
app.set('view engine', 'ejs');
app.use(express.static('assets'));
var jsonParser = bodyParser.json();

const sessionMiddleware = session({ secret: "changeit", resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

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
    res.render('user/register');
});

app.get('/login', function (req, res) {
    res.render('user/login');
});

app.get('/support', function (req, res) {
    supportController.list(req, function (docs) {
        res.render('support/support', {data: docs});
    });
});

app.get('/newSupport', function (req, res) {
    res.render('support/newSupport');
});

app.get('/chatSupport', function (req, res) {
    res.render('support/chatSupport');
});

app.get('/tickets', function (req, res) {
    res.render('tickets/tickets');
});

app.get('/newTicket', function (req, res) {
    res.render('tickets/newTicket');
});

app.get('/checkTicket', function (req, res) {
    ticketsController.list(req, function (docs) {
        res.render('tickets/checkTicket', {data: docs});
    });
});

app.get('/ticket', function (req, res) {
    ticketsController.findByTitle(req, function (doc) {
        res.render('tickets/ticket', {data: doc});
    })
});

app.get('/faq', function (req, res) {
    faqController.list(req, function (docs) {
        res.render('faq/faq', {data: docs});
    });
});

app.get('/newFAQ', function (req, res) {
    res.render('faq/newFAQ');
});

app.post('/newFAQ', function (req, res) {
    faqController.insert(req, function () {
        res.redirect(303, '/faq')
    })
});

app.post("/register", jsonParser, function(req,res){
    userController.insert(req, function () {
        //We have to send JSON back or the success ajax event does not work
        res.redirect(307, '/login');
    });
});

app.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);

app.post('/newSupport', jsonParser, function (req, res) {
    supportController.createSupport(req, function () {
        res.redirect(303, '/support');
    })
});

app.post('/newFAQ', jsonParser, function (req, res) {
        res.redirect(303, '/faq');
});

app.post('/newTicket', jsonParser, function (req, res) {
    ticketsController.insert(req, function () {
        res.redirect(303, '/tickets');
    })
});

app.post('/ticket', jsonParser, function (req, res) {
    ticketsController.patchByTitle(req, function () {
        res.redirect(303, '/ticket');
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