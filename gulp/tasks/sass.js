var gulp = require('gulp'),
    sass = require('gulp-sass');

module.exports = function () {
  gulp.src('./static-src/scss/*.scss')
      .pipe(sass({errLogToConsole: true}))
      .pipe(gulp.dest('./static/css/'));
};
