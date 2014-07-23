/*jslint node: true */
'use strict';

var route = require('../utils/route');
var auth = require('./auth');
var config = require('../config');

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
    var channel = match.params.channel,
      password = match.params.password;

    // Channel is pushed to config from here since the "join" event doesn't contain password
    config.channels.push(channel + ' ' + password);

    irc.join(channel, password);
  }));

  /*
    Parts a channel
  */

  irc.use(route('!part :channel', auth.requiresUser, function(message, match) {
    irc.part(match.params.channel, '');
  }));


  /*
    Parts a channel with part message
  */

  irc.use(route('!part :channel :message', auth.requiresUser, function(message, match) {
    irc.part(match.params.channel, match.params.message);
  }));

};
