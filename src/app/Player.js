module.exports = class Player {
    constructor(startX, startY, startAngle, canvas) {
        this.canvas = canvas;

        // Store parameters
        this.x = startX;
        this.y = startY;
        this.angle = startAngle;

        // store the default width and height
        this.width = 24;
        this.height = 32;

        // Extra propertiees
        this.color = '#666';

        // Generate the player object
        this.generatePlayer()
    }

    /**
     * Update any changed values for this player object on the canvas
     */
    update = () => {
        // Since this is a path we have to completely redo the player if width/height changes
        if (this.width !== this.player.width || this.height !== this.player.height) {
            // Remove first
            this.player.remove();

            // Redraw player
            this.generatePlayer();
            return;
        }
        // Update the canvas object
        this.player.set({
            left: this.x,
            top: this.y,
            width: this.width,
            height: this.height,
            angle: this.angle,
            fill: this.color
        });

        // Update the canvas
        this.player.setCoords();
        this.canvas.renderAll();
    }

    /**
     * Sets the player position and angle to a new value
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
     * Generic function to update values
     * @param width
     * @param height
     */
    setValues = (values) => {
        Object.assign(this, values);
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
        this.player = new fabric.Path(this.getPathString());
        this.player.set({
            left: this.x,
            top: this.y,
            width: this.width,
            height: this.height,
            fill: this.color,

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

    /**
     * Generate the string to be used in the player path
     * @returns {string}
     */
    getPathString = () => {
        return 'M ' + (this.width / 2) + ' 0 ' + 'L ' + this.width + ' ' + this.height + ' ' + 'L ' + (this.width / 2) + ' ' + (this.height * 0.8) + ' ' + 'L 0 ' + this.height + ' z';
    }

}