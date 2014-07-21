var route = require('./route');
var logger = require('./logger');
var User = require('../models/user');
var Session = require('../models/session');

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

  irc.use(route('!logout', requiresUser, function(message, match) {
    message.user.logout().then(function() {
      irc.send(message.params, 'You are now logged out')
    }, logger.error);
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

module.exports.requiresUser = requiresUser;
