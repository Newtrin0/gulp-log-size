'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var prettyBytes = require('pretty-bytes');

module.exports = function (taskNote, options) {
  options = options || {};
  var count = 0;
  var totalSize = 0;
  var task = taskNote ? decorate('blue', taskNote) + ' ' : '';

  function decorate (color, text) {
    return text ? '[' + gutil.colors[color](text) + ']' : '';
  }

  return through.obj(function (file, enc, cb) {
    var items = [];

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('size', 'Streaming not supported'));
      return cb();
    }

    var size = file.contents.length;
    totalSize += size;
    count++;

    if (options.showFiles === true) {
      gutil.log(task + decorate('yellow', count) + ' ' +
        gutil.colors.blue(file.relative) +
        (file.isNull() ? decorate('magenta', 'EMPTY') : ' size: ' + prettyBytes(size));
    }

    this.push(file);
    cb();
  }, function (cb) {
    var task = taskNote ? decorate('blue', taskNote) + ' ' : '';
    gutil.log(task + 'Found ' + decorate('yellow', count) +
      ' files. ' + gutil.colors.green('Total size: ') + prettyBytes(totalSize));
    cb();
  });
};
