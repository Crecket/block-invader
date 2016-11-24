"use strict";
const SocketIO = require('socket.io');
const uuid = require('uuid');

var players = {};
var playerIndex = {};
var objects = {};

module.exports = (httpServer) => {
    var io = SocketIO(httpServer);

    // Emit general server info
    let SendInfo = () => {
        SendPlayers();
        SendObjects();
    }

    let SendPlayers = () => {
        io.emit('players', players);
    }

    let SendObjects = () => {
        io.emit('objects', objects);
    }

    io.on('connection', (socket) => {
        var socket_id = socket.id;
        var randId = uuid();

        // Create a new random player
        playerIndex[socket_id] = {
            socketId: socket_id,
            randId: randId
        }

        // Tells the client its new id
        socket.emit('update id', randId);

        // Send initial player list
        SendPlayers();

        // Receive new player info from client
        socket.on('update player', (playerInfo) => {
            var randId = playerIndex[socket_id].randId;
            if (players[randId]) {
                // Player exists, just update new values
                Object.assign(players[randId], playerInfo);
            } else {
                // Create new player
                players[randId] = playerInfo;
            }
        });

        // Receive new player info from client
        socket.on('fire', (bulletInfo) => {
            // add new bullet
            objects[uuid()] = {
                type: 'bullet',
                x: bulletInfo.x,
                y: bulletInfo.y,
                angle: bulletInfo.angle,
            }
        });

        // Client disconnected
        socket.on('disconnect', () => {
            var randId = playerIndex[socket_id].randId;

            // destroy the inf  idels
            delete players[randId];
            delete playerIndex[socket_id];

            // Make sure other clients realize the player is gone
            io.emit('player leave', randId);
        })
    });

    // Update clients every frame ~16 ms
    setInterval(() => {
        if (Object.keys(players).length > 0) {
            SendInfo();
        }
    }, 1000 / 60)

    return io;
}
