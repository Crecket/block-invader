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
        document.onkeydown = this.checkKeyStroke;

        // Resize screen handler
        $(window).on('resize', this.screenResizeEvent);

        // Generate a current player
        this.currentPlayer = new CurrentPlayer(this.canvas);

        // Initial screen size check
        this.screenResizeEvent();

    }

    checkKeyStroke = (e) => {
        e = e || window.event;

        if (e.keyCode === 38 || e.keyCode === 87) {
            // up arrow or w
            this.player.move('up');
        } else if (e.keyCode === 40 || e.keyCode === 83) {
            // down arrow or s
            this.player.move('down');
        } else if (e.keyCode === 37 || e.keyCode === 65) {
            // left arrow or a
            this.player.move('left');
        } else if (e.keyCode === 39 || e.keyCode === 68) {
            // right arrow or d
            this.player.move('right');
        }else{

        }
    }

    checkScaleAlt = (event) => {
        let widthScale = this.width / window.innerWidth;
        let heigthScale = this.height / window.innerHeight;
        let usedScale = (heigthScale > widthScale) ? heigthScale : widthScale;

        // change the canvas size
        this.canvas.setHeight(this.height / usedScale)
        this.canvas.setWidth(this.width / usedScale)
    }

    screenResizeEvent = () =>{
        // change the canvas size
        this.canvas.setHeight(window.innerHeight)
        this.canvas.setWidth(window.innerWidth)

        // center the player
        this.currentPlayer.setCenter();
    }
}
