// modules
var jade = require('jade');

//extend `require` with YAML
require('js-yaml');

module.exports = function(req,res,cb) {
  //The data for the page.
  var locals = require('./data.yaml');
  locals.require = require;

  return jade.renderFile(__dirname+'/index.jade',locals,function(err,html){
    if(err) cb(err);
    else res.send(html);
  });
};

