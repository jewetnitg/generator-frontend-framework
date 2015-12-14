var fs = require('fs');
var _ = require('lodash');

// sync is slower, but worth it in this case in my opinion
function directoryReader(path, defaults, extension, mapFn) {
  extension = extension || 'js';
  var extensionRegex = new RegExp('.' + extension + '$', 'ig');
  var dst = [];

  try {
    dst = _(fs.readdirSync(process.cwd() + path))
      .filter(function (file) {
        return file.match(extensionRegex);
      })
      .map(function (file) {
        var _file = file.replace(extensionRegex, '');

        return mapFn ? mapFn(_file) : _file;
      })
      .value();
  } catch (err) {
    // this is allowed to throw and not be handled, it is a valid use case for the directory not to exist
  }

  if (Array.isArray(defaults)) {
    dst.unshift.apply(dst, defaults);
  }

  return dst;
}

module.exports = directoryReader;