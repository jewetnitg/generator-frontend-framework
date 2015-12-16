var fs = require('fs');
var _ = require('lodash');
var glob = require('glob');

// sync is slower, but worth it in this case in my opinion
function directoryReader(path, defaults, extension, mapFn) {
  extension = extension || 'js';
  var extensionRegex = new RegExp('.' + extension + '$', 'ig');
  var fullPath = process.cwd() + path;
  var dst = _(glob.sync(fullPath + '/**/*.' + extension))
    .map(function (file) {
      var _file = file
        .replace(extensionRegex, '')
        .replace(fullPath, '')
        .replace(/^[\/|\\]+/ig, '')
        .replace('/', '.');

      return mapFn ? mapFn(_file) : _file;
    })
    .value();

  if (Array.isArray(defaults)) {
    dst.unshift.apply(dst, defaults);
  }

  return dst;
}

module.exports = directoryReader;