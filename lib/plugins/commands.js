var route = require('./route');

module.exports = function(irc) {

  irc.use(route('!join :channel', function(message, match) {
    irc.join(match.params.channel);
  }));

  irc.use(route('!join :channel :password', function(message, match) {
    irc.join(match.params.channel, match.params.password);
  }));

  irc.use(route('!part :channel', function(message, match) {
    irc.part(match.params.channel);
  }));

  irc.use(route('!part :channel :message', function(message, match) {
    irc.part(match.params.channel, match.params.message);
  }));

};
