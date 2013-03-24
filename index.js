var express = require("express");

var app = express();

app.use(express.static(__dirname+'/static'));

var resume = require('./routes/resume/index.js');

app.get('/resume',resume.html);
app.get('/resume.html',resume.html);
app.get('/resume.md',resume.md);
app.get('/resume.yaml',resume.yaml);

app.get('/info',require('./routes/info/index.js'));
app.get('/profiles',require('./routes/profiles/index.js'));
app.use('/blog', require('./routes/blog/index.js'));

module.exports = app;
