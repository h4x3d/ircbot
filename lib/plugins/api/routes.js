/*jslint node: true */
'use strict';

var _ = require('lodash');
var passport = require('passport');
var config = require('../../config');
var User = require('../../models/user');

/**
 * Checks that user is logged in
 */

function requiresUser(req, res, next) {
  console.log(requiresUser);
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
   * Login
   */

  app.route('/api/login')
  .post(passport.authenticate('local'), function (req, res) {
    res.send(200);
  });

  /**
   * Searches user inputted as "user" parameter.
   * Returns current user is the parameter is "me"
   */

  app.param('user', function(req, res, next, id) {
    if(id === 'me') {
      if(!req.user) {
        return next(notFound());
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
  .all(requiresUser)
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
  .all(requiresUser)
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

  irc.on('data', io.emit.bind(io, 'data'));
  irc.on('join', io.emit.bind(io, 'join'));
  irc.on('part', io.emit.bind(io, 'part'));
};
