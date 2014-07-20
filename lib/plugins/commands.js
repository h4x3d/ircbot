var route = require('./route');

module.exports = function(irc) {

  irc.use(route('!join :channel', function(message, route) {
    irc.join(route.params.channel);
  }));

  irc.use(route('!join :channel :password', function(message, route) {
    irc.join(route.params.channel, route.params.password);
  }));

  irc.use(route('!part :channel', function(message, route) {
    irc.part(route.params.channel);
  }));

  irc.use(route('!part :channel :message', function(message, route) {
    irc.part(route.params.channel, route.params.message);
  }));

};
