/*jslint node: true */
'use strict';

var route = require('./route');
var auth = require('./auth');

module.exports = function(irc) {

  /*
    Sends message to given channel
  */

  irc.use(route('!say :channel *', auth.requiresUser, function(message, match) {
    irc.send(match.params.channel, match.splats[1]);
  }));

};
