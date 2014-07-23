/*jslint node: true */
'use strict';

var User = require('./models/user');
var Session = require('./models/session');

/**
 * Guard that determines if user is logged in
 */

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

module.exports.requiresUser = requiresUser;
