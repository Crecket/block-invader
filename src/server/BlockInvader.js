const Helpers = require('./Helpers');
const uuid = require('uuid');

// Objects to store the bullets and players
var players = {};
var playerIndex = {};
var bullets = {};

module.exports = class BlockInvader {
    constructor(io) {
        this.io = io;

        // The virtual viewport size
        this.ViewportWidth = 600;
        this.ViewportHeight = 600;

        // Speed at which the bullets fly
        this.BulletSpeed = 9;
        this.PlayerWidth = 24;
        this.PlayerHeight = 32;
        this.PlayerMoveSpeed = 3;
        this.PlayerTurnSpeed = 2.8;

        // Listen for connection event
        this.io.on('connection', (socket) => {
            this._SocketConnect(socket);
        })

        // Update clients every frame ~16 ms
        setInterval(() => {
            // If we have atleast 1 player
            if (Object.keys(players).length > 0) {
                // Animate function
                this.animate();

                // Send the info to the clients
                this.sendInfo();
            }
        }, 1000 / 60)

        // Check for inactivity
        setInterval(() => {
            var sockets = this.io.sockets.sockets;

            // Loop through player index
            Object.keys(playerIndex).map((key) => {
                var tempPlayer = playerIndex[key];

                // Check if socket still exists
                if (!sockets[tempPlayer.socketId]) {
                    // Delete the index values
                    delete players[playerIndex[key]['randId']];
                    delete playerIndex[key];
                }
            });
        }, 2000)

    }

    _SocketConnect(socket) {
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
            x: Helpers.randomInt(0 + this.PlayerWidth, this.ViewportWidth + this.PlayerWidth),
            y: Helpers.randomInt(0 + this.PlayerWidth, this.ViewportHeight + this.PlayerWidth),
            // Random angle
            angle: Helpers.randomInt(0, 360),
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
            width: this.ViewportWidth,
            height: this.ViewportHeight
        });

        // Send the player list to everyone
        this.sendPlayers();

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

        // Client disconnected
        socket.on('disconnect', () => {
            // destroy the inf  idels
            delete players[randId];
            delete playerIndex[socketId];

            // Make sure other clients realize the player is gone
            this.io.emit('player leave', randId);
        })
    }

    // animate the bullets and remove when neccesary
    animate() {
        // Move all the players
        this.movePlayers();

        // Check for fire events for all players
        this.firePlayers();

        // Iterate through all bullets
        Object.keys(bullets).map((key) => {
            let tempBullet = bullets[key];

            // Check if the bullet is still within viewport range
            if (tempBullet.x > this.ViewportWidth + 50 || tempBullet.x < -50 ||
                tempBullet.y > this.ViewportHeight + 50 || tempBullet.y < -50) {
                // rekt the bullet
                delete bullets[key];
            } else {
                // Calculate the new position
                var newPoint = Helpers.findNewPoint(tempBullet.x, tempBullet.y, tempBullet.angle, this.BulletSpeed);

                // update values
                bullets[key].x = newPoint.x;
                bullets[key].y = newPoint.y;
            }
        });
    }

    // Check all players if they want/can fire
    firePlayers() {
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
    movePlayers() {
        // Loop through all players
        Object.keys(playerIndex).map((key) => {
            let playerIndexInfo = playerIndex[key];
            let playerInfo = players[playerIndexInfo.randId];

            if (!playerInfo || !playerInfo.actions) {
                return;
            }

            let tempMoveSpeed = this.PlayerMoveSpeed;
            let tempTurnSpeed = this.PlayerTurnSpeed;
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
                var newPoint = Helpers.findNewPoint(playerInfo.x, playerInfo.y, playerInfo.angle, this.PlayerMoveSpeed);

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
                if (tempNewX > this.ViewportWidth - this.PlayerWidth) {
                    tempNewX = this.ViewportWidth - this.PlayerWidth;
                }
                if (tempNewY < 0) {
                    tempNewY = 0;
                }
                if (tempNewY > this.ViewportHeight - this.PlayerHeight) {
                    tempNewY = this.ViewportHeight - this.PlayerHeight;
                }

                // Update values
                players[playerIndexInfo.randId].x = tempNewX;
                players[playerIndexInfo.randId].y = tempNewY;
            }
        })
    }

    // Send info to the clients
    sendInfo() {
        this.sendPlayers();
        this.sendObjects();
    }

    // Send player info
    sendPlayers() {
        this.io.emit('update players', players);
    }

    // Send bullet info
    sendObjects() {
        this.io.emit('update bullets', bullets);
    }
}