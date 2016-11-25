module.exports = class Viewport {

    constructor(canvas) {
        this.canvas = canvas;
        this.playerX = 0;
        this.playerY = 0;
        this.width = 400;
        this.height = 400;
        // this.angle = 0;

        // Create viewport object
        this.viewport = new fabric.Rect({
            width: this.width,
            height: this.height,
            top: this.getScreenCenterHeight(),
            left: this.getScreenCenterWidth(),
            fill: 'black'
        })
        this.canvas.add(this.viewport);

        // Update
        this.update();
    }

    /**
     * Sets the player position and angle to a new value
     *
     * @param x
     * @param y
     */
    setPosition = (x, y, angle) => {
        this.playerX = x;
        this.playerY = y;
        this.update();
    }

    /**
     * Update the viewport height
     * @param width
     * @param height
     */
    updateSize = (width, height) => {
        this.width = width;
        this.height = height;
        this.update();
    }

    /**
     * Re-render the viewport
     */
    update = () => {

        // Update the values
        this.viewport.set({
            width: this.width,
            height: this.height,
            top: this.getScreenCenterHeight(),
            left: this.getScreenCenterWidth(),

            originX: 'center',
            originY: 'center',
            hasControls: false,
            hasBorders: false,
            hasRotatingPoint: false,
            lockMovementX: true,
            lockMovementY: true,
            selectable: false,
            hoverCursor: 'default',
        })
    }

    getScreenCenterHeight = () => {
        return this.canvas.height / 2 - 32 + this.height / 2 - this.playerY;
    }

    getScreenCenterWidth = () => {
        return this.canvas.width / 2 - 24 + this.width / 2 - this.playerX;
    }

}
