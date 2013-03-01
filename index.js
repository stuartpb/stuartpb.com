var express = require("express");

var app = express();

app.use(express.static(__dirname+'/static'));

app.get('/resume(.html)?',require('./routes/resume/index.js'));

module.exports = app;
