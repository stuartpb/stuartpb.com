var express = require("express");

module.exports = function appctor(cfg){
  var app = express();

  app.use(express.static(__dirname+'/static'));

  var resume = require('./routes/resume/index.js');

  app.get('/resume',      resume.html);
  app.get('/resume.html', resume.html);
  app.get('/resume.md',       resume.md);
  app.get('/resume.markdown', resume.md);
  app.get('/resume.txt',      resume.md);
  app.get('/resume.yaml', resume.yaml);

  app.get('/info',require('./routes/info/index.js'));
  app.get('/profiles',require('./routes/profiles/index.js'));
  return app;
};
