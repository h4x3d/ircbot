/*jslint node: true */
'use strict';
var math = require('mathjs');
var route = require('../utils/route');
var colors = require('../utils/colors');
var logger = require('../utils/logger');

module.exports = function(irc) {

  /*
    Sends "h" to source if received message is "h"
  */

  irc.use(route('!math *', function(message, match) {
    var result;

    try {
      result = math.eval(match.splats[0])
    } catch (err) {
      logger.error(err);
      result = err.message;
    }

    irc.send(message.source, colors.label('royal', result));
  }));

};
