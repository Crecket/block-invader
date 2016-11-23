import Player from './Player';

const moveSpeed = 100;
const turnSpeed = 45;

module.exports = class CurrentPlayer {
    constructor(canvas) {
        this.canvas = canvas;

        // store the current movement directions
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        }

        // generate a new player object
        this.player = new Player(50, 50, 0, this.canvas)

        // initially center player
        this.setCenter();
    }

    startMove = (direction) => {
        this.movement[direction] = true;
    }

    stopMove = (direction) => {
        this.movement[direction] = false;
    }

    update = (delta) => {
        let tempMoveSpeed = moveSpeed / delta;
        let tempTurnSpeed = turnSpeed / delta;
        let xChange = 0;
        let yChange = 0;
        let angleChange = 0;

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
            let tempNewAngle = this.player.angle + angleChange;

            // store a temp value for the current x/y
            let tempNewX = this.player.x;
            let tempNewY = this.player.y;

            // Calculate x/y based on angle
            if (yChange > 0) {
                tempNewX += tempMoveSpeed * Math.cos((tempNewAngle + 90) * Math.PI / 180);
                tempNewY += tempMoveSpeed * Math.sin((tempNewAngle + 90) * Math.PI / 180);
            } else if (yChange < 0) {
                tempNewX -= tempMoveSpeed * Math.cos((tempNewAngle + 90) * Math.PI / 180);
                tempNewY -= tempMoveSpeed * Math.sin((tempNewAngle + 90) * Math.PI / 180);
            }

            // check out of bounds
            if (tempNewX < 0 - this.player.width / 2) {
                tempNewX = this.canvas.width - this.player.width / 2;
                tempNewY = this.swapY(tempNewY);
            }
            if (tempNewX > this.canvas.width - this.player.width / 2) {
                tempNewX = 0 - this.player.width / 2
                tempNewY = this.swapY(tempNewY);
            }
            if (tempNewY < 0 - this.player.height / 2) {
                tempNewY = this.canvas.height - this.player.height / 2;
                tempNewX = this.swapX(tempNewX);
            }
            if (tempNewY > this.canvas.height - this.player.height / 2) {
                tempNewY = 0 - this.player.height / 2
                tempNewX = this.swapX(tempNewX);
            }

            // update the player
            this.player.setPosition(
                tempNewX,
                tempNewY,
                tempNewAngle
            );
        }
    }

    swapY = (newY) => {
        return this.canvas.height - newY;
    }

    swapX = (newX) => {
        return this.canvas.width - newX;
    }

    setCenter = () => {
        this.player.setPosition(
            (this.canvas.width / 2) - this.player.width / 2,
            (this.canvas.height / 2) - this.player.width / 2,
            0
        )
    }

}