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

module.exports.to = function(string, color, background) {

  var code = colors[color];

  if(background) {
    code = code + ',' + colors[background];
  }

  return '\x03' + code + string;
};
