import Grid from './Grid.js'

module.exports = class Game {
    constructor() {
        // Create a new canvas element
        this.canvas = new fabric.Canvas('canvas', {
            width: 500,
            height: 500,
            selection: false,
            hoverCursor: 'pointer',
        });

        // Generate a grid
        this.grid = new Grid(10, 10, this.canvas)

        // set the event listeners
        this.setEventListeners();
    }

    setEventListeners = () => {
        this.canvas.on('mouse:over', this.objectOnMouseOver);
        this.canvas.on('mouse:out', this.objectOnMouseOut);
    }

    objectOnMouseOver = (e) => {
        if (e.target) {
            e.target.animate('angle', 5, {
                duration: 500,
                onChange: this.canvas.renderAll.bind(this.canvas),
                easing: fabric.util.ease.easeOutBounce
            });
            this.canvas.renderAll();
        }
    }

    objectOnMouseOut = (e) => {
        if (e.target) {
            e.target.animate('angle', 0, {
                duration: 500,
                onChange: this.canvas.renderAll.bind(this.canvas),
                easing: fabric.util.ease.easeOutBounce
            });
            this.canvas.renderAll();
        }
    };
}