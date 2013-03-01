// Node builtins
var fs = require('fs');

// modules
var jade = require('jade');

//extend `require` with YAML
require('js-yaml');

// constants
var pagename = 'resume';
var extension = '.html';
function construct(req,res) {
  //The data for the page.
  var data = require('./data.yaml');

  return jade.renderFile({data: data, env: req, require: require},res.send);
}

exports.construct = construct;

//The destination filename of the page
exports.filename = function(env){return '/'+pagename + extension};

exports.build = function(env) {
  var builtname = 'build/'+ pagename + '-' + env.describedVersion + extension;

  //save the built file
  construct(env,{send: function(content){
    fs.writeFileSync(builtname, content)}
  });

  //return the path to the output file
  return builtname;
};
