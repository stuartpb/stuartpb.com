//extend `require` with YAML
var yaml = require('js-yaml');
var fs = require('fs');
var xdate = require('xdate');

var dataFilename = __dirname+'/resume.yaml';
var dataSource = fs.readFileSync(dataFilename,{encoding: "utf8"});
var locals = yaml.load(dataSource, {filename: dataFilename});

//allow Jade template to load marked and xdate by exposing require
locals.require = require;

exports.html = function(req,res,cb) {
  res.render(__dirname+'/index.jade',locals);
};

function indent(str) {
  return '    '+str.replace(/\n/g,'\n    ');
}

exports.md = function(req,res,cb) {
  res.set('Content-Type', 'text/markdown; charset=UTF-8');
  res.send(["Stuart P. Bentley",
    "500 Wall St, Apt. 1209, Seattle, WA 98121",
    "Email: stuart@testtrack4.com Phone: +1-610-761-0054",
    "",
    "Tech Experience:",
    locals.tech.map(function(category){for(var name in category){
      return '- ' + name + ': ' + (Array.isArray(category[name]) ?
        category[name].join(', ') :
        "\n" + indent(category[name]));
    }}).join('\n'),
    "",
    "Work Experience:",
    locals.work.map(function(job){
      return '- '+job.position + ', ' + job.organization + ', ' +
        job.timespan.from + ' - ' + job.timespan.to + '\n' +
        indent(job.tasks);
    }).join('\n'),
    "",
    "Portfolio",
    locals.portfolio,
    "",
    "Education",
    locals.education.map(function(edu){
      return '- '+edu.accolade + ', ' + edu.institution;
    }).join('\n'),
    "",
    "Version "+locals.version+", "+xdate().toString('MMM d yyyy')+".",
    "The latest version of this resume is available in HTML format at " +
      locals.online.html+" and in Markdown format at " +
      locals.online.markdown,
    "The underlying data used to generate this resume is available at " +
      locals.online.yaml
  ].join('\n'));
};

exports.yaml = function(req,res,cb) {
  res.set('Content-Type', 'text/yaml; charset=UTF-8');
  res.send(dataSource);
};