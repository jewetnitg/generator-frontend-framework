/**
 * @author rik
 */
var babel = require('babel-core');

function tryRequire(path, es6) {
  var module;
  var fullPath = process.cwd() + path;

  if (es6) {
    try {
      var transformed = babel.transformFileSync(fullPath, {
        presets: ['babel-preset-es2015']
      });

      module = eval(transformed.code);
    } catch (err) {
      // oh well, we tried...
      console.warn('Failed to load es6 module', path, err);
    }
  } else {

    try {
      module = require(fullPath);
    } catch (err) {
      // oh well, we tried...
      console.warn('Failed to load module', path);
    }

  }

  return module;
}

module.exports = tryRequire;