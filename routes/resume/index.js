//extend `require` with YAML
require('js-yaml');

module.exports = function(req,res,cb) {
  //The data for the page.
  var locals = require('./data.yaml');
  locals.require = require;

  res.render(__dirname+'/index.jade',locals);
};
