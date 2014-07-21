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

schema.statics = {
  get: function(callback) {
    if(callback) {
      this.findOne({}, callback);
      return;
    }
    return this.findOne({}).exec();
  }
};

module.exports = mongoose.model('Config', schema);
