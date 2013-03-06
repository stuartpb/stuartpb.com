var express = require("express");

var app = express();

app.use(express.static(__dirname+'/static'));

app.get('/resume(.html)?',require('./routes/resume/index.js'));
app.get('/info',require('./routes/info/index.js'));
app.get('/profiles',require('./routes/profiles/index.js'));

module.exports = app;
