/*jslint node: true */
'use strict';

require('colors');

var logger = require('../utils/logger');

module.exports = function(irc) {
  irc.on('data', function(message) {
    logger.info(message.command, message.string);
  });
};
