/**
 * @author rik
 */
var path = require('path');

var currentDirName = /(?:\/)([^\/]+)$/g.exec(process.cwd())[1];

module.exports = {
  // global settings

  welcomeMessage: 'Welcome to the frontend-framework generator!',

  // default generator to run
  defaultGenerator: 'app',

  // temp dir, repository will be cloned into this dir
  tempDir: '.tmp-frontend-boilerplate',

  // url of the repository that should be cloned to get the files for this generator
  repositoryUrl: 'https://github.com/jewetnitg/boilerplate.git',

  // files that should be copied from the repository
  repositoryFiles: [
    'jsdoc.config.json',
    'build.config.js',
    'karma.conf.js',
    'index.js',
    'gulpfile.js',
    '.gitignore'
  ],

  // directories that should be copied from the repository
  repositoryDirectories: [
    'tasks',
    'test',
    'src'
  ],

  // generator arguments to capture
  args: {},

  // repository prompts
  prompts: {
    'name': {
      type: 'input',
      message: 'Please enter the name of this project',
      default: currentDirName,
      validate: function (input) {
        return !!input;
      }
    },
    'description': {
      type: 'input',
      message: 'Please enter a description for this project'
    },
    'author': {
      type: 'input',
      message: 'Please enter your name'
    },
    'github.user': {
      type: 'input',
      message: 'Please enter your github username',
      validate: function (input) {
        return !!input;
      }
    },
    'github.repository': {
      type: 'input',
      message: 'Please the name of the github repository of this project',
      validate: function (input) {
        return !!input;
      }
    }
  }
};