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
      message: 'Please enter the name of this request, may be deep (user.login) for example',
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
      validate: function (input) {
        var connections;
        var connectionsPath = process.cwd() + '/src/js/config/connections.js';

        try {
          connections = require(connectionsPath);
        } catch (err) {
          return "Can't add request, connections config not found.";
        }

        if (!input) {
          return "A connection is required.";
        }

        if (!connections[input]) {
          return "Can't add request, connection '" + input + "' not found.";
        }

        return !!input && !!connections[input];
      }
    },
    'method': {
      type: 'list',
      message: 'Please choose a method for the request',
      choices: ['get', 'post', 'put', 'delete'],
      default: 'get'
    },
    'route': {
      type: 'input',
      message: 'Please enter the route of this request',
      validate: function (input) {
        return !!input;
      }
    }
  },
  templates: [
    ['request.ejs', 'src/js/api/requests/<%= name %>.js']
  ]
};