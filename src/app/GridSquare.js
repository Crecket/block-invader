module.exports = class Grid {
    constructor(x, y, blockWidth, blockHeight, canvas) {
        this.x = x;
        this.y = y;
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;

        // the canvas object
        this.canvas = canvas;

        // the current rect object
        this.rect = false;

        // user info
        this.owned = false;
        this.score = 0;

        // create a new rect
        this.createRect();

        // set the object handlers
        this.setHandlers();

        this.canvas.add(new fabric.Text('' + this.score, {
            left: this.x + (this.blockWidth / 2) - 5,
            top: this.y + (this.blockHeight / 2) - 10,
            textAlign: 'center',
            selectable: false,
            fontSize: 20
        }));

        // return the rect
        return this.rect;
    }

    update = () => {

    }



    setHandlers = () => {
        this.rect.on('mouseover', () => {
            // percentage modifier
            let percentageMod = 7;

            this.rect.set('left', this.x + (this.blockWidth / percentageMod / 2));
            this.rect.set('top', this.y + (this.blockHeight / percentageMod / 2));
            this.rect.set('width', this.blockWidth - (this.blockWidth / percentageMod));
            this.rect.set('height', this.blockHeight - (this.blockHeight / percentageMod));
            this.canvas.renderAll();
        })

        this.rect.on('mouseout', () => {
            this.rect.set('left', this.x);
            this.rect.set('top', this.y);
            this.rect.set('width', this.blockWidth);
            this.rect.set('height', this.blockHeight);
            this.canvas.renderAll();
        });
    }

    createRect = () => {
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
            selectable: false,
            fill: 'grey'
        });

        // add the rect to the canvas
        this.canvas.add(this.rect);
    }

}