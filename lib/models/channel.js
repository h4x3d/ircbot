/*jslint node: true */
/* jshint -W079 */

'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var mongoose = require('mongoose');
var logger = require('../utils/logger');
var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  created: {
    type: Number,
    default: Date.now
  }
});

schema.methods = {
  saveAsync: function() {
    return Promise.promisify(this.save, this)();
  },
  removeAsync: function() {
    return Promise.promisify(this.remove, this)();
  }
};

var noop = function(d){ return d; };

schema.statics.updateOrCreate = function(data) {
  var self = this;
  return this.findOne({name: data.name}).exec().then(function(channel) {
    if(channel) {
      _.extend(channel, data);
      return channel.saveAsync();
    }
    return self.create(data);
  }).then(noop, logger.error);
};

module.exports = mongoose.model('Channel', schema);
