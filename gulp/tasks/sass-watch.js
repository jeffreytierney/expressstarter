var sass = require('./sass'),
    watch = require('gulp-watch');

module.exports = function() {
  sass();
  return watch([
    './static-src/scss/**/*.scss'
  ], sass);
};
