'use strict';

var assert = require('assert');
var util = require('../util');

describe('"title" plugin', function(){

  before(util.before({
    plugins: [
      require('../../lib/plugins/title')
    ]
  }));
  after(util.after());

  it('should answer with the title of the send url', function(done) {
    this.spy.send(this.client.me, 'https://twitter.com/');

    this.spy.on('message', function(message) {
      assert.equal(message.from, this.client.me);
      assert.equal(message.message, 'Twitter');
      done();
    }.bind(this));
  });

});
