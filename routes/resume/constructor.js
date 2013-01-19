// Node builtins
var fs = require('fs')

// modules
var jade = require('jade')
var yaml = require('js-yaml')

// helpers / shortened functions
function rfs(name){
  //TODO: wrap in try-catch, return null if no file
  return fs.readFileSync(name,'utf8')
}

// constants
var pagename = 'resume'
var extension = '.html'
function construct(env) {

  //The skeletal HTML for the page.
  var skelhtml = rfs(__dirname+'template.jade')

  //The data for the page.
  var data = require('./data.yaml')

  var fn = jade.compile(skelhtml,{pretty: true})
  return fn({data: data, env: env, require: require})
}

exports.construct = construct

//The destination filename of the page
exports.filename = function(env){return '/'+pagename + extension}

exports.build = function(env) {
  var builtname = 'build/'+ pagename + '-' + env.describedVersion + extension

  //save the built file
  fs.writeFileSync(builtname, construct(env))

  //return the path to the output file
  return builtname
}
