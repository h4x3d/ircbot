/*jslint node: true */
'use strict';

var route = require('./route');
var logger = require('./logger');
var User = require('../models/user');
var Session = require('../models/session');


module.exports = function(irc) {

  /*
    Login command
  */

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

  /*
    Logout command
  */

  irc.use(route('!auth logout', requiresUser, function(message) {
    message.user.logout().then(function() {
      irc.send(message.target, 'You are now logged out');
    }, logger.error);
  }));

  /*
    List users command
  */

  irc.use(route('!auth users', requiresUser, function(message) {
    User.find({}, function(err, users) {

      if(err) {
        return logger.error(err);
      }

      irc.send(message.target, 'List of registered users:');

      users.forEach(function(user) {
        irc.send(message.target, user.username);
      });
    });
  }));

  /*
    Create user command
  */

  irc.use(route('!auth create :username :password', requiresUser, function(message, match) {
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

  /*
    Remove user command
  */

  irc.use(route('!auth remove :username', requiresUser, function(message, match) {

    var username = match.params.username;

    User.findOne({username: username}).exec()
    .then(function(user) {
      if(!user) {
        return irc.send(message.target, 'User not found');
      }
      return user.removeAsync();
    })
    .then(function() {
      irc.send(message.target, 'User removed');
    });

  }));

  /*
    Change password command
  */

  irc.use(route('!auth change-pass :password', requiresUser, function(message, match) {

    message.user.password = match.params.password;

    message.user.save(function(err) {
      if(err) {
        logger.error(err);
        irc.send(message.target, 'Something went wrong. Check log for more information');
        return;
      }
      irc.send(message.target, 'Password changed');
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
    if(!user) {
      throw new Error('User was not found for prefix ' + message.prefix);
    }
    message.user = user; // TODO Should user object be exposed differently?
    done(null);
  }, done);
}
