module.exports = class Player {
    constructor(startX, startY, canvas) {
        this.x = startX;
        this.y = startY;
        this.canvas = canvas;
        this.width = 32;
        this.radius = this.width / 2;

        this.properties = {
            color: 'grey'
        };

        this.generatePlayer()
    }

    /**
     * Update any changed values for this player object on the canvas
     */
    update = () => {
        this.player.set({
            left: this.x,
            top: this.y,
            radius: this.radius,
            fill: this.properties.color
        })
    }

    /**
     * Sets the player position to a new value
     *
     * @param x
     * @param y
     */
    setPosition = (x, y) => {
        this.x = x;
        this.y = y;
        this.update();
    }

    /**
     * Sets a property value
     *
     * @param key
     * @param value
     */
    setValue = (key, value) => {
        this.properties[key] = value;
        this.update();
    }

    /**
     * Generate the initial player object on the canvas
     */
    generatePlayer = () => {
        this.player = new fabric.Circle({
            left: this.x,
            top: this.y,
            fill: this.properties.color,

            radius: this.radius,
            hasControls: false,
            hasBorders: false,
            hasRotatingPoint: false,
            lockMovementX: true,
            lockMovementY: true,
            selectable: false,
            hoverCursor: 'default',
        });
        this.canvas.add(this.player);
    }
}