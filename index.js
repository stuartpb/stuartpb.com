// Node builtins
var fs = require('fs')
var spawn = require('child_process').spawn
var exec = require('child_process').exec

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

//envChain function to fight literal-call-stack paren-bloat.
//Takes an array, then calls each function in the array
//with the next function as a callback (or a nop for the
//last function's callback).
function envChain(startenv,steps){
  var complationCb
  completionCb = function(i){
    return function(env) {
        return steps[i](env,
          i < steps.length-1 ? completionCb(i+1) : function(env){})
    }
  }
  completionCb(0)(startenv)
}

// Environment setup /////////////////////////////////

function describeVersion(env,cb) {
  exec("git describe --tags --dirty=+work",
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ', error)
      }
      env.describedVersion = stdout.toString().replace(/^v|\n$/g,'')
      cb(env)
  })
}

function importPackageInfo(env,cb)
{
  env.pkg = require('./package.json')
  cb(env)
}

function setupEnv(env,cb) {
  envChain(env,[
    describeVersion,
    importPackageInfo,
    cb
  ])
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

function buildStep(env,cb) {

  env.pages = [{built: resume.build(env)}]

  return cb(env)
}

//NOTE: everything about this function signature is wrong, and is only like so
//  because it's caught between what it used to do (one script that
//  builds one fixed file and puts it to one fixed filename online) and what
//  it should be doing (generally uploading local files to remote locations).
//  Right now it generally uploads a local file to one fixed filename online,
//  like some sort of half-transformed pig-boy.
function deployStep(env, cb) {
  //The filename of the built page.
  var builtname = env.pages[0].built

  if (env.describedVersion != env.pkg.version){
  //the version that would be committed would be different from what
  //the package manifest describes
    if ('--force' in process.argv){
      //just continue without throwing an error, this is just as planned
    }
    else {
      console.error("Working copy does not match tag, aborting deployment\n" +
        "(Use --force to override)")
      process.exit(0)
    }
  }

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

function handleArgs(env,cb) {
  switch (process.argv[2]) {
    case "build":
      buildStep(env,cb)
      break
    case "deploy":
      envChain(env,[buildStep,deployStep,cb])
      break
    default:
      console.log('index.js expects the first argv to be either "build" or "deploy"')
  }
}

envChain({},[
  setupEnv,  //put data in the environment
  handleArgs //take whatever action was specified on the command line
])
