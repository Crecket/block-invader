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

        // store the current movement directions
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false,
            sprint: false
        }

        // generate a new player object
        this.player = new Player(this.x, this.y, this.angle, this.canvas)
        this.player.setPropertyValue('color', '#' + '0123456789abcdef'.split('').map(function (v, i, a) {
                return i > 5 ? null : a[Math.floor(Math.random() * 16)]
            }).join(''))
        this.update(16);
    }

    /**
     * Start moving in a direction
     * @param direction
     */
    startMove = (direction) => {
        this.movement[direction] = true;
    }

    /**
     * Stop moving in a direction
     * @param direction
     */
    stopMove = (direction) => {
        this.movement[direction] = false;
    }

    /**
     * Update this player on the canvas
     * @param delta
     */
    update = (delta) => {
        let tempMoveSpeed = moveSpeed / delta;
        let tempTurnSpeed = turnSpeed / delta;
        let xChange = 0;
        let yChange = 0;
        let angleChange = 0;

        if (this.movement.sprint) {
            tempMoveSpeed += 1.5;
            tempTurnSpeed *= 0.7;
        }

        // Go through all active movements
        if (this.movement.up) {
            yChange -= tempMoveSpeed;
        }
        if (this.movement.down) {
            yChange += tempMoveSpeed;
        }
        if (this.movement.right) {
            angleChange += tempTurnSpeed;
        }
        if (this.movement.left) {
            angleChange -= tempTurnSpeed;
        }

        // Check if we require to update player position
        if (xChange !== 0 || yChange !== 0 || angleChange !== 0) {
            // calculate the new angle
            let tempNewAngle = this.angle + angleChange;

            // store a temp value for the current x/y
            let tempNewX = this.x;
            let tempNewY = this.y;

            // Calculate x/y based on angle
            if (yChange > 0) {
                tempNewX += tempMoveSpeed * Math.cos((tempNewAngle + 90) * Math.PI / 180);
                tempNewY += tempMoveSpeed * Math.sin((tempNewAngle + 90) * Math.PI / 180);
            } else if (yChange < 0) {
                tempNewX -= tempMoveSpeed * Math.cos((tempNewAngle + 90) * Math.PI / 180);
                tempNewY -= tempMoveSpeed * Math.sin((tempNewAngle + 90) * Math.PI / 180);
            }

            // check out of bounds
            if (tempNewX < 0) {
                tempNewX = 0;
            }
            if (tempNewX > this.viewport.width - this.player.width) {
                tempNewX = this.viewport.width - this.player.width;
            }
            if (tempNewY < 0) {
                tempNewY = 0;
            }
            if (tempNewY > this.viewport.height - this.player.height) {
                tempNewY = this.viewport.height - this.player.height;
            }

            // Update values
            this.x = tempNewX;
            this.y = tempNewY;
            this.angle = tempNewAngle;

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
    }

    /**
     * Tell the server we want to fire
     */
    fire = () => {
        return;
        this.socket.emit('fire');
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
        });
    }

}