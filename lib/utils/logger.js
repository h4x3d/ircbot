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

function info() {
  var args = Array.prototype.slice.call(arguments, 0);
  log.apply(log, ['INFO'.blue].concat(args));
}

module.exports = {
  info: info,
  error: error
};
