/*jslint node: true */
'use strict';

var route = require('../utils/route');
var colors = require('../utils/colors');
var auth = require('../auth');
module.exports = function(irc) {

  /*
    Sends message to given channel
  */

  irc.use(route('!say *', auth.requiresUser, function(message, match) {
    irc.send(match.arguments.channel || message.source, colors.label('purple', match.splats[0]));
  }));

};
