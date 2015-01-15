  var env = process.env.NODE_ENV || "development";

var settings = {
};

var env_settings = {
  development: {
    SERVER_PORT: 5000,
    COOKIE_SECRET: '', // NEED TO SET THIS
    REDIS_HOST: "localhost",
    REDIS_PORT: "6379",
    REDIS_USER: "",
    REDIS_PW: "",
    TWITTER: { // NEED TO CREATE A TWITTER APP TO GENERATE THESE (recommendedto have a separate app for dev/prod/etc)
      consumer_key: '',
      consumer_secret: '',
    },
    ORIGIN: 'http://yourapp.local:5000' // this needs to match the callback url on the twitter app
  },
  production: {
    SERVER_PORT: process.env.PORT, // heroku assigns a port to this env var
    COOKIE_SECRET: '',
    REDIS_HOST: "",
    REDIS_PORT: "",
    REDIS_USER: "",
    REDIS_PW: "",
    TWITTER: {
      consumer_key: '',
      consumer_secret: '',
    },
    ORIGIN: 'https://yourapp.com'
  }
};

for(var key in env_settings[env]) {
  settings[key] = env_settings[env][key];
}
console.log(settings.ORIGIN);
module.exports = settings;
