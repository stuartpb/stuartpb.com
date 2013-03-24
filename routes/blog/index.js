module.exports = function (req, res){
  res.send('<head><title>NO BLOGS HERE</title></head><body>'+
  '<svg viewBox="0 0 240 140">'+
  '<text font-family="Impact, sans-serif" font-size="72" '+
      'x="120" y="70" '+
      'style="stroke: black; stroke-width: 10px; '+
      'text-anchor: middle;">SOON</text>'+
  '<text font-family="Impact, sans-serif" font-size="72" '+
      'x="120" y="70" '+
      'style="fill: white; text-anchor: middle;">SOON</text>'+
      '</svg></body>');
};

/*

var jackman = require("jackman");

module.exports = jackman({publish: false})
  .posts('./s/:category/:slug')
  .views('./s/:category/:view')
  .views('.')
  .configs('./s/:category/config')
  .route('/s/:category/:slug','post')
  .route('/s/:category/:page','list')
  .route('/s/:category','list');

*/