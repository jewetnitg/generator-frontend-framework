/**
 * @author rik
 */
var babel = require('babel-core');

function tryRequire(path) {
  var module;
  var fullPath = process.cwd() + path;

  try {
    var transformed = babel.transformFileSync(fullPath, {
      presets: ['babel-preset-es2015']
    });

    module = eval(transformed.code);
  } catch (err) {
    // oh well, we tried...
    console.warn('Failed to load module', path, err);
  }

  return module;
}

module.exports = tryRequire;