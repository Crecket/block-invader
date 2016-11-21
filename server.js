var express = require('express');
var http = require('http');
var SocketIO = require('socket.io');

var app = express();
var httpServer = http.Server(app);
var io = SocketIO(httpServer);

// publc files
app.use(express.static('public'))

app.get('/fabric.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/fabric/dist/fabric.js');
});

app.get('/node', (req, res) => {
    res.sendFile(__dirname + '/node_modules/fabric/dist/fabric.js');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

httpServer.listen(3000, function () {
    console.log('listening on *:3000');
});