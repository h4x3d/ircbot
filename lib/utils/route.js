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

function isArgumentStart(str) {
  return str.indexOf('-') === 0;
}

function parseArguments(str) {
  var args = {};

  var messageParts = str.split(' ')
  var bodyParts = [];

  for(var i = 0; i < messageParts.length; i++) {

    var str = messageParts[i];
    if(!isArgumentStart(str)) {
      bodyParts.push(str);
      continue;
    }
    var value = null;
    var next = messageParts[i + 1];
    var lastCommand = true;

    if(next && !isArgumentStart(next)) {
      value = next;
      i++;
    }

    var key = str.replace(/^[-]+/g, '');
    args[key] = value;

  }

  return {
    arguments: args,
    text: bodyParts.join(' ')
  };
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

      var parsed = parseArguments(msg.trailing);

      var match = router.match(parsed.text);

      if(!match) {
        return;
      }
      match.arguments = parsed.arguments;

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
