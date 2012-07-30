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

function importConfigData(env,cb) {
  env.config = {deploy: require('./config/deploy.json')}
  cb(env)
}

function setupEnv(env,cb) {
  envChain(env,[
    describeVersion,
    importPackageInfo,
    importConfigData,
    cb
  ])
}


function buildStep(env,cb) {
  env.pages = [
    {
      built: resume.build(env),
      filename: resume.filename
    }
  ]

  return cb(env)
}

function deployStep(env, cb) {

  if (env.describedVersion != env.pkg.version){
  //the version that would be committed would be different from what
  //the package manifest describes

    if (~process.argv.indexOf('--force')){
      //just continue without throwing an error, this is just as planned
    }
    else {
      console.error("Working copy does not match tag, aborting deployment\n" +
        "(Use --force to override)")
      process.exit(0)
    }
  }

  //start sftp in 'batch' mode, taking actions from stdin
  var connection = spawn("sftp",['-b', '-', env.config.deploy.host])

  //pipe output from sftp directly to the console
  connection.stdout.on('data', function (data) {
    process.stdout.write(data);
  });

  for (var i = 0; i<env.pages.length; i++) {
    var page = env.pages[i]
    //Command sftp to send the file to the deploy path
    connection.stdin.write('put '+page.built+' '+env.config.deploy.path+page.filename)
  }
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
