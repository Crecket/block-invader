"use strict";

// Libraries
const express = require('express');
const http = require('http');

// Create apps and connections
var app = express();
var httpServer = http.Server(app);

// Socket io handlers
var io = require('./src/server/socket')(httpServer);

// publc files
app.use(express.static('public'))

// Vendor files
app.get('/fabric.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/fabric/dist/fabric.js');
});
app.get('/jquery.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.js');
});

httpServer.listen(3000, function () {
    console.log('listening on *:3000');
});