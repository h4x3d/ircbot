/*jslint node: true */
'use strict';

var logger = require('./logger');
var route = require('./route');
var title = require('url-to-title');
var regex = /(\b(?:https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
var _ = require('lodash');

function validateResults(results) {
  return _.compact(results).map(function(title) {
    return title.trim();
  });
}

module.exports = function(irc) {
  irc.use(route(regex, function(message) {

    var matches = message.body.match(regex);

    if(!matches) {
      return;
    }

    title(matches).then(function(results) {
      var titles = validateResults(results);

      if(titles.length === 0) {
        return;
      }

      irc.send(message.target, titles.join(', '));
    }).catch(logger.error);
  }));
};
