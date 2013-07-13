var mysql = require('mysql');

/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
exports.dbConnection = mysql.createConnection({
  user: "root",
  password: "publicpass",
  database: "chat"
});

/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */

var path = require("path");
var http = require("http");
var handlerpath = path.normalize(__dirname + '/../chatapp/request-handler.js')
var handleRequest = require(handlerpath).handleRequest;

var port = 8080;

var ip = "127.0.0.1";

var server = http.createServer(handleRequest);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

//exports.dbConnection.end();
//TODO: Figure out best time to close connection -- still new to using SQL with java, used to python SQL libraries. 