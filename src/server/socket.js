"use strict";
const SocketIO = require('socket.io');
const uuid = require('uuid');

// The virtual viewport size
const ViewportWidth = 600;
const ViewportHeight = 600;

// Speed at which the bullets fly
const BulletSpeed = 9;
const PlayerWidth = 24;
const PlayerHeight = 32;
const PlayerMoveSpeed = 3;
const PlayerTurnSpeed = 2.8;

// Objects to store the bullets and players
var players = {};
var playerIndex = {};
var bullets = {};

module.exports = (httpServer) => {
    var io = SocketIO(httpServer, {'pingTimeout': 2000});

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

    // Generate random integer
    let randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Calculate the next point
    let findNewPoint = (x, y, angle, distance) => {
        return {
            x: Math.round(Math.cos((angle - 90) * Math.PI / 180) * distance + x),
            y: Math.round(Math.sin((angle - 90) * Math.PI / 180) * distance + y)
        }
    }

    // animate the bullets and remove when neccesary
    let animate = () => {
        // Move all the players
        movePlayers();

        // Check for fire events for all players
        firePlayers();

        // Iterate through all bullets
        Object.keys(bullets).map((key) => {
            let tempBullet = bullets[key];

            // Check if the bullet is still within viewport range
            if (tempBullet.x > ViewportWidth + 50 || tempBullet.x < -50 ||
                tempBullet.y > ViewportHeight + 50 || tempBullet.y < -50) {
                // rekt the bullet
                delete bullets[key];
            } else {
                // Calculate the new position
                var newPoint = findNewPoint(tempBullet.x, tempBullet.y, tempBullet.angle, BulletSpeed);

                // update values
                bullets[key].x = newPoint.x;
                bullets[key].y = newPoint.y;
            }
        });
    }

    // Check all players if they want/can fire
    var firePlayers = () => {
        // Loop through players
        Object.keys(playerIndex).map((key) => {
            let playerIndexInfo = playerIndex[key];
            let randId = playerIndexInfo.randId;
            let playerInfo = players[randId];

            if (!playerInfo) {
                return;
            }

            // Check if we're firing
            if (!playerInfo.actions.fire) {
                return;
            }

            // check if we're allowed to fire
            if (playerIndexInfo.allowFire !== true) {
                // Calculate time difference
                let timeDiff = new Date().getTime() - playerIndexInfo.allowFire;
                // Allow every x seconds, else return and dont do anything
                if (timeDiff < 250) {
                    return
                }
            }

            // Check if player still exists
            if (playerInfo) {
                // add new bullet
                bullets[uuid()] = {
                    x: playerInfo.x,
                    y: playerInfo.y,
                    angle: playerInfo.angle,
                }

                // set the player timeout value
                playerIndexInfo.allowFire = new Date().getTime();
            }
        });
    }

    // Check the movement for this player and update it
    var movePlayers = () => {
        // Loop through all players
        Object.keys(playerIndex).map((key) => {
            let playerIndexInfo = playerIndex[key];
            let playerInfo = players[playerIndexInfo.randId];

            if (!playerInfo || !playerInfo.actions) {
                return;
            }

            let tempMoveSpeed = PlayerMoveSpeed;
            let tempTurnSpeed = PlayerTurnSpeed;
            let yChange = 0;
            let angleChange = 0;

            // Sprint modifier
            if (playerInfo.actions.sprint) {
                tempMoveSpeed += 1.5;
                tempTurnSpeed *= 0.7;
            }

            // Go through all active movements
            if (playerInfo.actions.up) {
                yChange -= tempMoveSpeed;
            }
            if (playerInfo.actions.down) {
                yChange += tempMoveSpeed;
            }
            if (playerInfo.actions.right) {
                angleChange += tempTurnSpeed;
            }
            if (playerInfo.actions.left) {
                angleChange -= tempTurnSpeed;
            }

            // calculate the new angle and set it
            players[playerIndexInfo.randId].angle = playerInfo.angle + angleChange;
            ;

            // Check if we require to update player position
            if (yChange !== 0) {

                // Calculate the new position
                var newPoint = findNewPoint(playerInfo.x, playerInfo.y, playerInfo.angle, PlayerMoveSpeed);

                // Set the x/y
                let tempNewX = newPoint.x;
                let tempNewY = newPoint.y;

                // Calculate x/y based on angle
                if (yChange > 0) {
                    tempNewX += tempMoveSpeed * Math.cos((players[playerIndexInfo.randId].angle + 90) * Math.PI / 180);
                    tempNewY += tempMoveSpeed * Math.sin((players[playerIndexInfo.randId].angle + 90) * Math.PI / 180);
                } else if (yChange < 0) {
                    tempNewX -= tempMoveSpeed * Math.cos((players[playerIndexInfo.randId].angle + 90) * Math.PI / 180);
                    tempNewY -= tempMoveSpeed * Math.sin((players[playerIndexInfo.randId].angle + 90) * Math.PI / 180);
                }

                // check out of bounds
                if (tempNewX < 0) {
                    tempNewX = 0;
                }
                if (tempNewX > ViewportWidth - PlayerWidth) {
                    tempNewX = ViewportWidth - PlayerWidth;
                }
                if (tempNewY < 0) {
                    tempNewY = 0;
                }
                if (tempNewY > ViewportHeight - PlayerHeight) {
                    tempNewY = ViewportHeight - PlayerHeight;
                }

                // Update values
                players[playerIndexInfo.randId].x = tempNewX;
                players[playerIndexInfo.randId].y = tempNewY;
            }
        })
    }

    io.on('connection', (socket) => {
        var socketId = socket.id;
        var randId = uuid();
        var clientIp = socket.request.connection.remoteAddress;

        // TODO propper ip checks
        var IpFound = false;
        Object.keys(playerIndex).map((key) => {
            if (clientIp === playerIndex[key]['clientIp']) {
                IpFound = true;
            }
        });

        // Create a new random player
        playerIndex[socketId] = {
            socketId: socketId,
            randId: randId,
            clientIp: clientIp,
            allowFire: true
        }
        // Set the intitial player info
        players[randId] = {
            // Random spawn points
            x: randomInt(0, ViewportWidth),
            y: randomInt(0, ViewportHeight),
            // Random angle
            angle: randomInt(0, 360),
            // Random color
            color: '#' + '0123456789abcdef'.split('').map(function (v, i, a) {
                return i > 5 ? null : a[Math.floor(Math.random() * 16)]
            }).join(''),
            // Default action values
            actions: {
                up: false,
                down: false,
                left: false,
                right: false,
                sprint: false,
                fire: false
            }
        }

        // Tells the client its new id
        socket.emit('update id', randId);

        // Update the viewport
        socket.emit('update viewport', {
            width: ViewportWidth,
            height: ViewportHeight
        });

        // Send the player list to everyone
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

            // Check if we need to fire
            firePlayers(socketId);
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
        // If we have atleast 1 player
        if (Object.keys(players).length > 0) {
            // Animate function
            animate();

            // Send the info to the clients
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
                // Delete the index values
                delete player[playerIndex[key]['randId']];
                delete playerIndex[key];
            }
        });
    }, 2000)

    return io;
}
