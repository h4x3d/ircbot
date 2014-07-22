/*jslint node: true */
'use strict';

var route = require('../utils/route');

module.exports = function(irc) {

  /*
    Sends "h" to target if received message is "h"
  */

  irc.use(route('h', function(message) {
    irc.send(message.target, 'h');
  }));

};
