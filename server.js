var port = process.env.PORT || 3000;

require('./index.js').listen(port,function(){
  console.log("Listening on " + port);
});
