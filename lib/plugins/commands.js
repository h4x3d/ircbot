var route = require('./route');
var auth = require('./auth');

module.exports = function(irc) {

  irc.use(route('!join :channel', auth.requiresUser, function(message, match) {
    irc.join(match.params.channel);
  }));

  irc.use(route('!join :channel :password', auth.requiresUser, function(message, match) {
    irc.join(match.params.channel, match.params.password);
  }));

  irc.use(route('!part :channel', auth.requiresUser, function(message, match) {
    irc.part(match.params.channel);
  }));

  irc.use(route('!part :channel :message', auth.requiresUser, function(message, match) {
    irc.part(match.params.channel, match.params.message);
  }));

};
