/**
 * @author rik
 */
var fs = require('fs');
var _ = require('lodash');
var babel = require('babel-core');
var args = require('../lib/args');
var props = require('../lib/props');
var defaults = require('../lib/defaults');

var viewConfig = require('../lib/files/viewConfig');
var views = require('../lib/files/views');
var controllers = require('../lib/files/controllers');
var policies = require('../lib/files/policies');

var NO_CONTROLLER = 'No Controller';
var NEW_CONTROLLER = 'Create a new Controller';
var NEW_VIEW = 'Create a new View';

views.unshift(NEW_VIEW);
controllers.unshift(NO_CONTROLLER);
controllers.unshift(NEW_CONTROLLER);

defaults.view = false;
defaults.controller = false;

module.exports = {

  args: {
    'route': {
      type: String,
      required: false
    }
  },

  prompts: {
    'route.name': {
      type: 'input',
      message: 'Please enter the name for this route, insignificant but required',
      validate: function (input) {
        return !!input;
      }
    },
    'route.route': {
      type: 'input',
      message: 'What is the route for this route (/user/:id for example)',
      when: function () {
        return !args.route;
      },
      validate: function (input) {
        return !!input;
      }
    },
    'route.controller': {
      type: 'list',
      message: 'Please choose a Controller for this route',
      choices: controllers
    },
    'route.view': {
      type: 'list',
      message: 'Please choose a View for the route',
      choices: views
    },
    'route.policies': {
      type: 'checkbox',
      message: 'What policies should be applied to this route?',
      choices: policies
    },
    'route.unauthorized': {
      type: 'input',
      message: 'What route should be redirected to when one or more policies fail?',
      when: function (opts) {
        return opts['route.policies'] && opts['route.policies'].length;
      }
    }
  },

  templates: [
    ['route.ejs', 'src/js/api/routes/<%= route.name %>.js']
  ]

};