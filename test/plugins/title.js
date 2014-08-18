'use strict';

var assert = require('assert');
var util = require('../util');
var mime = require('mime');
var url = require('url');
var http = require('http');

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

  it('should tell if url\'s extension doesnt match the real content type', function(done) {

    var server = http.createServer( function(request, response) {
      var pathname = url.parse(request.url).pathname;
      response.writeHead(200, {'Content-Type': mime.lookup('text/html; charset=utf-8')});
    });

    server.listen(9005);

    this.spy.send(this.client.me, 'http://localhost:9005/1kez9.png');
    this.spy.on('message', function(message) {
      assert.equal(message.message, 'Content type "text/html; charset=utf-8" doesn\'t match the extension ".png"');
      server.close(done);
    }.bind(this));
  });

});
