var UserDB = require('../lib/db/user.js'),
    RSVP = require('rsvp'),
    settings = require('../settings.js'),
    _ = require('lodash');

var networks = settings.networks;


function User(profile) {
  this.id = profile.id;
  this.username = profile.username;
  this.data = profile;
}

User.prototype.isAdmin = function() {
  return (settings.admin_users.indexOf(this.login) >= 0);
};

var _user = {
  find: function(id) {
    var promise = new RSVP.Promise(function(resolve, reject) {
      UserDB.getUserById(id).then(function(profile) {
        resolve(new User(profile));
      }).catch(function(err) { reject(err); });
    });
    return promise;
  },
  save: function(profile) {
    var promise = new RSVP.Promise(function(resolve, reject) {
      UserDB.saveUser(profile).then(function(profile) {
        resolve(new User(profile));
      }).catch(function(err) { reject(err); });
    });
    return promise;
  },
  findOrCreate: function(user_data) {
    var promise = new RSVP.Promise(function(resolve, reject) {
        _user.find(user_data.id).then(function(user) {
          resolve(user);
      }).catch(function(err) {
        if(err && err.err === "USER_NOT_FOUND") {
          _user.save(user_data).then(function(user) {
            resolve(user);
          });
        } else {
          reject(err);
        }
      });
    });
    return promise;
  }
};

module.exports = _user;

