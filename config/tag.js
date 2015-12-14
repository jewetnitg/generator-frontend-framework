/**
 * @author rik
 */
var args = require('../lib/args');

module.exports = {

  args: {
    'name': {
      type: String,
      required: false
    }
  },

  prompts: {
    'tag.name': {
      type: 'input',
      message: 'Please enter the name of this tag',
      when: function () {
        return !args.name;
      },
      validate: function (input) {
        return args.name;
      }
    }
  },

  templates: [
    ['tag.ejs', 'src/tags/<%= name %>.tag']
  ]

};