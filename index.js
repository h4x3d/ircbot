/*jslint node: true */
'use strict';

var irc = require('slate-irc');
var net = require('net');
var mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';
var production = env === 'production';

var config = {
  nickname: 'botti',
  username: 'botti',
  realName: 'botti the bot',
  host: production ? 'irc.quakenet.org' : 'localhost',
  port: 6667,
  channels: production ? ['#h4x3d', '#riku'] : ['#test'],
  database: 'ircbot'
};

mongoose.connect('mongodb://localhost/' + config.database);

var stream = net.connect({
  host: config.host,
  port: config.port,
});

var client = irc(stream);

client.nick(config.nickname);
client.user(config.username, config.realName);

client.use(require('./lib/plugins/logger'));
client.use(require('./lib/plugins/commands'));
client.use(require('./lib/plugins/auth'));
client.use(require('./lib/plugins/title'));
client.use(require('./lib/plugins/spotify'));

// TODO handle somewhere else (maybe a plugin for this)
var nicknameTries = 0;
client.on('data', function(message) {
  if(message.command === 'RPL_WELCOME') {
    client.join(config.channels);
  }
  if(message.command === 'ERR_NICKNAMEINUSE') {
    nicknameTries++;
    client.nick(config.nickname + nicknameTries);
  }
});
