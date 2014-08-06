/*jslint node: true */
'use strict';
var math = require('mathjs');
var route = require('../utils/route');

module.exports = function(irc) {

  /*
    Sends "h" to source if received message is "h"
  */

  irc.use(route('!math *', function(message, match) {
    irc.send(message.source, math.eval(match.splats[0]));
  }));

};
