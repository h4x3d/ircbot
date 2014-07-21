/*jslint node: true */
'use strict';

var route = require('./route');
var logger = require('./logger');
var User = require('../models/user');
var Session = require('../models/session');


module.exports = function(irc) {

  irc.use(route('!auth login :username :password', function(message, match) {
    var username = match.params.username,
      password = match.params.password;

    User.login(username, password, message.prefix)
    .then(function() {
      irc.send(message.target, 'You are now logged in');
    }, function(err) {
      irc.send(message.target, 'Login failed');
      logger.error(err);
    });
  }));

  irc.use(route('!auth logout', requiresUser, function(message) {
    message.user.logout().then(function() {
      irc.send(message.target, 'You are now logged out');
    }, logger.error);
  }));

  irc.use(route('!auth register :username :password', requiresUser, function(message, match) {
    var username = match.params.username,
      password = match.params.password;

    User.create({
      username: username,
      password: password
    }).then(function() {
      irc.send(message.target, 'User ' + username + ' created');
    }, function(err) {

      logger.error(err);

      if(err.code === 11000) {
        irc.send(message.target, 'Registration failed. Username must be unique');
        return;
      }
      irc.send(message.target, 'Registration failed. Check arguments');
    });
  }));

  irc.use(route('!auth users', requiresUser, function(message) {
    User.find({}, function(err, users) {

      irc.send(message.target, 'List of registered users:');

      users.forEach(function(user) {
        irc.send(message.target, user.username);
      });
    });
  }));

};

module.exports.requiresUser = requiresUser;

function requiresUser(message, match, done) {
  return Session.findOne({
    prefix: message.prefix
  })
  .sort({created: -1}).exec()
  .then(function(session) {
    if(!session || !session.isValid()) {
      throw new Error('Session not found for prefix ' + message.prefix);
    }
    return User.findOne({session: session._id}).exec();
  }, done)
  .then(function(user) {
    message.user = user; // TODO Should user object be exposed differently?
    done(null);
  }, done);
}
