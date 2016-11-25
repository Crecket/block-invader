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
            // angle: this.angle,
            top: this.canvas.height / 2 - 32 - this.y,
            left: this.canvas.width / 2 - 24 - this.x,
            fill: 'black'
        })
        this.canvas.add(this.viewport);
    }

    /**
     * Sets the player position and angle to a new value
     *
     * @param x
     * @param y
     * @param angle
     */
    setPosition = (x, y, angle) => {
        this.playerX = x;
        this.playerY = y;
        // this.angle = angle % 360;
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
        let screenCenterHeight = this.canvas.height / 2 - 32;
        let screenCenterWidth = this.canvas.width / 2 - 24;

        // Update the values
        this.viewport.set({
            width: this.width,
            height: this.height,
            // angle: this.angle,
            top: screenCenterHeight + this.height / 2 - this.playerY,
            left: screenCenterWidth + this.width / 2 - this.playerX,

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

}
