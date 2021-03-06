'use strict';
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var _ = require('lodash');
var passport = require('passport');
var path = require('path');
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var BaseUser =  mongoose.model('baseUser');
var Cart = mongoose.model('Cart');

var ENABLED_AUTH_STRATEGIES = [
    'local',
    //'twitter',
    //'facebook',
    'google'
];

module.exports = function (app) {

    // First, our session middleware will set/read sessions from the request.
    // Our sessions will get stored in Mongo using the same connection from
    // mongoose. Check out the sessions collection in your MongoCLI.
    app.use(session({
        secret: app.getValue('env').SESSION_SECRET,
        store: new MongoStore({mongooseConnection: mongoose.connection}),
        resave: false,
        saveUninitialized: false
    }));

    // Initialize passport and also allow it to read
    // the request session information.
    app.use(passport.initialize());
    app.use(passport.session());

    // When we give a cookie to the browser, it is just the userId (encrypted with our secret).
    passport.serializeUser(function (user, done) {

        done(null, user.id);
    });

    // When we receive a cookie from the browser, we use that id to set our req.user
    // to a user found in the database.
    passport.deserializeUser(function (id, done) {
        console.log('deserializeUser, id:', id);
        UserModel.findById(id, done);
    });

    app.use(function(req, res, next){
        if(!req.session.guest && !req.session.passport.user){
            BaseUser.create({})
            .then(function(user){
                req.session.guest = user._id;
                return Cart.create({guest: user._id});
            })
            .then(function(cart){
                console.log('created cart,', cart);
                req.session.cart = cart._id;
                // res.status(201).json(guestUser);
            })
            .then(null, next);
        }
        next();
    });

    // We provide a simple GET /session in order to get session information directly.
    // This is used by the browser application (Angular) to determine if a user is
    // logged in already.

    app.get('/session', function (req, res) {
        if (req.user) {
            console.log('has req.user', req.user);
            res.send({ user: req.user.sanitize() });
        } else {
            console.log('about to send 401');
            res.status(401).send('No authenticated user.');
        }
    });

    // Simple /logout route.
    app.get('/logout', function (req, res) {
        req.logout();
        console.log('loggedout req', req.session);
        delete req.session['guest'];
        delete req.session['cart'];
        res.status(200).end();
    });

    // THIS IS WHERE THE /LOGIN POST ROUTE LANDS
    // Each strategy enabled gets registered.
    ENABLED_AUTH_STRATEGIES.forEach(function (strategyName) {
        require(path.join(__dirname, strategyName))(app);
    });

};
