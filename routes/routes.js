var handlers = {
  home: require('../handlers/home.js'),
  twitter_auth: require('../handlers/twitter_auth.js'),
};

var routing_table = [
  { route: "/", get: handlers.home.get, add_csrf:true },
  { route: "/logout", get: handlers.home.logout },
  { route: "/login", get: handlers.home.login, logout:true },
  { route: "/connect/twitter", get: handlers.twitter_auth.auth },
  { route: "/connect/twitter/callback", get: handlers.twitter_auth.authCallback },
  { route: "/disconnect/twitter", get: handlers.twitter_auth.remove, auth:true },
];

var api_routing_table = [
];

var admin_routing_table = [
];

module.exports = routing_table.concat(api_routing_table).concat(admin_routing_table);
