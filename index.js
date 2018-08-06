//Module for setting up local environment variables
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');

const config = require('./config.js');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());   // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true
}));
// app.use(express.json());       // to support JSON-encoded bodies
// app.use(express.urlencoded({
//   extended: true
// })); // to support URL-encoded bodies

// Library for allowing cross-origin access
const cors = require('cors');

const corsOptions = {
  origin: config.client.url,
  optionsSuccessStatus: 200,
  credentials: true
}

// Using the Middlewire to allow CROSS-ORIGIN-ACCESS-POLICY
app.use(cors(corsOptions));

//router.js define all routes in this server
const router = require('./router');
// Passing app to routers, using router.js to define all the routes
router(app);

const port  = process.env.PORT || 3001;
const server = http.createServer(app);

//sockets contains the neccessary code for making socket connection with the client;
const openSocketsConnection = require('./services/sockets');

//attach sockets to the server, app for routing apis related to the socket connections;
openSocketsConnection(server, app);

server.listen(port);
console.log("Server is running on port: " + port);

module.exports = server;
