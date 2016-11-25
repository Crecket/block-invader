"use strict";
const SocketIO = require('socket.io');
const uuid = require('uuid');

const viewportWidth = 400;
const viewportHeight = 400;

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
        io.emit('update players', players);
    }

    let SendObjects = () => {
        io.emit('update bullets', bullets);
    }

    io.on('connection', (socket) => {
        var socketId = socket.id;
        var randId = uuid();
        var clientIp = socket.request.connection.remoteAddress;

        // Check ip
        var IpFound = false;
        Object.keys(playerIndex).map((key) => {
            if (clientIp === playerIndex[key]['clientIp']) {
                IpFound = true;
            }
        });
        if (IpFound) {
            // already connected
            // socket.disconnect();
            // return;
        }

        // Create a new random player
        playerIndex[socketId] = {
            socketId: socketId,
            randId: randId,
            clientIp: clientIp
        }

        // Tells the client its new id
        socket.emit('update id', randId);

        // Update the viewport
        socket.emit('update viewport', {
            width: viewportWidth,
            height: viewportHeight
        })

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
            delete playerIndex[clientIp];

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

    // Check for inactivity
    setInterval(() => {
        var sockets = io.sockets.sockets;

        // Loop through player index
        Object.keys(playerIndex).map((key) => {
            var tempPlayer = playerIndex[key];

            // Check if socket still exists
            if (!sockets[tempPlayer.socketId]) {
                console.log('not found');
                // Delete the index values
                delete player[playerIndex[key]['randId']];
                delete playerIndex[key];
            }
        });
    }, 3000)

    return io;
}
