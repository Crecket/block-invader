import Player from './Player';

const moveSpeed = 80;
const turnSpeed = 45;

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

        // Random color
        this.player.setPropertyValue('color', '#' + '0123456789abcdef'.split('').map(function (v, i, a) {
                return i > 5 ? null : a[Math.floor(Math.random() * 16)]
            }).join(''))

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
     * Send the current location to the server
     */
    emitInfo = () => {
        this.socket.emit('update player', {
            x: this.x,
            y: this.y,
            angle: this.angle,
            color: this.player.properties.color,
            actions: this.actions
        });
    }
}