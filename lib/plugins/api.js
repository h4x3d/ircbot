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

var config = require('../config');
var User = require('../models/user');

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
    secret: 'TODO',
    resave: true,
    saveUninitialized: true,
    store: sessionStore
  }))
  .use(passport.initialize())
  .use(passport.session());

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
  secret: 'TODO',
  store: sessionStore
}));

io.on('connection', function (socket) {
  // console.log(socket.request.user);
});

app.post('/api/login', passport.authenticate('local'), function (req, res) {
  res.send(200);
});

app.get('/api/users/me', function (req, res) {
  if(!req.user) {
    return res.send(404);
  }
  res.send(200, req.user);
});

server.listen(9001);

module.exports = function() {};
