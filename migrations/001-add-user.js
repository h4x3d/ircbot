/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var User = require('../lib/models/user');

mongoose.connect('mongodb://localhost/ircbot'); // TODO replace with config.database

exports.up = function(next){
  User.find({}).exec()
  .then(function(users) {
    if(users.length > 0) {
      return;
    }
    return User.create({ // TODO replace with config.admin
      username: 'admin',
      password: 'foobar'
    });

  }, next)
  .then(next.bind(null, null), next);
};

exports.down = function(next){
  next();
};
