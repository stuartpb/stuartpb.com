//extend `require` with YAML
var yaml = require('js-yaml');
var fs = require('fs');
var xdate = require('xdate');

var dataFilename = __dirname+'/resume.yaml';
var dataSource = fs.readFileSync(dataFilename,"utf8");
var locals = yaml.load(dataSource, {filename: dataFilename});

//allow Jade template to load marked and xdate by exposing require
locals.require = require;

exports.html = function(req,res,cb) {
  res.render(__dirname+'/index.jade',locals);
};

function indent(str) {
  return '  '+str.replace(/\n/g,'\n  ').trim();
}

exports.md = function(req,res,cb) {
  res.set('Content-Type', 'text/markdown; charset=UTF-8');
  //just so I don't go out of my mind with "locals.contact."s
  var name = locals.contact.name;
  var addr = locals.contact.address;
  res.send([
    '# '+[name.first,name.mi,name.last].join(' ')+ ' #',
    addr.street + (addr.ext ? ", " + addr.ext : ' ') + ', '+
      addr.city + ', ' + addr.state.abbr + ' ' + addr.zip,
    "Email: " + locals.contact.email + " Phone: " + locals.contact.phone,
    "\n## Tech Experience ##\n",
    locals.techs.map(function(category){for(var name in category){
      return '- ' + name + ': ' + (Array.isArray(category[name]) ?
        category[name].join(', ') :
        "\n" + indent(category[name]));
    }}).join('\n'),
    "\n## Work Experience ##\n",
    locals.work.map(function(job){
      return '- '+job.position + ', ' + job.organization + ', ' +
        job.timespan.from + ' - ' + job.timespan.to + '\n' +
        indent(job.tasks);
    }).join('\n'),
    "\n## Portfolio ##\n",
    locals.portfolio.trim(),
    "\n## Education ##\n",
    locals.education.map(function(edu){
      return '- '+edu.accolade + ', ' + edu.institution;
    }).join('\n'),
    "\n## About Resume ##\n",
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