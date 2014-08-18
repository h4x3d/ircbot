/*jslint node: true */
'use strict';

var route = require('../utils/route');
var auth = require('../auth');

var colors = require('../utils/colors');

function colorize(text, color, background) {

  if(!colors[color]) {
    return text;
  }
  if(!colors[background]) {
    return colors.to(text, color);
  }

  return colors.to(text, color, background);
}

module.exports = function(irc) {

  /*
    Sends message to given channel
  */

  irc.use(route('!color *', auth.requiresUser, function(message, match) {

    function send(source) {
      irc.send(source, colorize(match.splats[0], match.arguments.color, match.arguments.background));
    }

    if(match.arguments.channel) {
      return send(match.arguments.channel);
    }
    return send(message.source);
  }));

};
