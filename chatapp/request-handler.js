/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var defaultCorsHeaders = require('./cors.js');
var fs = require("fs");
var route = require('./route.js'); //helper library and functions for routing

exports.handleRequest = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;

  var headers = {};
  for( var header in defaultCorsHeaders){
    headers[header] = defaultCorsHeaders[header];
  }

  headers['Content-Type'] = "text/plain";

  var data = '';
  switch (request.method) {
    case "POST":
      response.writeHead(201, headers);
      request.on('data', function (chunk) {
        data += chunk;
      });
      request.on('end', function () {
        var obj = JSON.parse(data);
        response.end();
      });
      break;
    case "GET":
      if (request.url.slice(0,9) === "/classes/") {
        headers['Content-Type'] = 'application/json';
        response.writeHead(200, headers);
        response.write(JSON.stringify({'username': 'TempTest', 'createdAt': '111', 'message': 'This is a test!'}));
        response.end();
      } else if (request.url.slice(0,6) === "/index"){
        headers['Content-Type'] = "text/html";
        var fileStream = fs.readFile(__dirname +'/index.html',
          function (err, data) {
            if (err) {
              console.log(err);
              response.writeHead(500);
              return response.end('Error loading index.html');
            }
            response.writeHead(200);
            response.end(data);
          });
      } else {
        route.findResource(request, response);
      }
  }
};