var Router = require('routes');
var logger = require('./logger');

module.exports = function(route, guard, fn) {

  if(!fn) {
    fn = guard;
    guard = undefined;
  }

  var router = Router();
  router.addRoute(route, fn);

  return function (irc) {

    irc.on('data', function(message){

      if('PRIVMSG' !== message.command) {
        return;
      }

      var match = router.match(message.trailing);
      if(!match) {
        return;
      }

      if(guard) {
        return guard(message, match, function(err) {
          if(err) {
            return logger.error(err);
          }
          match.fn(message, match);
        })
      }
      match.fn(message, match);

    });
  }
}

