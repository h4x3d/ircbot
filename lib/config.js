/*jslint node: true */
'use strict';

var _ = require('lodash');
var env = process.env.NODE_ENV || 'development';
var config = require('../config.json');

module.exports = _.merge({}, config.all, config[env]);
