"use strict";

const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const uuid = require('uuid');

var app = express();
var httpServer = http.Server(app);
var io = SocketIO(httpServer);

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

var players = {};
var playerIndex = {};

io.on('connection', (socket) => {
    var socket_id = socket.id;
    var rand_id = uuid();

    // Create a new random player
    playerIndex[socket_id] = {
        socketId: socket_id,
        randId: rand_id
    }
    players[rand_id] = {};

    // Tell the client its new id
    socket.emit('update id', rand_id);

    // Send initial player list
    SendPlayers();

    socket.on('update player', (playerInfo) => {
        var randId = playerIndex[socket_id].randId;

        // store data
        players[randId] = playerInfo;

        // update player
        SendPlayers();
    });

    socket.on('disconnect', () => {
        var randId = playerIndex[socket_id].randId;

        // destroy the inf  idels
        delete players[randId];
        delete playerIndex[socket_id];
    })
});

let InsertPlayer = (socketId) => {

}

let SendPlayers = () => {
    io.emit('players', players);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}