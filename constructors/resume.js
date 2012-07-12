// Node builtins
var fs = require('fs')

// modules
var marked = require('marked')
var jsdom = require('jsdom').jsdom
var xdate = require('xdate')

// helpers / shortened functions
function rfs(name){
  //TODO: wrap in try-catch, return null if no file
  return fs.readFileSync(name,'utf8')
}

// constants
var pagename = 'resume'
var extension = '.html'

function construct(env) {
  //read in the data at build time (rather than require time)
  //  (No real good reason to cache it like that)

  //The skeletal HTML for the page.
  var skelhtml = rfs('skeletons/' + pagename + extension)
  //The data (currently just one big Markdown blob).
  var mdsrc = rfs('data/resume.md')

  //assemble the components of the resume
  var doctype = "<!DOCTYPE html>\n"

  var document = jsdom(skelhtml);

  //Element ID selector. If I wanted to pretend I was using jQuery I could name this '$'
  function dgebi(id) {return document.getElementById(id)}

  dgebi('content').innerHTML = marked(mdsrc)

  dgebi('version').textContent = env.version

  dgebi('build-date').textContent = xdate().toString('MMM d yyyy')

  return doctype + document.innerHTML
}

exports.construct = construct

//The destination filename of the page
exports.filename = function(env){return pagename + extension}

exports.build = function(env) {
  var builtname = 'build/'+ pagename + '-' + env.version + extension

  //save the built file
  fs.writeFileSync(builtname, construct(env))

  //return the path to the output file
  return builtname
}