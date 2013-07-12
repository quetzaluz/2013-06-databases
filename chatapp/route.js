//helper library and functions for routing.
var fileStream;
var fs = require("fs");

var pathLib = [
  ['/vendor/jquery/jquery-1.9.1.js', 'text/javascript'],
  ['/css/reset.css', 'text/css'],
  ['/css/styles.css', 'text/css'],
  ['/js/setup.js', 'text/javascript']
];

exports.findResource = function (request, response) {
  var pathFound;
  for (var i = 0; i < pathLib.length; i++) {
    if (request.url === pathLib[i][0]) {
      pathFound = true;
      respond(response, i);
    }
  }
  if (!pathFound) {
    response.writeHead(404);
    response.end("404 - Undefined File");
  }
};

var respond = function (response, index) {
  var fileStream = fs.readFile(__dirname + pathLib[index][0],
    function (err, data) {
      if (err) {
        response.writeHead(500);
        return response.end('Error loading ' + pathLib[index][0]);
      }
      response.writeHead(200, {'Content-Type': pathLib[index][1]});
      response.end(data);
    });

};