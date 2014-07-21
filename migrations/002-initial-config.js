/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var config = require('../lib/utils/config');
var Config = require('../lib/models/config');

exports.up = function(next){

  mongoose.connect('mongodb://' + config.database.host + '/' + config.database.name);

  Config.find({}).exec()
  .then(function(configs) {
    if(configs.length > 0) {
      return;
    }
    return Config.create(config);
  })
  .onResolve(function(err) {

    if(err) {
      return console.error(err, err.stack);
    }

    mongoose.disconnect(next);

  });
};

exports.down = function(next){
  next();
};
