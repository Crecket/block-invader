module.exports = class Grid {
    constructor(x, y, blockWidth, blockHeight, canvas) {
        this.x = x;
        this.y = y;
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
        this.canvas = canvas;
        this.rect = false;

        // create a new rect
        this.createRect();

        // return the rect
        return this.rect;
    }

    createRect = () =>{
        // create a new rect
        this.rect = new fabric.Rect({
            left: this.x,
            top: this.y,
            width: this.blockWidth,
            height: this.blockHeight,

            hasControls: false,
            hasBorders: false,
            hasRotatingPoint: false,
            lockMovementX: true,
            lockMovementY: true,
            fill: 'grey'
        });

        // add the rect to the canvas
        this.canvas.add(this.rect);
    }

}