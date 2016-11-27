import Player from './Player';

module.exports = class CurrentPlayer {
    constructor(canvas, socket, viewport) {
        this.canvas = canvas;
        this.socket = socket;
        this.viewport = viewport;

        // Virtual position
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.allowFire = new Date().getTime();

        // store the current actions directions
        this.actions = {
            up: false,
            down: false,
            left: false,
            right: false,
            sprint: false,
            fire: false
        }

        // Generate a new player object
        this.player = new Player(this.x, this.y, this.angle, this.canvas)

        // Initial update
        this.update();
    }

    /**
     * Start moving in a direction
     * @param direction
     */
    startAction = (direction) => {
        this.actions[direction] = true;
    }

    /**
     * Stop moving in a direction
     * @param direction
     */
    stopAction = (direction) => {
        this.actions[direction] = false;
    }

    /**
     * Clear all actions
     */
    clearActions = () => {
        this.actions = {
            up: false,
            down: false,
            left: false,
            right: false,
            sprint: false,
            fire: false
        }
    }

    /**
     * Update this player on the canvas
     */
    update = () => {
        // update the player and set it in the center
        this.player.setPosition(
            this.canvas.width / 2 - this.player.width / 2,
            this.canvas.height / 2 - this.player.height / 2,
            this.angle
        );

        // modify the player coords to update the viewport
        this.viewport.setPosition(
            this.x,
            this.y,
            this.angle
        )

        // Send new location to server
        this.emitInfo();
    }

    /**
     * Send the current actions and color to the server, all other info is handled server side
     */
    emitInfo = () => {
        this.socket.emit('update player', {
            actions: this.actions
        });
    }
}