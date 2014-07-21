/*jslint node: true */
'use strict';

var route = require('./route');
var auth = require('./auth');

module.exports = function(irc) {

  /*
    Joins to channel
  */

  irc.use(route('!join :channel', auth.requiresUser, function(message, match) {
    irc.join(match.params.channel);
  }));

  /*
    Joins to channel with password
  */

  irc.use(route('!join :channel :password', auth.requiresUser, function(message, match) {
    irc.join(match.params.channel, match.params.password);
  }));

  /*
    Parts a channel
  */

  irc.use(route('!part :channel', auth.requiresUser, function(message, match) {
    irc.part(match.params.channel);
  }));

  /*
    Parts a channel with part message
  */

  irc.use(route('!part :channel :message', auth.requiresUser, function(message, match) {
    irc.part(match.params.channel, match.params.message);
  }));

};
