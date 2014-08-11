'use strict';

var irc = require('slate-irc');
var net = require('net');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ircbot-test');

function callAfterTimes(num, fn) {
  var count = 1;
  return function() {
    if(count === num) {
      return fn();
    }
    count++;
  };
}

module.exports = {
  before: function(opts) {
    return function(done) {
      var clientStream = net.connect({
        host: 'localhost',
        port: 6667,
      });

      var spyStream = net.connect({
        host: 'localhost',
        port: 6667,
      });

      this.client = irc(clientStream);

      this.spy = irc(spyStream);

      this.spy.nick('test-spy' + Date.now());
      this.spy.user('test-spy', 'test-spy');

      this.client.nick('test-client' + Date.now());
      this.client.user('test-client', 'test-client');

      (opts.plugins || []).forEach(function(plugin) {
        this.client.use(plugin);
      }.bind(this));

      var ready = callAfterTimes(2, done);
      this.client.on('welcome', ready);
      this.spy.on('welcome', ready);
    };

  },
  after: function() {
    return function(done) {
      this.spy.stream.destroy();
      this.client.stream.destroy();

      var ready = callAfterTimes(2, done);
      this.client.stream.on('close', ready);
      this.spy.stream.on('close', ready);
    };
  }
};
