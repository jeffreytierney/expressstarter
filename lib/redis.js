var redis = require('redis'),
    settings = require('../settings.js');


var redis_client = {
  createClient: function() {
    var options = {};
    if(settings.REDIS_PW) {
      options.auth_pass = settings.REDIS_PW;
    }
    var client = redis.createClient(settings.REDIS_PORT, settings.REDIS_HOST, options);
    client.on("error", function (err) {
      console.log("Redis Error " + err);
    });
    return client;
  }
};

module.exports = redis_client;
