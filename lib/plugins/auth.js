var route = require('./route');
var logger = require('./logger');
var User = require('../models/user');

module.exports = function(irc) {

  irc.use(route('!login :username :password', function(message, match) {
    var username = match.params.username,
      password = match.params.password;

    User.login(username, password, message.prefix)
    .then(function(user) {
      irc.send(message.params, 'You are now logged in');
    }, function(err) {
      irc.send(message.params, 'Login failed');
    });
  }));

  irc.use(route('!register :username :password', function(message, match) {
    var username = match.params.username,
      password = match.params.password;

    User.create({
      username: username,
      password: password
    }).then(function() {
      return User.login(username, password, message.prefix);
    }).then(function() {
      irc.send(message.params, 'User ' + username + ' created. You are now logged in');
    }, function(err) {
      logger.error(err);
      irc.send(message.params, 'Registration failed. Check arguments');
    });

  }));
};
