/*jslint node: true */
/* jshint -W079 */

'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
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

schema.statics.updateOrCreate = function(data) {
  return this.findOne({name: data.name}).exec().then(function(channel) {
    if(channel) {
      _.extend(channel, data);
      return channel.saveAsync();
    }
    return this.create(data);
  });
};

module.exports = mongoose.model('Channel', schema);
