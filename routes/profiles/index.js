var yaml = require('js-yaml');
var fs = require('fs');
var profiles = yaml.load(fs.readFileSync(__dirname+'/profiles.yaml','utf8'));

module.exports = function(req,res,cb) {
  res.render(__dirname+'/index.jade',{profiles: profiles});
};
