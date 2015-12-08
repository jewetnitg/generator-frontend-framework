/**
 * @author rik
 */
var appConfig;
try {
  var appPath = process.cwd() + '/src/js/config/app.js';
  appConfig = require(appPath);
} catch (err) {
  // app config doesn't exist, which is fine, we can't get the defaultConnection because of this, but that's ok
}

module.exports = {
  // do not run the repository generator as well, default behaviour
  repository: false,
  args: {
    'name': {
      type: String
    }
  },
  prompts: {
    'name': {
      type: 'input',
      message: 'Please enter the name of this model',
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
    ['model.js.tpl', 'src/js/api/models/<%= name %>.js']
  ]
};