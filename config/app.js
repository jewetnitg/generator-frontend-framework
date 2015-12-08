/**
 * @author rik
 */
module.exports = {
  // run the repository generator as well
  repository: true,
  // prompts for the app generator
  prompts: {},
  // local directories
  directories: [
    'docs'
  ],
  // local files
  files: [],
  // local files
  templates: [
    'package.json',
    'README.md',
    ['README.md', 'docs/README.md']
  ]
};