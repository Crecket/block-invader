"use strict";
const SocketIO = require('socket.io');
const BlockInvaderLib = require('./BlockInvader');

module.exports = (httpServer) => {
    // Create socket server
    this.io = SocketIO(httpServer, {'pingTimeout': 2000});

    // Create new blockinvader game
    this.BlockInvader = new BlockInvaderLib(this.io);

    // Return the app values
    return this;
}
