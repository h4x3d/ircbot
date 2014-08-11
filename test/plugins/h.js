'use strict';

var assert = require('assert');
var util = require('../util');

describe('"h" plugin', function(){

  before(util.before({
    plugins: [
      require('../../lib/plugins/h')
    ]
  }));
  after(util.after());

  it('should answer "h" to "h" message', function(done) {
    this.spy.send(this.client.me, 'h');

    this.spy.on('message', function(message) {
      assert.equal(message.from, this.client.me);
      assert.equal(message.message, 'h');
      done();
    }.bind(this));
  });

});
