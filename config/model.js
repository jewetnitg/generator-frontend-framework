/**
 * @author rik
 */
var args = require('../lib/args');
var appConfig = require('../lib/files/appConfig');

module.exports = {
  // do not run the repository generator as well, default behaviour
  repository: false,
  args: {
    'name': {
      type: String,
      required: false
    }
  },
  prompts: {
    'name': {
      type: 'input',
      message: 'Please enter the name of this model',
      when: function () {
        return !args.name;
      },
      validate: function (input) {
        return !!input;
      }
    },
    'connection': {
      type: 'input',
      message: 'What connection should this model use?',
      default: appConfig && appConfig.defaultConnection,
      required: true,
      validate: function (input) {
        var connections;
        var connectionsPath = process.cwd() + '/src/js/config/connections.js';

        try {
          connections = require(connectionsPath);
        } catch (err) {
          return "Can't add model, connections config not found.";
        }

        if (!input) {
          return "A connection is required.";
        }

        if (!connections[input]) {
          return "Can't add model, connection '" + input + "' not found.";
        }

        return !!input && !!connections[input];
      }
    }
  },
  templates: [
    ['model.ejs', 'src/js/api/models/<%= name %>.js']
  ]
};