var express = require('express');
var poet = require('poet');

var app = express();

app.use('/s/current',poet(express(),{
  posts: './s/current'
}).init());

module.exports = app;
