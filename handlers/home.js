var settings = require('../settings.js');

var home = {};

home.get = function(req, res) {
  if(req.user) {
    //console.log(req.user);
    // do something different
    res.render('index', {
      user: req.user
    });
  } else {
    res.render('index', {
      user: null
    });
  }
};

home.logout = function(req, res){
  req.session = null;
  res.redirect('/');
};

home.login = function(req, res){
  req.session = null;
  res.redirect('/connect/twitter');
};

module.exports = home;
