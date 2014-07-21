/*jslint node: true */
'use strict';

function log() {
  var args = Array.prototype.slice.call(arguments, 0);
  console.log.apply(console, [new Date()].concat(args));
}

function error(err) {
  log('ERROR:', err.message);
}

function logger(irc) {
  irc.on('data', log);
}

logger.error = error;
logger.log = log;

module.exports = logger;
