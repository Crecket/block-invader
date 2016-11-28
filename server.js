"use strict";

// Libraries
const express = require('express');
const http = require('http');

// Create apps and connections
var app = express();
var httpServer = http.Server(app);

// Socket io handlers
var BlockInvaderApp = require('./src/server/App')(httpServer);

// publc files
app.use(express.static('public'))

// Vendor files
app.get('/fabric.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/fabric/dist/fabric.js');
});
app.get('/jquery.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.js');
});
app.get('/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io-client/socket.io.js');
});
app.get('/socket.io.min.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io-client/socket.io.min.js');
});
app.get('/socket.io.js.map', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io-client/socket.io.js.map');
});

httpServer.listen(3000, function () {
    console.log('listening on *:3000 in ' + process.env.NODE_ENV + ' mode');
});