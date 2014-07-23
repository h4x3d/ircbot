/*jslint node: true */
'use strict';

var config = require('../config');

module.exports = function(irc) {
  irc.on('join', function(e) {
    var exists = config.channels.some(function(channel) {
      return channel.split(' ')[0] === e.channel;
    });

    if(exists) return;

    config.channels.push(e.channel);
    console.log(config.channels);
    config.save();
  });

  irc.on('part', function(e) {
    config.channels = config.channels.filter(function(channel) {
      return e.channels.some(function(chan) {
        return channel.split(' ')[0] !== chan;
      });
    });
    console.log(config.channels);
    config.save();
  });
};
