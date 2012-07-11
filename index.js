// Node builtins
var fs = require('fs')
//JSON doesn't have to be required, as it's a global builtin in V8. Who knew?

// modules
var marked = require('marked')
var jsdom = require('jsdom').jsdom
var xdate = require('xdate')
var spawn = require('child_process').spawn

function rfs(name){
  //TODO: wrap in try-catch, return null if no file
  return fs.readFileSync(name,'utf8')
}

var pushurl = rfs('deploy_target')
var skelhtml = rfs('skeletons/resume.html')
var mdsrc = rfs('data/resume.md')
var pkgjson = rfs('package.json')

var pkg = JSON.parse(pkgjson)

var builtname = 'build/resume-' + pkg.version + '.html'

function isWorkDirty () {
  //STUB: return bool for working directory status
  //(whether or not all changes are committed)
  //(test if "git status -s" output is empty I guess?)
}

function describedVersion() {
  //STUB: output from "git describe --tags",
  //minus the 'v' at the fore, plus a '+work'
  //if the working directory's dirty
  //(concat date/time in that case?)
}

function build() {
  //assemble the components of the resume
  var doctype = "<!DOCTYPE html>\n"

  var document = jsdom(skelhtml);

  function dgebi(id) {return document.getElementById(id)}

  dgebi('content').innerHTML = marked(mdsrc)

  dgebi('version').textContent = pkg.version

  dgebi('build-date').textContent = xdate().toString('MMM d yyyy')

  var pagesrc = doctype + document.innerHTML

  //save the built file
  fs.writeFileSync(builtname, pagesrc)
}

function deploy () {
  //TODO: stop if describedVersion() != pkg.version
  //(the version that would be committed would be different from what
  //the package manifest describes)

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
}

//TODO: allow separate building from deploying via command line
build()
deploy()
