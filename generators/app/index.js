'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

// @todo set up gh-pages orhpan branch

var directories = [
  'docs',
  'test',
  'tasks',
  'src/assets',
  'src/tags',
  'src/js/config',
  'src/js/api/controllers',
  'src/js/api/models',
  'src/js/api/policies',
  'src/js/api/requests',
  'src/js/api/staticViews',
  'src/js/api/services',
  'src/js/api/views'
];

var files = [
  'jsdoc.config.json',
  'karma.conf.js',
  'index.js',
  'browserify.config.js',
  'gulpfile.js',
  '.gitignore'
];

var templates = [
  'package.json',
  'README.md'
];

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('frontend-framework') + ' generator!'
    ));

    var currentDirName = /(?:\/)([^\/]+)$/g.exec(process.cwd())[1];

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Please enter the name of this project',
        default: currentDirName,
        validate: function (input) {
          return !!input;
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please enter a description for this project'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Please enter your name'
      },
      {
        type: 'input',
        name: 'github.user',
        message: 'Please enter your github username',
        validate: function (input) {
          return !!input;
        }
      },
      {
        type: 'input',
        name: 'github.repository',
        message: 'Please the name of the github repository of this project',
        validate: function (input) {
          return !!input;
        }
      }
    ];

    this.prompt(prompts, function (props) {
      _.each(props, function (val, key) {
        if (key.indexOf('.') !== -1) {
          delete props[key];
          _.set(props, key, val);
        }
      });

      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: function () {
    var self = this;

    _.each(directories, function (directory) {
      self.mkdir(directory);
    });

    _.each(files, function (file) {
      self.fs.copy(
        self.templatePath(file),
        self.destinationPath(file)
      );
    });

    _.each(templates, function (file) {
      self.template(file, file, self.props);
    });
  },

  install: function () {
    this.npmInstall();
  }
});
