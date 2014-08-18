/*jslint node: true */
'use strict';

var route = require('../utils/route');
var logger = require('../utils/logger');
var colors = require('../utils/colors');
var request = require('request');
var base = 'https://api.spotify.com/v1/';

function defaultExtractor(response) {
  if(!(response.artists && response.artists[0] && response.artists[0].name && response.name)) {
    return;
  }
  return [response.artists[0].name, response.name, response.external_urls.spotify];
}

var extractors = {
  tracks: defaultExtractor,
  albums: defaultExtractor,
  artists: function(response) {
    if(!response.name) {
      return;
    }
    return [response.name, response.external_urls.spotify];
  }
};

module.exports = function(irc) {

  irc.use(route('spotify::method:*', function(message, match) {

    var id = match.splats[0];
    var method = match.params.method + 's';
    var extractor = extractors[method];

    if(!extractors) {
      return;
    }
    request.get(base + method + '/' + id, function(err, res) {
      if (err) {
        return logger.error(err);
      }
      var response = JSON.parse(res.body);

      if(response.error) {
        return logger.error(new Error(response.error.message));
      }

      var info = extractor(response);

      if(!info) {
        return;
      }

      irc.send(message.source, info.join(' - '));
    });

  }));

  irc.use(route('!spotify *', function(message, match) {

    var search = match.splats[0];

    request.get({
      url: base + 'search',
      qs: {
        q: search,
        type: 'track'
      }
    }, function(err, res) {
      if (err) {
        return logger.error(err);
      }

      var response = JSON.parse(res.body);
      if(response.error) {
        return logger.error(new Error(response.error.message));
      }

      if(!response.tracks.items[0]) {
        return;
      }

      var info = extractors.tracks(response.tracks.items[0]);

      info.push(response.tracks.items[0].uri);

      if(!info) {
        return;
      }

      irc.send(message.source, colors.label('green', info.join(' - ')));
    });

  }));

};
