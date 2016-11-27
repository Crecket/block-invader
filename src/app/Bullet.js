module.exports = class Bullet {
    constructor(startX, startY, startAngle, canvas) {
        // Store parameters
        this.x = startX;
        this.y = startY;
        this.angle = startAngle;
        this.canvas = canvas;

        // Timeout fallback in case a bullet gets stuck or isn't removed propperly
        this.timeout = setTimeout(() => {
            if(this.bullet){
                this.bullet.remove();
            }
        }, 3000);

        // store the width and height
        this.width = 4;
        this.height = 4;

        // Extra propertiees
        this.properties = {
            color: '#fff',
        };

        // Generate the player object
        this.generate()
    }

    /**
     * Update any changed values for this player object on the canvas
     */
    update = () => {
        // Update the canvas object
        this.bullet.set({
            left: this.x,
            top: this.y,
            fill: this.properties.color
        });

        // Update the canvas
        this.bullet.setCoords();
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
     * Sets a property value
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
        this.bullet.remove();
        this.bullet = false;
    }

    /**
     * Generate the initial player object on the canvas
     */
    generate = () => {
        this.bullet = new fabric.Rect({
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
        this.canvas.add(this.bullet);
    }
}