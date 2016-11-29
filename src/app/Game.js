import CurrentPlayer from './CurrentPlayer';
import Player from './Player';
import Bullet from './Bullet';
import Viewport from './Viewport'

module.exports = class Game {

    // Player list
    players = {};

    // All bullets. Things like bullets and random bullets
    bullets = [];

    // this client's id
    client_id = false;

    // the canvas element
    canvas;

    constructor(width, height) {
        this.width = width;
        this.height = height

        // Connect to socket
        this.socket = io();

        // Set the socket handlers
        this.setSocketHandlers();

        // Create a new canvas element
        this.canvas = new fabric.Canvas('canvas', {
            width: width,
            height: height,
            selection: false,
            hoverCursor: 'default',
            scale: this.scale
        });

        // Keystroke handler
        document.onkeydown = this.handleKeyDown;
        document.onkeyup = this.handleKeyUp;

        // Generate the viewport handler
        this.viewport = new Viewport(this.canvas);

        // Generate a current player object
        this.currentPlayer = new CurrentPlayer(this.canvas, this.socket, this.viewport);

        // Window resize handler
        window.onresize = () => {
            this.screenResizeEvent();
        }

        // Window handlers to reset actions
        window.onblur = () => {
            this.currentPlayer.clearActions();
        }
        window.oncontextmenu = () => {
            this.currentPlayer.clearActions();
        }

        // Initial screen size check
        this.screenResizeEvent();

        // Timer with a delta value to keep everyone moving at the same speed
        this.deltaEvent(60, (delta) => {
            // Update the player
            this.currentPlayer.update(delta)

            // Render all other players/object
            this.render();
        });

    }

    /**
     * Handle keystroke events
     *
     * @param e
     */
    handleKeyDown = (e) => {
        e = e || window.event;

        global = 0;

        switch (e.keyCode) {
            case 38:
            case 87:
                this.currentPlayer.startAction('up');
                break;
            case 40:
            case 83:
                this.currentPlayer.startAction('down');
                break;
            case 37:
            case 65:
                this.currentPlayer.startAction('left');
                break;
            case 39:
            case 68:
                this.currentPlayer.startAction('right');
                break;
            case 16:
                this.currentPlayer.startAction('sprint');
                break;
            case 32: // space
            case 74: // j
                this.currentPlayer.startAction('fire');
                break;
        }
    }
    handleKeyUp = (e) => {
        e = e || window.event;

        switch (e.keyCode) {
            case 38:
            case 87:
                this.currentPlayer.stopAction('up');
                break;
            case 40:
            case 83:
                this.currentPlayer.stopAction('down');
                break;
            case 37:
            case 65:
                this.currentPlayer.stopAction('left');
                break;
            case 39:
            case 68:
                this.currentPlayer.stopAction('right');
                break;
            case 16:
                this.currentPlayer.stopAction('sprint');
                break;
            case 32: // space
            case 74: // j
                this.currentPlayer.stopAction('fire');
                break;
        }
    }

    /**
     * Render the players and other bullets
     */
    render = () => {
        // Calculate the offset we need to use to draw the other objects correctly
        var viewportOffsetWidth = this.canvas.width / 2 - this.currentPlayer.player.width / 2;
        var viewportOffsetHeight = this.canvas.height / 2 - this.currentPlayer.player.height / 2;

        // Loop through all players
        Object.keys(this.players).map((key) => {
            let tempPlayer = this.players[key];

            // Check if player is already rendered/has a player object
            if (!tempPlayer.object) {
                // Create new object at the correct location
                tempPlayer.object = new Player(
                    viewportOffsetWidth + tempPlayer.x - this.currentPlayer.x,
                    viewportOffsetHeight + tempPlayer.y - this.currentPlayer.y,
                    tempPlayer.angle, this.canvas
                );
            } else {
                // update the new coordinates and size
                tempPlayer.object.setValues({
                    x: viewportOffsetWidth + tempPlayer.x - this.currentPlayer.x,
                    y: viewportOffsetHeight + tempPlayer.y - this.currentPlayer.y,
                    angle: tempPlayer.angle,
                    width: tempPlayer.width,
                    height: tempPlayer.height,
                    color: tempPlayer.color
                });
            }
        });

        // Loop through all bullets
        Object.keys(this.bullets).map((key) => {
            let tempBullet = this.bullets[key];

            // Check if still visible, else dont render it
            if (tempBullet.x > this.viewport.width || tempBullet.x < -20 ||
                tempBullet.y > this.viewport.height || tempBullet.y < -20) {
                // this bullet isn't in the viewport, dont render it
                if (this.bullets[key].object) {
                    this.bullets[key].object.remove();
                }
                delete this.bullets[key];
                return;
            }

            // Check if player is already rendered/has a player object
            if (!tempBullet.object) {
                // Create new object at the correct location
                tempBullet.object = new Bullet(
                    viewportOffsetWidth + tempBullet.x - this.currentPlayer.x,
                    viewportOffsetHeight + tempBullet.y - this.currentPlayer.y,
                    tempBullet.angle,
                    this.canvas
                );
            } else {
                // update the new coordinates
                tempBullet.object.setPosition(
                    viewportOffsetWidth + tempBullet.x - this.currentPlayer.x,
                    viewportOffsetHeight + tempBullet.y - this.currentPlayer.y,
                    tempBullet.angle
                );
            }
        });
    }

    /**
     * Handle the window resize event
     */
    screenResizeEvent = () => {
        // change the canvas size
        this.canvas.setHeight(window.innerHeight)
        this.canvas.setWidth(window.innerWidth)
    }

    /**
     * Handle delta calculations
     *
     * @param fps
     * @param cb
     */
    deltaEvent = (fps, cb) => {
        let lastUpdate = Date.now();
        let timeoutDuration = 1000 / fps;
        setInterval(tick, timeoutDuration);

        function tick() {
            var now = Date.now();
            var dt = now - lastUpdate;
            lastUpdate = now;

            cb(dt);
        }
    }

    /**
     * Receive a list of all active players including the current client
     * @param newPlayers
     * @private
     */
    _SocketPlayers = (newPlayers) => {
        Object.keys(newPlayers).map((key) => {
            // remove this client from the list by client_id
            if (key === this.client_id) {
                // Update our player values
                this.currentPlayer.setValues({
                    x: newPlayers[key].x,
                    y: newPlayers[key].y,
                    width: newPlayers[key].width,
                    height: newPlayers[key].height,
                    angle: newPlayers[key].angle,
                    color: newPlayers[key].color,
                })
                // Update the view
                this.currentPlayer.update();

                // Remove from the list
                delete newPlayers[key];
            } else {
                if (!this.players[key]) {
                    // Add a new player
                    this.players[key] = {
                        x: newPlayers[key].x,
                        y: newPlayers[key].y,
                        width: newPlayers[key].width,
                        height: newPlayers[key].height,
                        angle: newPlayers[key].angle,
                        color: newPlayers[key].color,
                        object: false
                    }
                } else {
                    // Object.assign(this.players[key], newPlayers[key]);
                    // Update existing player
                    this.players[key].x = newPlayers[key].x;
                    this.players[key].y = newPlayers[key].y;
                    this.players[key].width = newPlayers[key].width;
                    this.players[key].height = newPlayers[key].height;
                    this.players[key].angle = newPlayers[key].angle;
                    this.players[key].color = newPlayers[key].color;
                }
            }
        })
    }

    /**
     * Receive a list of all active bullets including the current client
     * @param newPlayers
     * @private
     */
    _SocketBullets = (newBullets) => {
        Object.keys(newBullets).map((key) => {
            if (!this.bullets[key]) {
                // Add a new player
                this.bullets[key] = {
                    x: newBullets[key].x,
                    y: newBullets[key].y,
                    angle: newBullets[key].angle,
                    object: false
                }
            } else {
                // Update existing player
                this.bullets[key].x = newBullets[key].x;
                this.bullets[key].y = newBullets[key].y;
            }
        })
    }

    /**
     * Receive a ID that the server has assigned to us
     * @param id
     * @private
     */
    _SocketUpdateId = (id) => {
        // We received a new ID
        this.client_id = id;

        // Send our location
        this.currentPlayer.emitInfo();
    }

    /**
     * Update the viewport width and height
     * @param viewportData
     * @private
     */
    _SocketUpdateViewport = (viewportData) => {
        this.viewport.updateSize(viewportData.width, viewportData.height);
    }

    /**
     * Remove a player by ID
     * @param playerId
     * @private
     */
    _SocketPlayerLeave = (playerId) => {
        if (this.players[playerId]) {
            // Check if player has a active object
            if (this.players[playerId].object) {
                // remove the object
                this.players[playerId].object.remove();
            }

            // Remove the player all together
            delete this.players[playerId];
        }
    }

    /**
     * Remove a bullet by ID
     * @param bulletId
     * @private
     */
    _SocketBulletHit = (bulletId) => {
        if (this.bullets[bulletId]) {
            // Check if bullet has a active object
            if (this.bullets[bulletId].object) {
                // remove the object
                this.bullets[bulletId].object.remove();
            }

            // Remove bullet all together
            delete this.bullets[bulletId];
        }
    }

    /**
     * Socket disconnect event
     * @private
     */
    _SocketDisconnect = () => {
        // Reset lists
        Object.keys(this.players).map((key) => {
            // Check if player has a active object
            if (this.players[key].object) {
                // remove the object
                this.players[key].object.remove();
            }
        });
        this.players = {};
    }

    /**
     * Set all socket handlers for the Game class
     */
    setSocketHandlers = () => {
        this.socket.on('disconnect', this._SocketDisconnect);
        this.socket.on('update id', this._SocketUpdateId);
        this.socket.on('update viewport', this._SocketUpdateViewport);
        this.socket.on('update players', this._SocketPlayers);
        this.socket.on('update bullets', this._SocketBullets);
        this.socket.on('player leave', this._SocketPlayerLeave);
        this.socket.on('bullet hit', this._SocketBulletHit);
    }
}
