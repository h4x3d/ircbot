/*jslint node: true */
'use strict';

var Router = require('routes');
var logger = require('../plugins/logger');

function Message(message) {
  for(var key in message) {
    this[key] = message[key];
  }

  var data = message.string.match(/^:(.*)!(.*)@([.\S]*)\s([.\S]*)\s([.\S]*)\s:(.*)$/);

  this.nickname = data[1];
  this.username = data[2];
  this.hostname = data[3];
  this.type = data[4];
  this.target = data[5];
  this.source = this.target.indexOf('#') > -1 ? this.target : this.nickname;
  this.body = message.trailing;
}

module.exports = function(route, guard, fn) {

  if(!fn) {
    fn = guard;
    guard = undefined;
  }

  var router = new Router();
  router.addRoute(route, fn);

  return function (irc) {

    irc.on('data', function(msg) {

      if('PRIVMSG' !== msg.command) {
        return;
      }

      var match = router.match(msg.trailing);

      if(!match) {
        return;
      }

      var message = new Message(msg);

      if(guard) {
        return guard(message, match, function(err) {
          if(err) {
            return logger.error(err);
          }
          match.fn(message, match);
        });
      }
      match.fn(message, match);

    });
  };
};
