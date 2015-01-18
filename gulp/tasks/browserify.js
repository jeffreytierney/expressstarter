var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var swigify = require('swigify');

module.exports = function() {
  process.env.BROWSERIFYSWAP_ENV='all';
  return browserify(['./static-src/js/main.js'])
      .transform(swigify())
      .bundle()
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('main.js'))
      // Start piping stream to tasks!
      .pipe(gulp.dest('./static/js/'));
};
