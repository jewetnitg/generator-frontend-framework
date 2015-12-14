/**
 * @author rik
 */
var _ = require('lodash');
var tryRequire = require('../helpers/tryRequire');

var path = '/src/js/api/controllers/';

module.exports = _.flatten(
  require('../helpers/directoryReader')(path, null, null, function (file) {
    var controllerMethods = _.methods(tryRequire(path + file + '.js', true)) || [];

    // add methods provided by the base controller
    controllerMethods.unshift('list', 'details');

    return _.map(controllerMethods, function (method) {
      return file + "." + method;
    })
  })
);