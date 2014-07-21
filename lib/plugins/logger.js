/*jslint node: true */
'use strict';

require('colors');

function log() {
  var args = Array.prototype.slice.call(arguments, 0);
  console.log.apply(console, [new Date().toString()].concat(args));
}

function error(err) {
  log('ERROR'.red, err.message);
}

function logger(irc) {
  irc.on('data', log);
}

logger.error = error;
logger.log = log;

module.exports = logger;
