var express = require('express');
var router = express.Router();
var _ = require('lodash');

var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

var User = require('../mongodb/models').User;

// High level serialize/de-serialize configuration for passport
passport.serializeUser(function(user, done) {
  console.log('serialize user to session: ' + user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, function(err, user) {
    console.log('deserialize user from session', user);
    done(null, user);
  });
});

// Github-specific
passport.use(new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.WUKONG_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('in strategy, got profile: ', profile);
    User.findOneAndUpdate(
      { 'data.oauth': profile.id },
      {
        $set: {
          'profile.username': profile.username,
          'profile.profileUrl': profile.profileUrl,
          'profile.picture': _.isEmpty(profile.photos) ? null : profile.photos[0]['value'],
          'profile.email': _.isEmpty(profile.emails) ? null : profile.emails[0]['value'],
          'data.github': profile._json
        }
      },
      { new: true, upsert: true, runValidators: true },
      function(error, user) {
        done(error, user);
      });
  }));

router.use(passport.initialize());
router.use(passport.session());

// Express routes for auth
router.get('/github',
  passport.authenticate('github', { scope: [] }));

router.get('/github/callback',
  passport.authenticate('github', {
    successRedirect: process.env.WUKONG_SUCCESS_REDIRECT,
    failureRedirect: process.env.WUKONG_FAILURE_REDIRECT
  }));

router.get('/logout', function(req, res) {
  console.log('hit logout');
  req.logout();
  res.end();
});

// got user data if user login
router.get('/me', function(req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.json({ data: null });
  }
});

module.exports = router;
