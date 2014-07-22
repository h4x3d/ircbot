/*jslint node: true */
'use strict';

var route = require('../utils/route');

module.exports = function(irc) {

  /*
    Sends ":D" to source if received message is ":D"
  */

  irc.use(route(/^\:D$/, function(message) {
    irc.send(message.source, ':D');
  }));

};
