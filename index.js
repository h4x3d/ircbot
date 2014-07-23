/*jslint node: true */
'use strict';

var irc = require('slate-irc');
var net = require('net');
var mongoose = require('mongoose');

var config = require('./lib/config');

var logger = require('./lib/plugins/logger');

mongoose.connect('mongodb://' + config.database.host + '/' + config.database.name);

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
client.use(require('./lib/plugins/h'));
client.use(require('./lib/plugins/laugh'));
client.use(require('./lib/plugins/api'));
