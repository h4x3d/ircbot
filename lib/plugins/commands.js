var matches = require('./matches');

module.exports = function(irc) {

  irc.use(matches('!join :channel', function(message, route) {
    irc.join(route.params.channel);
  }));

  irc.use(matches('!join :channel :password', function(message, route) {
    irc.join(route.params.channel, route.params.password);
  }));

  irc.use(matches('!part :channel', function(message, route) {
    irc.part(route.params.channel);
  }));

  irc.use(matches('!part :channel :message', function(message, route) {
    irc.part(route.params.channel, route.params.message);
  }));

};
