/*jslint node: true */
/* jshint -W079 */
'use strict';

var _ = require('lodash');
var passport = require('passport');
var config = require('../../config');
var Promise = require('bluebird');
var User = require('../../models/user');
var Channel = require('../../models/channel');
var jwt = require('jwt-simple');

/**
 * Creates "not found" error
 */

function notFound() {
  var err = new Error();
  err.status = 404;
  return err;
}

/**
 * Creates "bad request" error
 */

function badRequest() {
  var err = new Error();
  err.status = 400;
  return err;
}

/**
 * Creates "unauthorized" error
 */

function unauthorized() {
  var err = new Error();
  err.status = 401;
  return err;
}

module.exports = function(app, io, irc) {

  /**
   * Protect all endpoints except login with bearer token authentication
   * Lets all requests with OPTIONS method through
   */

   app.use(function(req, res, next) {
    if(req.url === '/api/login' || req.method === 'OPTIONS') {
      return next();
    }
    passport.authenticate('bearer', { session: false }).apply(null, arguments);
   });

  /**
   * Login
   */

  app.route('/api/login')
  .post(passport.authenticate('local', { session: false }), function (req, res) {
    res.send(200, {token: jwt.encode({ username: req.user.username }, config.plugins.api.secret) });
  });

  /**
   * Searches user inputted as "user" parameter.
   * Returns current user if the parameter is "me"
   */

  app.param('user', function(req, res, next, id) {
    if(id === 'me') {
      if(!req.user) {
        return next(unauthorized());
      }
      req.params.user = req.user;
      return next();
    }

    User.findOne({_id: id}, function(err, user) {
      if(err) return next(err);
      if(!user) return next(notFound());
      res.params.user = user;
      next();
    });

  });

  /**
   * User methods
   */

  app.route('/api/users')
  .get(function (req, res, next) {
    User.find({}, function(err, users) {
      if(err) return next(err);
      res.send(200, users);
    });
  })
  .post(function (req, res, next) {
    User.create(req.body, function(err, user) {
      if(err) return next(err);
      res.send(201, user);
    });
  });

  app.route('/api/users/:user')
  .get(function (req, res) {
    res.send(200, req.params.user);
  })
  .put(function (req, res, next) {
    _.extend(req.params.user, req.body);
    req.params.user.save(function(err, user) {
      if(err) return next(err);
      res.send(200, user);
    });
  })
  .delete(function (req, res, next) {
    req.params.user.remove(function(err) {
      if(err) return next(err);
      res.send(200);
    });
  });

  /**
   * Searches channel inputted as "channel" parameter.
   */

  app.param('channel', function(req, res, next, id) {
    Channel.findOne({_id: id}, function(err, channel) {
      if(err) return next(err);
      if(!channel) return next(notFound());
      res.params.channel = channel;
      next();
    });
  });

  /**
   * Channels methods
   */

  app.route('/api/channels')
  .get(function (req, res, next) {
    Channel.find({}, function(err, channels) {
      if(err) return next(err);
      res.send(200, channels);
    });
  })
  .post(function (req, res, next) {
    Channel.create(req.body, function(err, channel) {
      if(err) return next(err);

      irc.join(channel.name);

      res.send(201, channel);
    });
  })
  .delete(function (req, res, next) {
    if(!req.query.name) {
      return next(badRequest());
    }

    Channel.find({name: req.query.name}).exec()
    .then(function(channels) {

      irc.part(_.pluck(channels, 'name'));

      return Promise.all(channels.map(function(channel) {
        return channel.removeAsync();
      }));

    }).then(function() {
      res.send(200);
    }, next);
  });

  app.route('/api/channels/:channel')
  .get(function (req, res) {
    res.send(200, req.params.channel);
  })
  .put(function (req, res, next) {
    _.extend(req.params.channel, req.body);
    req.params.channel.save(function(err, channel) {
      if(err) return next(err);
      res.send(200, channel);
    });
  })
  .delete(function (req, res, next) {
    req.params.channel.remove(function(err) {
      if(err) return next(err);
      res.send(200);
    });
  });

  io.on('authenticated', function (socket) {

    socket.on('send', function(opts) {
      irc.send(opts.target, opts.message);
    });

    socket.on('nick', function(opts) {
      irc.nick(opts.nick);
    });

    socket.on('me', function(callback) {
      callback(irc.me);
    });

    irc.on('data', socket.emit.bind(socket, 'data'));
    irc.on('join', socket.emit.bind(socket, 'join'));
    irc.on('part', socket.emit.bind(socket, 'part'));
    irc.on('nick', socket.emit.bind(socket, 'nick'));
    irc.on('message', socket.emit.bind(socket, 'message'));

  });

};
