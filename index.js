var express = require("express");
var yaml = require('js-yaml');
var fs = require('fs');

function loadYamlData(filename) {
  return yaml.load(
    fs.readFileSync(__dirname + '/data/' + filename, 'utf8'),
    {filename: filename});
}

var resume = require('./lib/resume.js');
var profiles = loadYamlData('profiles.yaml');

module.exports = function appctor(cfg){
  var app = express();

  app.use(express.static(__dirname+'/static'));

  app.get('/resume',      resume.html);
  app.get('/resume.html', resume.html);
  app.get('/resume.md',       resume.md);
  app.get('/resume.markdown', resume.md);
  app.get('/resume.txt',      resume.md);
  app.get('/resume.yaml', resume.yaml);

  app.get('/profiles', function(req,res) {
    res.render('profiles.jade', {profiles: profiles});
  });

  app.get('/specs', function(req,res) {
    res.render('specs.jade');
  });
  app.get('/info', function(req, res) {
    res.redirect('/specs');
  });

  return app;
};
