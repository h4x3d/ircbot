/*jslint node: true */
'use strict';

var irc = require('slate-irc');
var net = require('net');
var mongoose = require('mongoose');

var config = require('./lib/utils/config');
var Config = require('./lib/models/config');

var logger = require('./lib/plugins/logger');

mongoose.connect('mongodb://' + config.database.host + '/' + config.database.name);

Config.get().then(function(config) {

  if(!config) {
    throw new Error('Configuration not found. Check README.md for installation instructions');
  }

  var stream = net.connect({
    host: config.host,
    port: config.port,
  });

  var client = irc(stream);

  client.nick(config.nickname);
  client.user(config.username, config.realName);

  client.use(logger);
  client.use(require('./lib/plugins/channels'));
  client.use(require('./lib/plugins/say'));
  client.use(require('./lib/plugins/auth'));
  client.use(require('./lib/plugins/title'));
  client.use(require('./lib/plugins/spotify'));

  var nicknameTries = 0;

  client.on('welcome', function() {
    client.join(config.channels);
  });

  client.on('error', function(message) {
    if(message.command === 'ERR_NICKNAMEINUSE') {
      nicknameTries++;
      client.nick(config.nickname + nicknameTries);
    }
  });

}).then(function() {}, logger.error);



