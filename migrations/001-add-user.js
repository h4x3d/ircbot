/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var config = require('../lib/config');
var User = require('../lib/models/user');

exports.up = function(next){

  mongoose.connect('mongodb://' + config.database.host + '/' + config.database.name);

  User.find({}).exec()
  .then(function(users) {
    if(users.length > 0) {
      return;
    }
    return User.create({
      username: config.admin.username,
      password: config.admin.password
    });

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
