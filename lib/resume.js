var yaml = require('js-yaml');
var fs = require('fs');
var moment = require('moment');
var marked = require('marked');

var dataFilename = __dirname + '/../data/resume.yaml';
var dataSource = fs.readFileSync(dataFilename, "utf8");
var resumeData = yaml.load(dataSource, {filename: 'resume.yaml'});

exports.html = function(req, res) {
  // functions used by Jade template
  res.locals.moment = moment;
  res.locals.marked = marked;

  res.render('resume.jade', resumeData);
};

exports.md = function(req, res) {
  res.set('Content-Type', 'text/markdown; charset=UTF-8');

  var name = resumeData.contact.name;
  var addr = resumeData.contact.address;

  res.send([
    '# ' + [name.first, name.mi, name.last].join(' ') + ' #',
    addr.street + (addr.ext ? ", " + addr.ext : ''),
    addr.city + ', ' + addr.state.abbr + ' ' + addr.zip,
    "Email: " + resumeData.contact.email,
    "Phone: " + resumeData.contact.phone,

    "\n## Experience ##\n",
    resumeData.experience.map(function(job){
      var title = [];
      if (job.title) title.push(job.title);
      if (job.organization) title.push(job.organization);
      if (job.summary) title.push(job.summary);
      return '### ' + title.join(', ') + ', ' +
        job.timespan.from + ' - ' + job.timespan.to + ' ###\n' +
        job.tasks.trim();
    }).join('\n\n'),

    "\n## Portfolio ##\n",
    resumeData.portfolio.trim(),

    "\n## Skills ##\n",
    resumeData.skills.join(', '),

    "\n## Education ##\n",
    resumeData.education.map(function(edu) {
      return '- ' + edu.accolade + ', ' + edu.institution + ', ' +
        edu.timespan.from + ' - ' + edu.timespan.to;
    }).join('\n'),

    "\n---\n",

    "Version "+resumeData.version+", rendered "+moment().format('MMM D YYYY')+".",
    "The latest version of this resume is available in HTML format at " +
      resumeData.online.html+" and in Markdown format at " +
      resumeData.online.markdown,
    "The underlying data used to generate this resume is available at " +
      resumeData.online.yaml
  ].join('\n'));
};

exports.yaml = function(req,res,cb) {
  res.set('Content-Type', 'text/yaml; charset=UTF-8');
  res.send(dataSource);
};