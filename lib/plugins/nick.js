/*jslint node: true */
'use strict';

var config = require('../config');
var auth = require('../auth');
var route = require('../utils/route');

var nickname = config.nickname;

module.exports = function(irc) {

  /**
   * Listen for nickname errors and try to append number to nickname
   */

  var nicknameTries = 1;
  irc.on('errors', function(message) {
    if(message.cmd === 'ERR_NICKNAMEINUSE') {
      irc.nick(nickname + nicknameTries++);
    }
  });

  /**
   * Change bot's nick
   */

  irc.use(route('!nick :nickname', auth.requiresUser, function(message, match) {
    nickname = match.params.nickname;
    irc.nick(nickname);
  }));

};
