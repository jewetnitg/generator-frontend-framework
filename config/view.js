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
    'view.riot': {
      type: 'list',
      choices: tags,
      message: 'What tag should this view use?',
      when: function (opts) {
        return opts['view.adapter'] === 'riot';
      },
      validate: function (input) {
        return !!input;
      }
    },
    'riot.name': {
      type: 'input',
      message: 'Please enter a name for the tag, user-login for example',
      when: function (opts) {
        return opts['view.adapter'] === 'riot' && opts['view.riot'] === CREATE_NEW_TAG;
      },
      validate: function (input) {
        if (tags[input]) {
          return "Riot tag with name '" + input + "' already exists.";
        }

        if (!input) {
          return "No name provided.";
        }

        return true;
      }
    }
  },

  transform: function (props) {
    var extensions = {
      'riot': 'tag'
    };
    props.view.template = {
      extension: extensions[props.view.adapter],
      name: props[props.view.adapter].name
    };
    var pathSuffix = props.view.adapter + '/' + props.view.template.name + '.' + props.view.template.extension;
    props.view.template.path = '../../../templates/' + pathSuffix;
    props.dstPath = 'src/templates/' + pathSuffix;
    return props;
  },

  templates: [
    ['view.ejs', 'src/js/api/views/<%= view.name %>.js'],
    ['../<%= view.adapter %>/<%= view.adapter %>.ejs', '<%= dstPath %>', function () {
      return props.view.adapter === 'riot' && props.riot && props.riot.name;
    }]
  ]

};