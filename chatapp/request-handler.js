var defaultCorsHeaders = require('./cors.js');
var fs = require("fs");
var route = require('./route.js'); //helper library and functions for routing

var dbConnection = require(__dirname + '/../SQL/persistent_server.js').dbConnection;

exports.handleRequest = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;

  var headers = {};
  for( var header in defaultCorsHeaders){
    headers[header] = defaultCorsHeaders[header];
  }

  headers['Content-Type'] = "text/plain";

  switch (request.method) {
    case "POST":
      response.writeHead(201, headers);
      var data = '';
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
        dbConnection.query('SELECT * FROM messages', function(err, rows, fields) {
          if (err) throw err;
          else {
            console.log(rows);
            headers['Content-Type'] = 'application/json';
            response.writeHead(200, headers);
            response.write(JSON.stringify(rows[0]));
            response.end();
          }
        });
      } else if (request.url.slice(0,6) === "/index"){
        headers['Content-Type'] = "text/html";
        var fileStream = fs.readFile(__dirname + '/index.html',
          function (err, data) {
            if (err) {
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

