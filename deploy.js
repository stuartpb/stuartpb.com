// Node builtins
var fs = require('fs')
//JSON doesn't have to be required, as it's a global builtin in V8. Who knew?

// modules
var marked = require('marked')
var jsdom = require('jsdom').jsdom
var moment = require('moment')
var spawn = require('child_process').spawn

//TODO: stop if the working copy has uncommitted changes or the tip isn't a tag

function rfs(name){return fs.readFileSync(name,'utf8')}

var pushurl = rfs('deploy_target')
var skelhtml = rfs('skeletons/resume.html')
var mdsrc = rfs('resume.md')
var pkgjson = rfs('package.json')

//assemble the components of the resume

var pkg = JSON.parse(pkgjson)

var document = jsdom(skelhtml);

function dgebi(id) {return document.getElementById(id)}

dgebi('content').innerHTML = marked(mdsrc)

dgebi('version').textContent = pkg.version

dgebi('build-date').textContent = moment().format('MMM D YYYY')

var doctype = "<!DOCTYPE html>\n"

var pagesrc = doctype + document.innerHTML

//save the built file
var builtname = 'build/resume-' + pkg.version + '.html'
fs.writeFileSync(builtname, pagesrc)

//send the page to the server
var captures = pushurl.match(/^(.*?)(\/.*)$/m)
//regex is multiline to account for a newline at the end of the file
//I think that's only proper

//TODO: error if no captures (or if the destination ends with a slash too?)

var targethost = captures[1], targetpath = captures[2]

//start sftp in 'batch' mode, taking actions from stdin
var connection = spawn("sftp",['-b', '-', targethost])

//pipe output from sftp directly to the console
connection.stdout.on('data', function (data) {
  process.stdout.write(data);
});

connection.stdin.write('put '+builtname+' '+targetpath)
connection.stdin.end()
