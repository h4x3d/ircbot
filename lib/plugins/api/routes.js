/*jslint node: true */
'use strict';

var _ = require('lodash');
var passport = require('passport');
var config = require('../../config');
var User = require('../../models/user');
var jwt = require('jwt-simple');

/**
 * Checks that user is logged in
 */

function requiresUser(req, res, next) {
  if(!req.user) {
    return next(unauthorized());
  }
  next();
}

/**
 * Creates "not found" error
 */

function notFound() {
  var err = new Error();
  err.status = 404;
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
   * Returns current user is the parameter is "me"
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
   * Config methods
   */

  app.route('/api/configs/current')
  .get(function (req, res) {
    res.send(200, config);
  })
  .put(function (req, res) {
    // Figure out if channel list changed, join to new ones, part from deleted ones
    _.difference(req.body.channels, config.channels).forEach(irc.join);
    _.difference(config.channels, req.body.channels).forEach(irc.part);

    _.extend(config, req.body);
    config.save();
    res.send(200, config);
  });

  io.on('authenticated', function (socket) {
    socket.on('send', function(opts) {
      irc.send(opts.target, opts.message);
    });
  });

  irc.on('data', io.emit.bind(io, 'data'));
  irc.on('join', io.emit.bind(io, 'join'));
  irc.on('part', io.emit.bind(io, 'part'));
  irc.on('message', io.emit.bind(io, 'message'));
};
