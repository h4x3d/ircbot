/*jslint node: true */
'use strict';

var Router = require('routes');
var logger = require('../plugins/logger');

function Message(message) {
  for(var key in message) {
    this[key] = message[key];
  }

  var data = message.string.match(/:(.*)!(.*)@(.*)\s(.*)\s(.*)\s:(.*)/);

  this.nickname = data[1];
  this.username = data[2];
  this.hostname = data[3];
  this.type = data[4];
  this.target = data[5];
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

      var message = new Message(msg);
      var match = router.match(message.body);

      if(!match) {
        return;
      }

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
