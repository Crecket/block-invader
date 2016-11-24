"use strict";
const SocketIO = require('socket.io');
const uuid = require('uuid');

var players = {};
var playerIndex = {};
var bullets = {};

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
        io.emit('bullets', bullets);
    }

    io.on('connection', (socket) => {
        var socketId = socket.id;
        var randId = uuid();

        // Create a new random player
        playerIndex[socketId] = {
            socketId: socketId,
            randId: randId
        }

        // Tells the client its new id
        socket.emit('update id', randId);

        // Send initial player list
        SendPlayers();

        // Receive new player info from client
        socket.on('update player', (playerInfo) => {
            if (players[randId]) {
                // Player exists, just update new values
                Object.assign(players[randId], playerInfo);
            } else {
                // Create new player
                players[randId] = playerInfo;
            }
        });

        // Receive new player info from client
        socket.on('fire', () => {
            // add new bullet
            bullets[uuid()] = {
                type: 'bullet',
                x: players[randId].x,
                y: players[randId].y,
                angle: players[randId].angle,
            }
        });

        // Client disconnected
        socket.on('disconnect', () => {
            // destroy the inf  idels
            delete players[randId];
            delete playerIndex[socketId];

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
