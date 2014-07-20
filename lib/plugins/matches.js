var Router = require('routes');
var router = Router();

module.exports = function(route, fn) {

  router.addRoute(route, fn);

  return function (irc) {
    irc.on('data', function(message){
      var match = router.match(message.trailing);
      if(!match) {
        return;
      }
      match.fn(message, match);
    });
  }
}

