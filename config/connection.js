/**
 * @author rik
 */
var fs = require('fs');
var args = require('../lib/args');
var adapters = require('../lib/files/adapters');

module.exports = {

  args: {
    'name': {
      type: String,
      required: false
    }
  },

  prompts: {
    'connection.name': {
      type: 'input',
      message: 'Please enter the name for this connection',
      when: function () {
        return !args.name;
      },
      validate: function (input) {
        return !!input;
      }
    },
    'connection.adapter': {
      type: 'list',
      message: 'Choose an adapter this connection should use to execute its requests',
      choices: adapters
    },
    'connection.url': {
      type: 'input',
      message: 'Please enter the base url of this connection (http://localhost:1337 for example)'
    }
  },

  templates: [
    ['connection.ejs', 'src/js/api/connections/<%= connection.name %>.js']
  ]

};