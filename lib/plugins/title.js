/*jslint node: true */
'use strict';

var logger = require('./logger');
var title = require('url-to-title');
var regex = /(\b(?:https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
var _ = require('lodash');

function validateResults(results) {
  return _.compact(results).map(function(title) {
    return title.trim();
  });
}

module.exports = function(irc) {
  irc.on('data', function(message){

    if('PRIVMSG' !== message.command) {
      return;
    }

    var matches = message.trailing.match(regex);

    if(!matches) {
      return;
    }

    title(matches).then(function(results) {
      var titles = validateResults(results);

      if(titles.length === 0) {
        return;
      }

      irc.send(message.params, titles.join(', '));
    }).catch(logger.error);

  });
};
