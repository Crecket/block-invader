"use strict";
const SocketIO = require('socket.io');
const uuid = require('uuid');

// The virtual viewport size
const viewportWidth = 500;
const viewportHeight = 500;

// Speed at which the bullets fly
const BulletSpeed = 9;

// Objects to store the bullets and players
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

    let findNewPoint = (x, y, angle, distance) => {
        return {
            x: Math.round(Math.cos((angle - 90) * Math.PI / 180) * distance + x),
            y: Math.round(Math.sin((angle - 90) * Math.PI / 180) * distance + y)
        }
    }

    // animate the bullets and remove when neccesary
    let animate = () => {
        Object.keys(bullets).map((key) => {
            let tempBullet = bullets[key];

            // Check if the bullet is still within viewport range
            if (tempBullet.x > viewportWidth || tempBullet.x < 0 ||
                tempBullet.y > viewportHeight || tempBullet.y < 0) {
                // rekt the bullet
                delete bullets[key];
            } else {
                // Calculate the new position
                console.log(tempBullet);
                var newPoint = findNewPoint(tempBullet.x, tempBullet.y, tempBullet.angle, BulletSpeed);

                // update values
                bullets[key].x = newPoint.x;
                bullets[key].y = newPoint.y;
            }
        });
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
        // TODO propper ip checks
        if (IpFound) {
            // already connected
            // socket.disconnect();
            // return;
        }

        // Create a new random player
        playerIndex[socketId] = {
            socketId: socketId,
            randId: randId,
            clientIp: clientIp,
            allowFire: true
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
            if (playerIndex[socketId].allowFire !== true) {
                // Calculate time difference
                let timeDiff = new Date().getTime() - playerIndex[socketId].allowFire;
                // Allow every x seconds, else return and dont do anything
                if (timeDiff < 250) {
                    return
                }
            }

            // Check if player still exists
            if (players[randId]) {
                // add new bullet
                bullets[uuid()] = {
                    x: players[randId].x,
                    y: players[randId].y,
                    angle: players[randId].angle,
                }

                // set the player timeout value
                playerIndex[socketId].allowFire = new Date().getTime();
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
        animate();
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
