/*jslint node: true */
'use strict';

var config = require('../config');

module.exports = function(irc) {
  var nicknameTries = 1;

  irc.on('error', function(message) {
    if(message.command === 'ERR_NICKNAMEINUSE') {
      irc.nick(config.nickname + nicknameTries++);
    }
  });
};
