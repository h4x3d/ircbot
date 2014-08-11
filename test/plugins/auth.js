'use strict';

var assert = require('assert');
var util = require('../util');

describe('"auth" plugin', function(){

  before(util.before({
    plugins: [
      require('../../lib/plugins/auth')
    ]
  }));
  after(util.after());

  it('should listen to login messages and log user in with right credentials', function(done) {

    this.spy.on('message', function(message) {
      assert.equal(message.from, this.client.me);
      assert.ok(message.message.indexOf('logged in') > -1);
      done();
    }.bind(this));

    this.spy.send(this.client.me, '!auth login admin admin');
  });

});
