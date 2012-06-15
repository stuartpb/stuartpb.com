// Node builtins
var fs = require('fs')
//JSON doesn't have to be required, as it's a global builtin in V8. Who knew?

// modules
var marked = require('marked')
var jsdom = require('jsdom')
var moment = require('moment')
var sftp = require('sftp')

//TODO: stop if the working copy has uncommitted changes or the tip isn't a tag

function rfs(name){return fs.readFileSync(name,'utf8')}

var pushurl = rfs('deploy_target')
var skelhtml = rfs('skeletons/resume.html')
var mdsrc = rfs('resume.md')
var pkgjson = rfs('package.json')

//assemble the components of the resume

var pkg = JSON.parse(pkgjson)

var document = jsdom.jsdom(skelhtml);

function dgebi(id) {return document.getElementById(id)}

dgebi('content').innerHTML = marked(mdsrc)

dgebi('version').textContent = pkg.version

dgebi('build-date').textContent = moment().format('MMM D YYYY')

var doctype = "<!DOCTYPE html>\n"

var pagesrc = doctype + document.documentElement.outerHTML

//send the page to the server

console.log(document.innerHTML)

var captures = pushurl.match(/^(.*?)(\/.*)$/m)
//regex is multiline to account for a newline at the end of the file
//I think that's only proper

//TODO: error if no captures (or if the destination ends with a slash too?)

var targethost = captures[1], targetpath = captures[2]

sftp({
  host: targethost
}, function(ctn){
  ctn.writeFile(targetpath,pagesrc,'utf8',function(err){
    console.log(err)
    })
})
