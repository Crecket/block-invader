import GridSquare from './GridSquare.js';

module.exports = class Grid {
    constructor(xBlocks, yBlocks, canvas) {
        this.xBlocks = xBlocks;
        this.yBlocks = yBlocks;
        this.canvas = canvas;

        // some settings
        this.padding = 5;
        this.blockPadding = 10;

        // contains all the squares as GridSquare object
        this.gridSquares = [];

        this.blockWidth = ((this.canvas.width - (this.padding * 2)) - ((this.xBlocks - 1) * this.blockPadding)) / this.xBlocks
        this.blockHeight = ((this.canvas.height - (this.padding * 2)) - ((this.yBlocks - 1) * this.blockPadding)) / this.yBlocks

        this.generateGrid()
    }

    generateGrid = () => {

        // set the initial X coord
        let currentX = this.padding;

        // Loop through all X colls
        for (let x = 0; x < this.xBlocks; x++) {

            // reset Y for this x row
            let currentY = this.padding;

            // Loop through all Y rows
            for (let y = 0; y < this.yBlocks; y++) {

                // create a new gridsquare
                let rect = new GridSquare(currentX, currentY, this.blockWidth, this.blockHeight, this.canvas);

                // add to the list
                this.gridSquares.push(rect)

                // update the Y coordinate
                currentY = currentY + (this.blockPadding + this.blockHeight);
            }

            // Reset Y again to go to next coll
            currentY = this.padding;

            // Go to next coll
            currentX = currentX + (this.blockPadding + this.blockWidth);
        }
    }
}