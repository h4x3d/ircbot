/*jslint node: true */
'use strict';

var _ = require('lodash');
var route = require('../utils/route');
var auth = require('../auth');
var Channel = require('../models/channel');
var logger = require('../utils/logger');

module.exports = function(irc) {

  /**
   * Stores channel to config on join
   */

  irc.on('join', function(e) {
    Channel.updateOrCreate({
      name: e.channel
    });
  });

  /**
   * Removes channel from config on part
   */

  irc.on('part', function(e) {
    Channel.remove({
      name: {
        $in: e.channels
      }
    }, function(err, num) {
      if(err) logger.error(err);
    });
  });

  /**
   * Joins to stored channels on welcome
   */

  irc.on('welcome', function() {
    Channel.find({}, function(err, channels) {
      if(err) return logger.error(err);

      var ordered = _.sortBy(channels, function(channel) {
        return channel.password;
      });

      var passwords = _.pluck(ordered, 'password');
      var chans = _.pluck(ordered, 'name');

      irc.join(chans, passwords);
    });
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

    irc.join(channel, password);

    // Channel is saved here because the "join" event doesn't contain password
    Channel.updateOrCreate({
      channel: channel,
      password: password
    });

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
