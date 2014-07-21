var mongoose = require('mongoose');

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
    default: 3600000 * 24 * 7 // Week
  }
});
schema.methods = {
  isValid: function() {
    return Date.now() < this.created + this.expires;
  }
}
module.exports = mongoose.model('Session', schema);
