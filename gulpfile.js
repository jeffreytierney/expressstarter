var gulp = require('./gulp')([
  'server',
  'browserify',
  'browserify-watch',
  'sass',
  'sass-watch'
]);

gulp.task('dev', ['browserify-watch', 'sass-watch', 'server']);
