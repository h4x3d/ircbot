/*jslint node: true */
'use strict';

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  BearerStrategy = require('passport-http-bearer').Strategy,
  config = require('../../config'),
  User = require('../../models/user'),
  jwt = require('jwt-simple');

passport.use(new LocalStrategy(User.authenticate.bind(User)));

passport.use(new BearerStrategy(
  function(token, done){
    try {
      var decoded = jwt.decode(token, config.plugins.api.secret);
      User.findOne({ username: decoded.username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
    catch(err){
      err.status = err.status || 401;
      return done(err);
    }
  }
));
