var redis_client = require('../redis.js').createClient(),
    db_info = require('./_info.js'),
    RSVP = require('rsvp'),
    settings = require('../../settings.js');


// SELECT * FROM USERS WHERE ID = id
function getUserById(id) {
  var promise = new RSVP.Promise(function(resolve, reject) {
    redis_client.hmget(db_info.getTableName('users'), id, function(err, replies) {
      if(err) {
        reject(err);
      } else if (!replies || !replies.length || !replies[0]) {
        reject({message:'User Not Found', err:"USER_NOT_FOUND"});
      } else {
        resolve(JSON.parse(replies[0]));
      }
    });
  });
  return promise;
}

// INSERT INTO USERS (...profile_attributes...) VALUES(...profile_values...)
// OR UPDATE, etc
function saveUser(profile) {
  var promise = new RSVP.Promise(function(resolve, reject) {
    redis_client.hset(db_info.getTableName('users'), profile.id, JSON.stringify(profile), function(err) {
      if(err) { reject(err); }
      else { resolve(profile); }
    });
  });
  return promise;
}

// SELECT * FROM USERS
function getAllUsers() {
  var promise = new RSVP.Promise(function(resolve, reject) {
    redis_client.hvals(db_info.getTableName('users'), function(err, replies) {
      if(err) { reject(err); }
      else {
        resolve(replies.map(function(user_data) { return JSON.parse(user_data); }));
      }
    });
  });
  return promise;
}

module.exports = {
  getUserById: getUserById,
  saveUser: saveUser,
  getAllUsers: getAllUsers,
};
