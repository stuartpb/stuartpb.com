// Node builtins
var fs = require('fs')

// modules
var marked = require('marked')
var jsdom = require('jsdom').jsdom
var xdate = require('xdate')
var yaml = require('js-yaml')

// helpers / shortened functions
function rfs(name){
  //TODO: wrap in try-catch, return null if no file
  return fs.readFileSync(name,'utf8')
}

// constants
var pagename = 'resume'
var extension = '.html'
// this is stupid, but nothing can be done
var dataModDir = '../data/'+pagename+'/'
var dataFileDir = 'data/'+pagename+'/'

function construct(env) {

  //The skeletal HTML for the page.
  var skelhtml = rfs('skeletons/' + pagename + extension)
  //The data (currently just one big Markdown blob).
  var mdsrc = rfs("data/resume.md")

  var document = jsdom(skelhtml);

  //Element ID selector. If I wanted to pretend I was using jQuery I could name this '$'
  function dgebi(id) {return document.getElementById(id)}

  //Helper functions to construct elements
  function techex() {
    var techsets = require(dataModDir + 'tech-experience.yaml')
    var setlist = document.createElement('ul')
    for (var i=0; i < techsets.length; i++){ for(var name in techsets[i]){
      var set = techsets[i][name]
      var setitem = document.createElement('li')
      setitem.textContent += name +": "
      if(typeof(set)=="string") { //couldn't come up with a better way to do Hardware
        setitem.innerHTML += marked(set)
      } else {
        for(var j=0;j<set.length;j++){
          var skill = document.createElement('span')
          skill.className = 'skill'
          skill.textContent = set[j]
          setitem.appendChild(skill)
          //yes, really, this is the comma separation. no, I'm not proud.
          if(j!=set.length-1) setitem.appendChild(document.createTextNode(', '))
        }
      }
      setlist.appendChild(setitem)
    }}
    return setlist
  }

  function workex() {
    function timespan(times) {
      return times.from + ' - ' + times.to
    }
    var jobs = require(dataModDir + 'work-experience.yaml')
    var joblist = document.createElement('ul')
    for (var i=0; i < jobs.length; i++){
      var job = jobs[i]
      var jobitem = document.createElement('li')
      jobitem.appendChild(document.createTextNode(
        job.position + ', ' + job.organization + ', ' + timespan(job.timespan)))

      jobitem.innerHTML += marked(job.tasks)

      joblist.appendChild(jobitem)
    }
    return joblist
  }

  function education() {
    var edus = require(dataModDir + 'education.yaml')
    var edulist = document.createElement('ul')
    for (var i=0; i < edus.length; i++){
      var edu = edus[i]
      var eduitem = document.createElement('li')
      eduitem.textContent= edu.accolade + ', ' + edu.institution
      edulist.appendChild(eduitem)
    }
    return edulist
  }

  // Insert meat into skeleton
  dgebi('tech-experience').appendChild(techex())

  dgebi('work-experience').appendChild(workex())

  var mdPortfolio = rfs(dataFileDir + 'portfolio.md')
  dgebi('portfolio').innerHTML += marked(mdPortfolio)

  dgebi('education').appendChild(education())

  dgebi('version').textContent = env.describedVersion

  dgebi('build-date').textContent = xdate().toString('MMM d yyyy')

  return "<!DOCTYPE html>\n" + document.innerHTML
}

exports.construct = construct

//The destination filename of the page
exports.filename = function(env){return pagename + extension}

exports.build = function(env) {
  var builtname = 'build/'+ pagename + '-' + env.describedVersion + extension

  //save the built file
  fs.writeFileSync(builtname, construct(env))

  //return the path to the output file
  return builtname
}
