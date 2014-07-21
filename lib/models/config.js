/*jslint node: true */
'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  realName: {
    type: String,
    required: true
  },
  host: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true
  },
  channels: {
    type: [String],
    default: []
  }
});

var configPromise = null;

schema.statics = {
  get: function(callback) {

    configPromise = configPromise || this.findOne({}).exec();

    if(callback) {
      configPromise.then(callback.bind(null, null), callback);
      return;
    }
    return configPromise;
  }
};

module.exports = mongoose.model('Config', schema);
