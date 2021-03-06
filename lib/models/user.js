/*jslint node: true */
/* jshint -W079 */
'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Session = require('./session');
var Promise = require('bluebird');

var schema = new mongoose.Schema({
  username: {
    type: 'String',
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    set: function(password) {
      return this.setPassword(password);
    }
  },
  session: {
    type: mongoose.Schema.ObjectId,
    ref: 'Session'
  }
});

schema.methods = {
  saveAsync: function() {
    return Promise.promisify(this.save, this)();
  },
  removeAsync: function() {
    return Promise.promisify(this.remove, this)();
  },
  setPassword: function(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },
  verifyPassword: function(password) {
    return this.password && bcrypt.compareSync(password, this.password);
  },
  logout: function() {
    this.session = null;
    return this.saveAsync();
  }
};

schema.statics = {
  authenticate: function(username, password, callback) {

    function error(message) {
      var err = new Error(message);
      err.status = 400;
      return err;
    }

    var promise = this.findOne({username: username}).exec()
    .then(function(user) {
      if (!user)
        throw error('Invalid username');
      if (!user.verifyPassword(password))
        throw error('Invalid password');
      return user;
    });

    if(!callback) {
      return promise;
    }
    promise.then(function(user) {
      callback(null, user);
    }, callback);
  },
  login: function(username, password, prefix) {
    return this.authenticate(username, password)
    .then(function(user) {
      return Session.create({prefix: prefix})
      .then(function(session) {
        user.session = session;
        return user.saveAsync();
      });
    });
  }
};

module.exports = mongoose.model('User', schema);
