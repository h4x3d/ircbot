'use strict';

var assert = require('assert');
var util = require('../util');

describe('"title" plugin', function(){

  before(util.before({
    plugins: [
      require('../../lib/plugins/math')
    ]
  }));
  after(util.after());

  it('should answer with solution for equations', function(done) {
    this.spy.send(this.client.me, '!math 2+2');

    this.spy.once('message', function(message) {
      assert.equal(message.from, this.client.me);
      assert.equal(message.message[message.message.length - 1], '4');
      done();
    }.bind(this));
  });

  it('should handle errors gracefully', function(done) {
    this.spy.send(this.client.me, '!math test+2');

    this.spy.once('message', function(message) {
      assert.equal(message.from, this.client.me);
      assert.ok(message.message.indexOf('Undefined symbol test') > -1);
      done();
    }.bind(this));
  });

});
