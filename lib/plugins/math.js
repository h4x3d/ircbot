/*jslint node: true */
'use strict';
var math = require('mathjs');
var route = require('../utils/route');
var colors = require('../utils/colors');
module.exports = function(irc) {

  /*
    Sends "h" to source if received message is "h"
  */

  irc.use(route('!math *', function(message, match) {
    irc.send(message.source, colors.label('royal', math.eval(match.splats[0])));
  }));

};
