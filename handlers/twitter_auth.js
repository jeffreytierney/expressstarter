var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    settings = require('../settings.js'),
    User = require('../models/user.js');

passport.use(new TwitterStrategy({
    consumerKey: settings.TWITTER.consumer_key,
    consumerSecret: settings.TWITTER.consumer_secret,
    callbackURL: settings.ORIGIN+"/connect/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    //console.log(token, tokenSecret, profile);
    profile.tokens = {
      token: token,
      tokenSecret: tokenSecret
    };
    User.findOrCreate(profile).then(function(user) {
      done(null, user);
    }).catch(function(err) {
      console.log(err);
      done(null, null);
    });
  }
));
var twitter_auth = {};

twitter_auth.auth = passport.authenticate('twitter');
twitter_auth.authCallback = passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' });


twitter_auth.remove = function(req, res) {
  req.user.removeAccount("twitter").then(function() {
    redis_client.publish("account_activity", JSON.stringify({user_id:req.user.login, type:'account_disconnected', network:'twitter'}));
    res.redirect("/settings");
  }, function(err) {
    console.log(err);
    res.redirect("/settings");
  });
};


module.exports = twitter_auth;
