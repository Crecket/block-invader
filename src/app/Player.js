const playerWidth = 24;
const playerHeight = 32;

module.exports = class Player {
    constructor(startX, startY, startAngle, canvas) {
        // Store parameters
        this.x = startX;
        this.y = startY;
        this.angle = startAngle;
        this.canvas = canvas;

        // store the width and height
        this.width = playerWidth;
        this.height = playerHeight;

        // Extra propertiees
        this.properties = {
            color: '#222',
        };

        // Generate the player object
        this.generatePlayer()
    }

    /**
     * Update any changed values for this player object on the canvas
     */
    update = () => {
        // Update the canvas object
        this.player.set({
            'left': this.x,
            'top': this.y,
            'width': this.width,
            'angle': this.angle,
            'fill': this.properties.color
        });

        // Update the canvas
        this.player.setCoords();
        this.canvas.renderAll();
    }

    /**
     * Sets the player position and angle to a new value
     *
     * @param x
     * @param y
     * @param angle
     */
    setPosition = (x, y, angle) => {
        this.x = x;
        this.y = y;
        this.angle = angle % 360; // Prevent angles of > 360. So 440 becomes 80
        this.update();
    }

    /**
     * Sets a property value
     *
     * @param key
     * @param value
     */
    setPropertyValue = (key, value) => {
        this.properties[key] = value;
        this.update();
    }

    /**
     * Remove this player from the canvas
     */
    remove = () => {
        this.player.remove();
    }

    /**
     * Generate the initial player object on the canvas
     */
    generatePlayer = () => {
        this.player = new fabric.Path('M ' + (playerWidth / 2) + ' 0 ' + 'L ' + playerWidth + ' ' + playerHeight + ' ' + 'L ' + playerWidth / 2 + ' ' + (playerHeight * 0.8) + ' ' + 'L 0 ' + playerHeight + ' z');
        this.player.set({
            left: this.x,
            top: this.y,
            width: this.width,
            height: this.height,
            fill: this.properties.color,

            originX: 'center',
            originY: 'center',
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