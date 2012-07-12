// Node builtins
var fs = require('fs')
//JSON doesn't have to be required, as it's a global builtin in V8. Who knew?

// modules
var spawn = require('child_process').spawn

// page constructors
// TODO: this could be turned into a whole automated system,
//       reading in the contents of the constructors directory,
//       and loading, like, only what's being built on the
//       command line
var resume = require('./constructors/resume.js')

function rfs(name){
  //TODO: wrap in try-catch, return null if no file
  return fs.readFileSync(name,'utf8')
}
var pkgjson = rfs('package.json')

var pkg = JSON.parse(pkgjson)

function describedVersion() {
  //STUB: output from "git describe --tags --dirty=+work",
  //minus the 'v' at the fore
}

//See note below on the deploy() function signature for explanation/apology
function get_deploy_target() {

  //TODO: optionally take deploy path on the command line,
  //      or maybe read it as a config option or something
  //      instead of reading a line from a file
  //      like this whole hack job
  var pushurl = rfs('deploy_target')

  var captures = pushurl.match(/^(.*?)(\/.*)$/m)
  //regex is multiline to account for a newline at the end of the file
  //I think that's only proper

  //TODO: error if no captures (or if the destination ends with a slash too?)
  return {host: captures[1], path: captures[2]}
}

//NOTE: everything about this function signature is wrong, and is only like so
//  because it's caught between what it used to do (one script that
//  builds one fixed file and puts it to one fixed filename online) and what
//  it should be doing (generally uploading local files to remote locations).
//  Right now it generally uploads a local file to one fixed filename online,
//  like some sort of half-transformed pig-boy.
function deploy (builtname) {

  //TODO: stop if describedVersion() != pkg.version
  //(the version that would be committed would be different from what
  //the package manifest describes)

  //Get the deploy target info from the file that specifies it
  //(yes, that's messed up, not changing it right now)
  var target = get_deploy_target()

  //start sftp in 'batch' mode, taking actions from stdin
  var connection = spawn("sftp",['-b', '-', target.host])

  //pipe output from sftp directly to the console
  connection.stdout.on('data', function (data) {
    process.stdout.write(data);
  });

  //Command sftp to send the file to the deploy path
  connection.stdin.write('put '+builtname+' '+target.path)
  connection.stdin.end()
}

//TODO: allow separate building from deploying via command line
var builtname = resume.build({version: pkg.version})
deploy(builtname)