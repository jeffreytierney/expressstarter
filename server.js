var express = require('express'),
  app = express(),
  swig = require('swig'),
  settings = require('./settings.js'),
  routing_table = require('./routes/routes.js'),
  server_init = require('./routes/server_init.js'),
  cookieParser = require('cookie-parser'),
  passport = require('passport'),
  csrf = require('csurf'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  User = require('./models/user.js'),
  RedisStore = require('connect-redis')(session),
  redis_client = require('./lib/redis.js').createClient();


// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/static'));


// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
if(process.env.NODE_ENV !== 'production') {
  // To disable Swig's cache, do the following:
  swig.setDefaults({ cache: false });
  // NOTE: You should always cache templates in a production environment.
  // Don't leave both of these to `false` in production!
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.find(id).then(function(user) {
    done(null, user);
  }, function(err) {
    done(null, false);
  });
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: '3mb' }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser(settings.COOKIE_SECRET));
// app.use(session({
//   cookie: {
//     maxAge:1000*60*60*24*365
//   },
//   secret: settings.COOKIE_SECRET,
// }));
app.use(session({
    store: new RedisStore({
      client: redis_client,
      disableTTL: true
    }),
    secret: settings.COOKIE_SECRET,
    unset: 'destroy'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(csrf());
//app.use(csrf({cookie:true}));
// error handler
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  // handle CSRF token errors here
  res.status(403);
  res.send('session has expired or form tampered with');
});

server_init.init(app, routing_table);
app.listen(settings.SERVER_PORT);

console.log(process.env.NODE_ENV + ' Application Started on http://localhost:'+settings.SERVER_PORT+'/');
