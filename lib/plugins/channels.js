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
    var channel = match.params.channel;
    irc.join(channel);
    config.channels.push(channel);
    config.save();
  }));

  /*
    Joins to channel with password
  */

  irc.use(route('!join :channel :password', auth.requiresUser, function(message, match) {
    var channel = match.params.channel,
      password = match.params.password;

    irc.join(channel, password);
    config.channels.push(channel + ' ' + password);
    config.save();

  }));

  /*
    Parts a channel
  */

  irc.use(route('!part :channel', auth.requiresUser, function(message, match) {
    irc.part(match.params.channel, '');

    config.channels = config.channels.filter(function(channel) {
      return channel.split(' ')[0] !== match.params.channel;
    });

    config.save();

  }));

  /*
    Parts a channel with part message
  */

  irc.use(route('!part :channel :message', auth.requiresUser, function(message, match) {

    irc.part(match.params.channel, match.params.message);

    config.channels = config.channels.filter(function(channel) {
      return channel.split(' ')[0] !== match.params.channel;
    });

    config.save();

  }));

};
