/*jslint node: true */
'use strict';

var express = require('express');
var app = express();
var passport = require('passport');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passportSocketIo = require('passport.socketio');

var config = require('../../config');
var User = require('../../models/user');

var sessionStore = new MongoStore({
  db: config.database.name,
  host: config.database.host,
  collection: 'api_sessions'
});

app.use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(cookieParser())
  .use(session({
    secret: config.plugins.api.session_secret,
    resave: true,
    saveUninitialized: true,
    store: sessionStore
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
  });
passport.use(new LocalStrategy(User.authenticate.bind(User)));

passport.serializeUser(function(user, done) {
  return done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  return User.findOne({_id: id}, done);
});

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'connect.sid',
  secret: config.plugins.api.session_secret,
  store: sessionStore
}));

module.exports = function(irc) {
  require('./routes')(app, io, irc);

  app.use(function(err, req, res, next) {
    if(err.status === 404) {
      res.status(404).send('Not found');
      return;
    }
    if(err.status === 401) {
      res.status(401).send('Unauthorized');
      return;
    }
    res.status(500).send('Internal server error');
  });

  server.listen(9001);
};
