var matches = require('./matches');
var request = require('request');

var base = 'https://api.spotify.com/v1/';

var extractors = {
  tracks: function(response) {
    if(!(response.artists && response.artists[0] && response.artists[0].name && response.name)) {
      return;
    }
    return [response.artists[0].name, response.name];
  },
  albums: function(response) {
    if(!(response.artists && response.artists[0] && response.artists[0].name && response.name)) {
      return;
    }
    return [response.artists[0].name, response.name];
  },
  artists: function(response) {
    if(!response.name) {
      return;
    }
    return [response.name];
  }
}
module.exports = function(irc) {

  irc.use(matches('spotify::method:*', function(message, route) {

    var id = route.splats[0];
    var method = route.params.method + 's';
    var extractor = extractors[method];

    if(!extractors) {
      return;
    }
    request.get(base + method + '/' + id, function(err, res) {
      if (err) {
        return; // TODO log error
      }
      var response = JSON.parse(res.body);

      if(response.error) {
        return; // TODO log error
      }

      var info = extractor(response);

      if(!info) {
        return;
      }

      irc.send(message.params, info.join(' - '));
    });

  }));

};
