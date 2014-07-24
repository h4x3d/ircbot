/*jslint node: true */
'use strict';

var express = require('express');
var app = express();
var passport = require('passport');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var socketioJwt = require('socketio-jwt');
var config = require('../../config');

app.use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .use(passport.initialize())
  .use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    next();
  });

// Passport configuration
require('./auth');

io.sockets
  .on('connection', socketioJwt.authorize({
    secret: config.plugins.api.secret,
    timeout: 15000
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
