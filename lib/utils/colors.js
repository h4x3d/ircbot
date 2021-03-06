/*jslint node: true */
'use strict';

var colors = {
  'white': 0,
  'black': 1,
  'blue': 2,
  'green': 3,
  'red': 4,
  'brown': 5,
  'purple': 6,
  'orange': 7,
  'yellow': 8,
  'lime': 9,
  'teal': 10,
  'aqua': 11,
  'royal': 12,
  'pink': 13,
  'grey': 14,
  'silver': 15
};

module.exports = colors;

/**
 * Generates new string with irc color codes
 *
 * @param {String} string
 * @param {String} color text color
 * @param {String} background text background
 */

module.exports.to = function(string, color, background) {

  var code = colors[color];

  if(background) {
    code = code + ',' + colors[background];
  }

  return '\x03' + code + string;
};

/**
 * Prefixes text with label
 *
 * @param {String} string
 * @param {String} label color
 */

module.exports.label = function(color, string) {

  var code = colors[color];

  return '\x030,' + code + ' \x03 ' + string;
};
