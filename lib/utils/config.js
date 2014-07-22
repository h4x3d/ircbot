/*jslint node: true */
'use strict';

var _ = require('lodash');
var fs = require('fs');

var env = process.env.NODE_ENV || 'development';
var initialConfig = require('../../config.json');

var path = '.config.' + env + '.json';

function get() {
  if(fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path));
  }
  return null;
}

function create() {
  var config = _.merge({}, initialConfig.all, initialConfig[env]);
  fs.writeFileSync(path, JSON.stringify(config));
  return config;
}


function save(callback) {
  fs.writeFile(path, JSON.stringify(config), callback);
}

var config = get();

if(!config) {
  config = create();
}

config.save = save;

module.exports = config;
