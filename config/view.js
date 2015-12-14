/**
 * @author rik
 */
var fs = require('fs');
var args = require('../lib/args');
var props = require('../lib/props');
var defaults = require('../lib/defaults');

var viewConfig = require('../lib/files/viewConfig');
var tags = require('../lib/files/tags');
var viewAdapters = require('../lib/files/viewAdapters');

var CREATE_NEW_TAG = 'Create new tag';
tags.unshift(CREATE_NEW_TAG);

defaults.tag = false;

module.exports = {

  args: {
    'name': {
      type: String,
      required: false
    }
  },

  prompts: {
    'view.name': {
      type: 'input',
      message: 'Please enter the name of this view, UserLoginView for example',
      when: function () {
        return !args.name;
      },
      validate: function (input) {
        return !!input;
      }
    },
    // @todo refactor to be called template
    // @todo implement for multiple adapters
    'view.tag': {
      type: 'list',
      choices: tags,
      message: 'What tag should this view use?',
      validate: function (input) {
        return !!input;
      }
    },
    'view.holder': {
      type: 'input',
      message: 'Please enter the selector this view should be appended to',
      default: (viewConfig && viewConfig.holder) || undefined,
      validate: function (input) {
        return !!input;
      }
    },
    'view.adapter': {
      type: 'list',
      choices: viewAdapters,
      message: 'Please choose an Adapter to use'
    },
    'tag.name': {
      type: 'input',
      message: 'Please enter a name for the tag, user-login for example',
      when: function (opts) {
        return opts['view.tag'] === CREATE_NEW_TAG;
      },
      validate: function (input) {
        return !!input && !tags[input];
      }
    }
  },

  templates: [
    ['view.ejs', 'src/js/api/views/<%= view.name %>.js'],
    ['../tag/tag.ejs', 'src/tags/<%= tag.name %>.tag', function () {
      return props.tag.name;
    }]
  ]

};