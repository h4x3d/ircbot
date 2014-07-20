var Router = require('routes');
var router = Router();

var registered = false;
module.exports = function(route, fn) {

  router.addRoute(route, fn);

  return function (irc) {
    if(registered) {
      return;
    }
    irc.on('data', function(message){
      var match = router.match(message.trailing);
      if(!match) {
        return;
      }
      match.fn(message, match);
    });
    registered = true;
  }
}

