var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;
    // keys = require('../../config.js');

var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

module.exports = function (app) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      // callbackURL: "http://localhost:5000/auth/facebook/callback"
      callbackURL: "http://boundlessbaby.herokuapp.com/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  ));

  app.get('/',
    passport.authenticate('facebook'),
    function(req, res) {

    });

  app.get('/callback',
    passport.authenticate('facebook', { failureRedirect:'/login'}),
    function(req, res) {
      console.log('authenticated');
      res.redirect('http://boundlessbaby.herokuapp.com/#/groups');
    });
};
