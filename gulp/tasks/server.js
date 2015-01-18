var gulp = require('gulp'),
    server = require('gulp-express'),
    watch = require('gulp-watch');

function runServer() {
  server.run({
    file: 'server.js'
  });
}

module.exports = function () {
  // Start the server at the beginning of the task
  runServer();
  // Restart the server when file changes
  return watch([
    './**/*.js',
    '!./node_modules/**/*.js',
    '!./static/js/**/*.js',
    '!./static-src/js/**/*.js'
  ], runServer);
};
