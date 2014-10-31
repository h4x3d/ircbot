/*jslint node: true */
'use strict';

var logger = require('../utils/logger');
var route = require('../utils/route');
var colors = require('../utils/colors');
var url = require('../utils/url');
var title = require('url-to-title');

var _ = require('lodash');

function validateResults(results) {
  return _.compact(results).map(function(title) {
    return title.trim();
  });
}

module.exports = function(irc) {
  irc.use(route(url.regex, function(message) {

    var matches = url.parse(message.body);

    if(!matches) {
      return;
    }

    title(matches).then(function(results) {
      var titles = validateResults(results);

      if(titles.length === 0) {
        return;
      }
      irc.send(message.source, colors.label('teal', titles.join(', ')));
    }).catch(logger.error);
  }));
};
