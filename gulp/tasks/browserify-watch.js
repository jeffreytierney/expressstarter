var browserify = require('./browserify'),
    watch = require('gulp-watch');

module.exports = function() {
  browserify();
  return watch([
    './static-src/js/**/*.js'
  ], browserify);
};
