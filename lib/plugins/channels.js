/*jslint node: true */
'use strict';

var route = require('../utils/route');
var auth = require('../auth');
var config = require('../config');

module.exports = function(irc) {

  /**
   * Stores channel to config on join
   */

  irc.on('join', function(e) {
    var exists = config.channels.some(function(channel) {
      return channel.split(' ')[0] === e.channel;
    });

    if(exists) return;

    config.channels.push(e.channel);
    config.save();
  });

  /**
   * Removes channel from config on part
   */

  irc.on('part', function(e) {
    config.channels = config.channels.filter(function(channel) {
      return e.channels.some(function(chan) {
        return channel.split(' ')[0] !== chan;
      });
    });
    config.save();
  });

  /**
   * Joins to stored channels
   */

  irc.on('welcome', function() {
    irc.join(config.channels);
  });

  /*
   * Joins to channel
   */

  irc.use(route('!join :channel', auth.requiresUser, function(message, match) {
    irc.join(match.params.channel);
  }));

  /*
   * Joins to channel with password
   */

  irc.use(route('!join :channel :password', auth.requiresUser, function(message, match) {
    var channel = match.params.channel,
      password = match.params.password;

    // Channel is pushed to config from here since the "join" event doesn't contain password
    config.channels.push(channel + ' ' + password);

    irc.join(channel, password);
  }));

  /*
   * Parts a channel
   */

  irc.use(route('!part :channel', auth.requiresUser, function(message, match) {
    irc.part(match.params.channel, '');
  }));


  /*
   * Parts a channel with part message
   */

  irc.use(route('!part :channel :message', auth.requiresUser, function(message, match) {
    irc.part(match.params.channel, match.params.message);
  }));

};
