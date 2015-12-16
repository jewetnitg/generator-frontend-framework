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
var dataMiddleware = require('../lib/files/dataMiddleware');
var policies = require('../lib/files/securityMiddleware');

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
    'route.view': {
      type: 'list',
      message: 'Please choose a View for the route',
      choices: views
    },
    'route.middleware.security': {
      type: 'checkbox',
      message: 'What security middleware should be applied to this route?',
      choices: policies
    },
    'route.middleware.data': {
      type: 'checkbox',
      message: 'What data middleware should be applied to this route?',
      choices: dataMiddleware
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