/*jslint node: true */
'use strict';

var _ = require('lodash');
var config = require('../../config.json');
var env = process.env.NODE_ENV || 'development';

module.exports = _.merge({}, config.all, config[env]);
