var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
  prefix: {
    type: 'String',
    required: true
  },
  created: {
    type: Number,
    default: Date.now
  },
  expires: {
    type: Number,
    default: 3600 * 24 * 7 // Week
  }
});

module.exports = mongoose.model('Session', schema);
