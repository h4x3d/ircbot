/*jslint node: true */
'use strict';

var irc = require('slate-irc');
var net = require('net');
var mongoose = require('mongoose');

var config = require('./lib/config');
var logger = require('./lib/utils/logger');

var client = null;

mongoose.connect('mongodb://' + config.database.host + '/' + config.database.name);

function connect() {

  logger.log('Connecting to ' + config.host);

  var stream = net.connect({
    host: config.host,
    port: config.port,
  });

  client = null;
  client = irc(stream);

  configure();
}

function configure() {
  client.nick(config.nickname);
  client.user(config.username, config.realName);

  client.use(require('./lib/plugins/logger'));
  client.use(require('./lib/plugins/channels'));
  client.use(require('./lib/plugins/say'));
  client.use(require('./lib/plugins/auth'));
  client.use(require('./lib/plugins/title'));
  client.use(require('./lib/plugins/spotify'));
  client.use(require('./lib/plugins/colors'));
  // client.use(require('./lib/plugins/h'));
  // client.use(require('./lib/plugins/laugh'));
  // client.use(require('./lib/plugins/api'));
  client.use(require('./lib/plugins/nick'));
  client.use(require('./lib/plugins/math'));

  client.stream.on('error', function(err) {
    logger.error(err);
    setTimeout(connect, 5000);
  });

  client.stream.on('end', connect);
}

connect();
