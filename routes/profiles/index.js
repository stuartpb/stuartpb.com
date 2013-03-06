//extend `require` with YAML
require('js-yaml');

module.exports = function(req,res,cb) {
  res.render(__dirname+'/index.jade',{profiles: require('./profiles.yaml')});
};
