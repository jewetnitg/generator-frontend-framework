'use strict';
var path = require('path');

var _ = require('lodash');
var ejs = require('ejs');
var yeoman = require('yeoman-generator');

var shell = require('../helpers/shell');
var args = require('../args');
var opts = require('../opts');
var defaults = require('../defaults');
var props = require('../props');
var generators = require('../../config');
var generatorConfig = require('../../generator.config');

// add generators to the config
_.extend(generatorConfig, generators);

function Generator() {

  return yeoman.generators.Base.extend({
    constructor: function () {
      yeoman.generators.Base.apply(this, arguments);

      var self = this;

      _.extend(props, {
        args: args,
        opts: opts
      });
      self.props = props;

      generatorConfig.args = generatorConfig.args || {};
      generatorConfig.args.generator = {
        type: String,
        required: false
      };

      registerArguments(self, generatorConfig.args);
      registerOptions(self, generatorConfig.opts);

      self.props.args.generator = self.generator = self.generator || generatorConfig.defaultGenerator;

      if (typeof self.generator !== 'string') {
        throw new Error('Generator must be a string');
      }

      var config = typeof self.generator === 'string' ? generatorConfig[self.generator] : self.generator;
      registerArguments(self, config.args);
      registerOptions(self, config.opts);
      this._generator = generateGenerator(config);

    },
    prompting: function () {
      if (this._generator.prompting) {
        this._generator.prompting.apply(this, arguments);
      }
    },

    writing: function () {
      if (this._generator.writing) {
        this._generator.writing.apply(this, arguments);
      }
    },

    install: function () {
      if (this._generator.install) {
        this._generator.install.apply(this, arguments);
      }
    }

  });
}

function registerArguments(generatorContext, _args) {
  _.each(_args, function (obj, name) {
    generatorContext.argument(name, obj);
    generatorContext.props.args[name] = generatorContext[name];
    args[name] = generatorContext[name];
  });
}

function registerOptions(generatorContext, _opts) {
  _.each(_opts, function (obj, name) {
    generatorContext.option(name, obj);
    generatorContext.props.opts[name] = generatorContext[name];
    opts[name] = generatorContext[name];
  });
}

function generateGenerator(config) {
  var prompts = {};
  var install;

  if (config.repository) {
    _.extend(prompts, generatorConfig.prompts);

    install = function () {
      this.npmInstall();
    };
  }

  _.extend(prompts, config.prompts);

  return {
    prompting: function () {
      var done = this.async();

      promptRunner(this, prompts, function () {
        done();
      });
    },

    writing: function () {
      generatorWriter(this, config);

      if (config.repository) {
        var done = this.async();

        repositoryCloner.write(this, function () {
          done();
        });
      }
    },

    install: install
  };
}

function generateRepositoryGenerator() {
  return {
    prompting: function () {
      var done = this.async();

      repositoryCloner.prompt(this, function () {
        done();
      });
    },

    writing: function () {
      var done = this.async();

      repositoryCloner.write(this, function () {
        done();
      });
    },

    install: function () {
      this.npmInstall();
    }
  };
}

var repositoryCloner = {

  prompt: function (generatorContext, callback) {
    promptRunner(generatorContext, generatorConfig.prompts, callback);
  },

  write: function (generatorContext, callback) {
    repositoryWriter(generatorContext, callback);
  }

};

function promptRunner(generatorContext, prompts, callback) {
  var _prompts = transformPrompts(prompts, generatorContext);
  generatorContext.prompt(_prompts, function (props) {
    _.each(props, function (val, key) {
      if (key.indexOf('.') !== -1) {
        delete props[key];
        _.set(props, key, val);
      }
    });

    _.extend(generatorContext.props, props);

    callback();
  });
}

function transformPrompts(prompts, generatorContext) {
  return _.map(prompts, function (prompt, name) {
    prompt.name = prompt.name || name;
    prompt.default = prompt.default || generatorContext.props.args[name] || generatorContext.props.opts[name];

    return prompt;
  });
}

function repositoryWriter(generatorContext, callback) {
  var shellCommands = [
    'rm -rf ' + generatorConfig.tempDir,
    'git clone ' + generatorConfig.repositoryUrl + ' ' + generatorConfig.tempDir
  ];

  _.each(generatorConfig.repositoryFiles, function (filePath) {
    var files = getSrcAndDst(filePath, generatorContext, true);

    if (when(files.when)) {
      var srcPath = path.join('.tmp-frontend-boilerplate', files.src);
      var dstPath = path.join('.', files.dst);
    }

    shellCommands.push('mv ' + srcPath + ' ' + dstPath);
  });

  _.each(generatorConfig.repositoryDirectories, function (dirPath) {
    var dirs = getSrcAndDst(dirPath, generatorContext, true);

    if (when(dirs.when)) {
      var srcPath = path.join('.tmp-frontend-boilerplate', dirs.src);
      var dstPath = path.join('.', dirs.dst);

      shellCommands.push('mv ' + srcPath + ' ' + dstPath);
    }

  });

  shellCommands.push('rm -rf ' + generatorConfig.tempDir);

  shell.series(shellCommands, function (err) {
    if (err) {
      throw err;
    }

    callback();
  });
}

function generatorWriter(generatorContext, config) {
  _.each(config.directories, function (directory) {
    //noinspection JSDeprecatedSymbols
    generatorContext.mkdir(directory);
  });

  _.each(config.files, function (file) {
    var files = getSrcAndDst(file, generatorContext);

    if (when(files.when)) {
      generatorContext.fs.copy(
        generatorContext.templatePath(files.src),
        generatorContext.destinationPath(files.dst)
      );
    }
  });

  _.each(config.templates, function (file) {
    var files = getSrcAndDst(file, generatorContext);

    if (when(files.when)) {
      generatorContext.template(files.src, files.dst, generatorContext.props);
    }
  });
}

function when(_when) {
  return _when !== false && (typeof _when !== 'function' || !!_when())
}

function getSrcAndDst(item, generatorContext, repository) {
  var src = item;
  var dst = item;
  var when = null;

  if (Array.isArray(item)) {
    src = item[0];
    dst = item[1];
    when = item[2];
  }

  if (!repository) {
    src = path.join(generatorContext.generator, src);
  }

  _.defaults(generatorContext.props, defaults, args, opts);

  return {
    when: when,
    src: src,
    dst: ejs.render(dst, generatorContext.props)
  };
}

module.exports = Generator;