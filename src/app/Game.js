// import Grid from './Grid'
import CurrentPlayer from './CurrentPlayer';

module.exports = class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height

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

        // Resize screen handler
        $(window).on('resize', this.screenResizeEvent);

        // Generate a current player object
        this.currentPlayer = new CurrentPlayer(this.canvas);

        // Initial screen size check
        this.screenResizeEvent();

        // Timer with a delta value to keep everyone moving at the same speed
        this.deltaEvent(60, (delta) => {
            // Update the player
            this.currentPlayer.update(delta)
        });

    }

    handleKeyDown = (e) => {
        e = e || window.event;

        switch (e.keyCode) {
            case 38:
            case 87:
                this.currentPlayer.startMove('up');
                break;
            case 40:
            case 83:
                this.currentPlayer.startMove('down');
                break;
            case 37:
            case 65:
                this.currentPlayer.startMove('left');
                break;
            case 39:
            case 68:
                this.currentPlayer.startMove('right');
                break;
        }
    }

    handleKeyUp = (e) => {
        e = e || window.event;

        switch (e.keyCode) {
            case 38:
            case 87:
                this.currentPlayer.stopMove('up');
                break;
            case 40:
            case 83:
                this.currentPlayer.stopMove('down');
                break;
            case 37:
            case 65:
                this.currentPlayer.stopMove('left');
                break;
            case 39:
            case 68:
                this.currentPlayer.stopMove('right');
                break;
        }
    }

    screenResizeEvent = () => {
        // change the canvas size
        this.canvas.setHeight(window.innerHeight)
        this.canvas.setWidth(window.innerWidth)
    }


    deltaEvent = (fps, cb) => {
        let lastUpdate = Date.now();
        let timeoutDuration = 1000 / fps;
        let myInterval = setInterval(tick, timeoutDuration);

        function tick() {
            var now = Date.now();
            var dt = now - lastUpdate;
            lastUpdate = now;

            cb(dt);
        }
    }
}
